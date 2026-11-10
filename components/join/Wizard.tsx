"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { browserClient } from "@/lib/supabase-browser";
import {
  experienceTypes,
  experienceYears,
  radii,
  services,
  visibleFields,
  weekdays,
  type ServiceField,
  type ServiceId,
} from "@/lib/services";

type Details = Record<string, string | string[]>;
type ServiceDraft = {
  years: string;
  experience_types: string[];
  experience_notes: string;
  rate: string;
  available_now: string;
  details: Details;
};
type AppDraft = {
  applicant_type: "individual" | "business";
  first_name: string;
  last_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  contact_method: string;
  other_skills: string;
  home_zip: string;
  radius_miles: string;
  preferred_areas: string;
  has_transportation: string;
  start_date: string;
  days: string[];
  day_windows: Record<string, string>;
  min_booking: string;
  notice: string;
  recurring: string;
  education_level: string;
  school: string;
  degree: string;
  is_student: string;
  training: string;
  display_name: string;
  headline: string;
  bio: string;
  loves: string;
  business_name: string;
  business_contact: string;
  business_phone: string;
  business_services: string[];
  business_areas: string;
  business_lead: string;
  consent_application: boolean;
  consent_service_email: boolean;
  consent_public_profile: boolean;
  consent_marketing: boolean;
  selected: ServiceId[];
  services: Partial<Record<ServiceId, ServiceDraft>>;
};

const emptyService = (): ServiceDraft => ({
  years: "",
  experience_types: [],
  experience_notes: "",
  rate: "",
  available_now: "",
  details: {},
});

const emptyDraft = (): AppDraft => ({
  applicant_type: "individual",
  first_name: "",
  last_name: "",
  preferred_name: "",
  email: "",
  phone: "",
  city: "",
  state: "GA",
  zip: "",
  contact_method: "Email",
  other_skills: "",
  home_zip: "",
  radius_miles: "10",
  preferred_areas: "",
  has_transportation: "",
  start_date: "",
  days: [],
  day_windows: {},
  min_booking: "",
  notice: "",
  recurring: "",
  education_level: "",
  school: "",
  degree: "",
  is_student: "",
  training: "",
  display_name: "",
  headline: "",
  bio: "",
  loves: "",
  business_name: "",
  business_contact: "",
  business_phone: "",
  business_services: [],
  business_areas: "",
  business_lead: "",
  consent_application: false,
  consent_service_email: false,
  consent_public_profile: false,
  consent_marketing: false,
  selected: [],
  services: {},
});

const individualSteps = ["About you", "Services", "Skills", "Where and when", "Background", "Public profile", "Review"];
const businessSteps = ["About you", "Your business", "Review"];

export function Wizard({ url, anonKey }: { url: string; anonKey: string }) {
  const supabase = useMemo(() => browserClient(url, anonKey), [url, anonKey]);
  const [user, setUser] = useState<User | null>(null);
  const [draft, setDraft] = useState<AppDraft>(emptyDraft);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const steps = draft.applicant_type === "business" ? businessSteps : individualSteps;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!user) return;
    loadDraft(supabase, user.id).then(async (loaded) => {
      if (loaded) {
        setApplicationId(loaded.id);
        setSubmitted(loaded.status === "submitted");
        setDraft(loaded.draft);
        return;
      }
      const saved = window.localStorage.getItem("dreamduos-join");
      const starting = saved ? { ...emptyDraft(), ...JSON.parse(saved) } : draft;
      const { data, error: insertError } = await supabase
        .from("provider_applications")
        .insert({ user_id: user.id, ...applicationPayload({ ...starting, email: starting.email || user.email || "" }) })
        .select("id")
        .single();
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setDraft(starting);
      setApplicationId(data.id);
      window.localStorage.removeItem("dreamduos-join");
    });
    // Load once per signed-in user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, user]);

  useEffect(() => {
    if (!user || !applicationId || submitted) return;
    const handle = setTimeout(() => {
      saveDraft(supabase, applicationId, draft).catch((reason: Error) => setError(reason.message));
    }, 700);
    return () => clearTimeout(handle);
  }, [draft, user, applicationId, submitted, supabase]);

  async function sendLink(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const redirect = `${window.location.origin}/auth/callback?next=/join`;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: draft.email,
      options: { emailRedirectTo: redirect },
    });
    setBusy(false);
    setMessage(authError ? "" : `Check ${draft.email} for a sign-in link. Your answers stay in this browser until you return.`);
    setError(authError?.message ?? "");
    if (!authError) window.localStorage.setItem("dreamduos-join", JSON.stringify(draft));
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("dreamduos-join");
    if (!saved || user) return;
    try {
      setDraft({ ...emptyDraft(), ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem("dreamduos-join");
    }
  }, [user]);

  async function ensureApplication() {
    if (!user) return null;
    if (applicationId) return applicationId;
      const { data, error: insertError } = await supabase
      .from("provider_applications")
      .insert({ user_id: user.id, ...applicationPayload(draft) })
      .select("id")
      .single();
    if (insertError) {
      setError(insertError.message);
      return null;
    }
    setApplicationId(data.id);
    window.localStorage.removeItem("dreamduos-join");
    return data.id as string;
  }

  async function submit() {
    if (!draft.consent_application || !draft.consent_service_email) {
      setError("The application agreement and service emails are required before you can submit.");
      return;
    }
    setBusy(true);
    setError("");
    const id = await ensureApplication();
    if (!id) {
      setBusy(false);
      return;
    }
    await saveDraft(supabase, id, draft);
    const { error: updateError } = await supabase
      .from("provider_applications")
      .update({ status: "submitted", submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id);
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSubmitted(true);
  }

  function update<K extends keyof AppDraft>(key: K, value: AppDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleService(id: ServiceId) {
    setDraft((current) => {
      const selected = current.selected.includes(id) ? current.selected.filter((item) => item !== id) : [...current.selected, id];
      const next = { ...current.services };
      if (!next[id]) next[id] = emptyService();
      return { ...current, selected, services: next };
    });
  }

  if (submitted) {
    return (
      <main className="join">
        <p className="eyebrow">Application received</p>
        <h1>Thank you. This is a request to join, not a job offer.</h1>
        <p className="lede">We’ll review each service on its own. Approval for one service does not wait on the others, and nothing is published yet.</p>
      </main>
    );
  }

  return (
    <main className="join">
      <a className="wordmark" href="/">dreamduos</a>
      <p className="eyebrow">Provider application</p>
      <h1>Join the Dream Duos network.</h1>
      <p className="lede">Tell us what you’re great at. You can leave and come back with the link we email you. Applying is not the same as being approved to take paid jobs.</p>
      <ol className="join-steps">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "is-current" : undefined}>
            <button type="button" onClick={() => setStep(index)}>{label}</button>
          </li>
        ))}
      </ol>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {message ? <p className="form-note">{message}</p> : null}

      {step === 0 ? (
        <form className="join-form" onSubmit={user ? (event) => { event.preventDefault(); setStep(1); } : sendLink}>
          <Choice label="I am applying as" value={draft.applicant_type} options={[["individual", "An individual"], ["business", "A business partner"]]} onChange={(value) => update("applicant_type", value as AppDraft["applicant_type"])} />
          <div className="split">
            <Field label="First name" value={draft.first_name} onChange={(value) => update("first_name", value)} />
            <Field label="Last name" value={draft.last_name} onChange={(value) => update("last_name", value)} />
          </div>
          <Field label="Email" type="email" value={draft.email} onChange={(value) => update("email", value)} required />
          <Field label="Mobile" value={draft.phone} onChange={(value) => update("phone", value)} />
          <div className="split">
            <Field label="City" value={draft.city} onChange={(value) => update("city", value)} />
            <Field label="State" value={draft.state} onChange={(value) => update("state", value)} />
            <Field label="ZIP" value={draft.zip} onChange={(value) => update("zip", value)} />
          </div>
          <Choice label="Preferred contact" value={draft.contact_method} options={["Email", "SMS", "Either"].map((item) => [item, item])} onChange={(value) => update("contact_method", value)} />
          {!user ? <button className="button" disabled={busy || !draft.email}>Email me a link to continue</button> : <button className="button" type="submit">Continue</button>}
        </form>
      ) : null}

      {user && draft.applicant_type === "individual" && step === 1 ? (
        <section className="join-form">
          <p>Select every service you’d like to offer. Each one gets its own questions.</p>
          <div className="service-picker">
            {services.map((service) => (
              <button key={service.id} type="button" className={draft.selected.includes(service.id) ? "is-selected" : undefined} onClick={() => toggleService(service.id)} aria-pressed={draft.selected.includes(service.id)}>
                <strong>{service.label}</strong>
                <span>{service.description}</span>
              </button>
            ))}
          </div>
          <Field label="Other skills" value={draft.other_skills} onChange={(value) => update("other_skills", value)} />
          <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </section>
      ) : null}

      {user && draft.applicant_type === "individual" && step === 2 ? (
        <section className="join-form">
          {draft.selected.length === 0 ? <p>Choose at least one service first.</p> : null}
          {draft.selected.map((serviceId) => {
            const service = services.find((item) => item.id === serviceId)!;
            const record = draft.services[serviceId] ?? emptyService();
            return (
              <article key={serviceId} className="service-block">
                <h2>{service.label}</h2>
                {serviceId === "massage" ? <p className="form-note">Without an active Georgia massage license, this service cannot be approved. Your other services are unaffected.</p> : null}
                {serviceId === "childcare" ? <p className="form-note">Saying you have passed a background check is not verification. Childcare stays pending until Dream Duos completes its own screening.</p> : null}
                <Choice label="Years of experience" value={record.years} options={experienceYears.map((item) => [item, item])} onChange={(value) => patchService(setDraft, serviceId, { years: value })} />
                <Checks label="Experience type" options={experienceTypes} value={record.experience_types} onChange={(value) => patchService(setDraft, serviceId, { experience_types: value })} />
                <label className="stack">Tell us about your experience
                  <textarea maxLength={500} value={record.experience_notes} onChange={(event) => patchService(setDraft, serviceId, { experience_notes: event.target.value })} />
                </label>
                <Choice label="Available to offer this now?" value={record.available_now} options={[["Yes", "Yes"], ["Later", "Later"]]} onChange={(value) => patchService(setDraft, serviceId, { available_now: value })} />
                <Field label="Expected earnings, optional" value={record.rate} onChange={(value) => patchService(setDraft, serviceId, { rate: value })} />
                {visibleFields(serviceId, record.details).map((field) => (
                  <ServiceInput key={field.key} field={field} details={record.details} onChange={(details) => patchService(setDraft, serviceId, { details })} />
                ))}
              </article>
            );
          })}
          <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </section>
      ) : null}

      {user && draft.applicant_type === "individual" && step === 3 ? (
        <section className="join-form">
          <Field label="Home base ZIP" value={draft.home_zip} onChange={(value) => update("home_zip", value)} />
          <Choice label="Service radius" value={draft.radius_miles} options={radii.map((item) => [item, `${item} miles`])} onChange={(value) => update("radius_miles", value)} />
          <Field label="Preferred cities or ZIPs" value={draft.preferred_areas} onChange={(value) => update("preferred_areas", value)} />
          <Choice label="Reliable transportation" value={draft.has_transportation} options={[["Yes", "Yes"], ["No", "No"]]} onChange={(value) => update("has_transportation", value)} />
          <Field label="Earliest start date" type="date" value={draft.start_date} onChange={(value) => update("start_date", value)} />
          <Checks label="Days available" options={weekdays} value={draft.days} onChange={(value) => update("days", value)} />
          {draft.days.map((day) => (
            <Field key={day} label={`${day} hours`} value={draft.day_windows[day] ?? ""} onChange={(value) => update("day_windows", { ...draft.day_windows, [day]: value })} />
          ))}
          <Choice label="Minimum booking" value={draft.min_booking} options={["1 hour", "2 hours", "3 hours", "4+ hours"].map((item) => [item, item])} onChange={(value) => update("min_booking", value)} />
          <Choice label="Advance notice" value={draft.notice} options={["Same day", "24 hours", "48 hours", "Longer"].map((item) => [item, item])} onChange={(value) => update("notice", value)} />
          <Choice label="Available for recurring work" value={draft.recurring} options={[["Yes", "Yes"], ["No", "No"]]} onChange={(value) => update("recurring", value)} />
          <Nav onBack={() => setStep(2)} onNext={() => setStep(4)} />
        </section>
      ) : null}

      {user && draft.applicant_type === "individual" && step === 4 ? (
        <section className="join-form">
          <p className="form-note">Education and licenses can be added now or later. References are not part of this first application.</p>
          <Field label="Highest education" value={draft.education_level} onChange={(value) => update("education_level", value)} />
          <Field label="School" value={draft.school} onChange={(value) => update("school", value)} />
          <Field label="Degree or area of study" value={draft.degree} onChange={(value) => update("degree", value)} />
          <Choice label="Currently a student?" value={draft.is_student} options={[["Yes", "Yes"], ["No", "No"]]} onChange={(value) => update("is_student", value)} />
          <label className="stack">Training or certifications
            <textarea value={draft.training} onChange={(event) => update("training", event.target.value)} />
          </label>
          <Nav onBack={() => setStep(3)} onNext={() => setStep(5)} />
        </section>
      ) : null}

      {user && draft.applicant_type === "individual" && step === 5 ? (
        <section className="join-form">
          <p className="form-note">This is a draft. Nothing is published until Dream Duos reviews it and you agree.</p>
          <Field label="Display name" value={draft.display_name} onChange={(value) => update("display_name", value)} />
          <Field label="Headline" value={draft.headline} onChange={(value) => update("headline", value)} />
          <label className="stack">About me
            <textarea maxLength={600} value={draft.bio} onChange={(event) => update("bio", event.target.value)} />
          </label>
          <label className="stack">What I love about helping others
            <textarea value={draft.loves} onChange={(event) => update("loves", event.target.value)} />
          </label>
          <Nav onBack={() => setStep(4)} onNext={() => setStep(6)} />
        </section>
      ) : null}

      {user && draft.applicant_type === "business" && step === 1 ? (
        <section className="join-form">
          <Field label="Business name" value={draft.business_name} onChange={(value) => update("business_name", value)} />
          <Field label="Contact person" value={draft.business_contact} onChange={(value) => update("business_contact", value)} />
          <Field label="Business phone" value={draft.business_phone} onChange={(value) => update("business_phone", value)} />
          <Checks label="Services offered" options={services.map((service) => service.label)} value={draft.business_services} onChange={(value) => update("business_services", value)} />
          <Field label="Areas served" value={draft.business_areas} onChange={(value) => update("business_areas", value)} />
          <Choice label="How should we send leads?" value={draft.business_lead} options={[["referral", "Referral only"], ["booking", "Direct booking"]]} onChange={(value) => update("business_lead", value)} />
          <Nav onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </section>
      ) : null}

      {user && step === steps.length - 1 ? (
        <section className="join-form">
          <h2>Review</h2>
          <p>{draft.first_name} {draft.last_name} · {draft.email}</p>
          <p>{draft.applicant_type === "business" ? draft.business_name : draft.selected.map((id) => services.find((service) => service.id === id)?.label).join(", ") || "No services selected"}</p>
          <label className="check"><input type="checkbox" checked={draft.consent_application} onChange={(event) => update("consent_application", event.target.checked)} /> I agree to the application terms and privacy policy. This is a request to join, not approval to accept paid work.</label>
          <label className="check"><input type="checkbox" checked={draft.consent_service_email} onChange={(event) => update("consent_service_email", event.target.checked)} /> Dream Duos may email me about this application.</label>
          <label className="check"><input type="checkbox" checked={draft.consent_public_profile} onChange={(event) => update("consent_public_profile", event.target.checked)} /> Dream Duos may later publish an approved public profile. Optional.</label>
          <label className="check"><input type="checkbox" checked={draft.consent_marketing} onChange={(event) => update("consent_marketing", event.target.checked)} /> Send occasional news. Optional.</label>
          <div className="join-nav">
            <button className="button button-light" type="button" onClick={() => setStep(step - 1)}>Back</button>
            <button className="button" type="button" disabled={busy} onClick={() => { ensureApplication().then(submit); }}>Submit application</button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Nav({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="join-nav">
      <button className="button button-light" type="button" onClick={onBack}>Back</button>
      <button className="button" type="button" onClick={onNext}>Continue</button>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="stack">{label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Choice({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map(([option, text]) => (
        <label key={option} className="check"><input type="radio" name={label} checked={value === option} onChange={() => onChange(option)} /> {text}</label>
      ))}
    </fieldset>
  );
}

function Checks({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (value: string[]) => void }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option} className="check">
          <input type="checkbox" checked={value.includes(option)} onChange={() => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])} /> {option}
        </label>
      ))}
    </fieldset>
  );
}

function ServiceInput({ field, details, onChange }: { field: ServiceField; details: Details; onChange: (details: Details) => void }) {
  const current = details[field.key];
  if (field.kind === "text" || field.kind === "textarea") {
    const Input = field.kind === "textarea" ? "textarea" : "input";
    return (
      <label className="stack">{field.label}
        <Input value={typeof current === "string" ? current : ""} onChange={(event) => onChange({ ...details, [field.key]: event.target.value })} />
      </label>
    );
  }
  if (field.kind !== "choice") return null;
  if (field.multiple) {
    const selected = Array.isArray(current) ? current : [];
    return <Checks label={field.label} options={field.options} value={selected} onChange={(value) => onChange({ ...details, [field.key]: value })} />;
  }
  return <Choice label={field.label} value={typeof current === "string" ? current : ""} options={field.options.map((option) => [option, option])} onChange={(value) => onChange({ ...details, [field.key]: value })} />;
}

function patchService(setDraft: (value: (current: AppDraft) => AppDraft) => void, id: ServiceId, patch: Partial<ServiceDraft>) {
  setDraft((current) => {
    const existing = current.services[id] ?? emptyService();
    return { ...current, services: { ...current.services, [id]: { ...existing, ...patch, details: patch.details ?? existing.details } } };
  });
}

function applicationPayload(draft: AppDraft) {
  return {
    applicant_type: draft.applicant_type,
    first_name: draft.first_name,
    last_name: draft.last_name,
    preferred_name: draft.preferred_name,
    email: draft.email,
    phone: draft.phone,
    city: draft.city,
    state: draft.state,
    zip: draft.zip,
    contact_method: draft.contact_method,
    other_skills: draft.other_skills,
    home_zip: draft.home_zip,
    radius_miles: Number(draft.radius_miles) || null,
    preferred_areas: draft.preferred_areas,
    has_transportation: draft.has_transportation === "" ? null : draft.has_transportation === "Yes",
    start_date: draft.start_date || null,
    days: draft.days,
    day_windows: draft.day_windows,
    min_booking: draft.min_booking,
    notice: draft.notice,
    recurring: draft.recurring === "" ? null : draft.recurring === "Yes",
    education_level: draft.education_level,
    school: draft.school,
    degree: draft.degree,
    is_student: draft.is_student === "" ? null : draft.is_student === "Yes",
    training: draft.training,
    display_name: draft.display_name,
    headline: draft.headline,
    bio: draft.bio,
    loves: draft.loves,
    business: {
      name: draft.business_name,
      contact: draft.business_contact,
      phone: draft.business_phone,
      services: draft.business_services,
      areas: draft.business_areas,
      lead: draft.business_lead,
    },
    consent_application: draft.consent_application,
    consent_service_email: draft.consent_service_email,
    consent_public_profile: draft.consent_public_profile,
    consent_marketing: draft.consent_marketing,
    updated_at: new Date().toISOString(),
  };
}

async function saveDraft(supabase: SupabaseClient, id: string, draft: AppDraft) {
  const { error } = await supabase.from("provider_applications").update(applicationPayload(draft)).eq("id", id);
  if (error) throw new Error(error.message);
  if (draft.applicant_type === "business") return;
  for (const service of services) {
    const record = draft.services[service.id] ?? emptyService();
    const active = draft.selected.includes(service.id);
    const { error: serviceError } = await supabase.from("provider_services").upsert({
      application_id: id,
      service: service.id,
      active,
      years: record.years,
      experience_types: record.experience_types,
      experience_notes: record.experience_notes,
      rate: record.rate,
      available_now: record.available_now,
      details: record.details,
      updated_at: new Date().toISOString(),
    }, { onConflict: "application_id,service" });
    if (serviceError) throw new Error(serviceError.message);
  }
}

async function loadDraft(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from("provider_applications").select("*").eq("user_id", userId).maybeSingle();
  if (error || !data) return null;
  const { data: rows } = await supabase.from("provider_services").select("*").eq("application_id", data.id);
  const selected: ServiceId[] = [];
  const serviceDrafts: AppDraft["services"] = {};
  for (const row of rows ?? []) {
    if (row.active) selected.push(row.service);
    serviceDrafts[row.service as ServiceId] = {
      years: row.years ?? "",
      experience_types: row.experience_types ?? [],
      experience_notes: row.experience_notes ?? "",
      rate: row.rate ?? "",
      available_now: row.available_now ?? "",
      details: row.details ?? {},
    };
  }
  const business = data.business ?? {};
  const draft: AppDraft = {
    ...emptyDraft(),
    applicant_type: data.applicant_type,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    preferred_name: data.preferred_name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    city: data.city ?? "",
    state: data.state ?? "GA",
    zip: data.zip ?? "",
    contact_method: data.contact_method ?? "Email",
    other_skills: data.other_skills ?? "",
    home_zip: data.home_zip ?? "",
    radius_miles: data.radius_miles ? String(data.radius_miles) : "10",
    preferred_areas: data.preferred_areas ?? "",
    has_transportation: data.has_transportation == null ? "" : data.has_transportation ? "Yes" : "No",
    start_date: data.start_date ?? "",
    days: data.days ?? [],
    day_windows: data.day_windows ?? {},
    min_booking: data.min_booking ?? "",
    notice: data.notice ?? "",
    recurring: data.recurring == null ? "" : data.recurring ? "Yes" : "No",
    education_level: data.education_level ?? "",
    school: data.school ?? "",
    degree: data.degree ?? "",
    is_student: data.is_student == null ? "" : data.is_student ? "Yes" : "No",
    training: data.training ?? "",
    display_name: data.display_name ?? "",
    headline: data.headline ?? "",
    bio: data.bio ?? "",
    loves: data.loves ?? "",
    business_name: business.name ?? "",
    business_contact: business.contact ?? "",
    business_phone: business.phone ?? "",
    business_services: business.services ?? [],
    business_areas: business.areas ?? "",
    business_lead: business.lead ?? "",
    consent_application: data.consent_application,
    consent_service_email: data.consent_service_email,
    consent_public_profile: data.consent_public_profile,
    consent_marketing: data.consent_marketing,
    selected,
    services: serviceDrafts,
  };
  return { id: data.id as string, status: data.status as string, draft };
}
