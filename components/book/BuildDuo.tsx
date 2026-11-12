"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cycle, duoServices, visitFields, type DuoService } from "@/lib/duo-services";

const steps = ["Build your duo", "Your visit", "Your preferences", "Reserve your duo"];

export function BuildDuo() {
  const [step, setStep] = useState(0);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(1);
  const [visit, setVisit] = useState({ zip: "", date: upcomingDates()[0], time: "10:00 AM" });
  const [details, setDetails] = useState<Record<string, Record<string, string>>>({});
  const [requested, setRequested] = useState(false);

  const left = duoServices[first];
  const right = duoServices[second === first ? cycle(second, 1) : second];
  const summary = `${left.title} + ${right.title}`;

  const quote = useMemo(() => 180 + first * 10 + second * 15, [first, second]);

  if (requested) {
    return (
      <Shell step={3}>
        <h1>Your duo request is in.</h1>
        <p className="book-sub">We’ll confirm {summary} and send the quote before anything is charged.</p>
      </Shell>
    );
  }

  return (
    <Shell step={step}>
      {step === 0 ? (
        <>
          <h1>A little help. Your perfect pair.</h1>
          <p className="book-sub">Choose two services. Make room for you.</p>
          <div className="venn">
            <div className="bubble left" />
            <div className="bubble right" />
            <ServiceDial side="left" label="Your first service" index={first} onChange={(index) => { setFirst(index); if (index === second) setSecond(cycle(index, 1)); }} />
            <ServiceDial side="right" label="Your second service" index={second} onChange={(index) => setSecond(index === first ? cycle(index, 1) : index)} />
            <div className="venn-you">
              <span className="you-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M5.5 19.2c1.2-3 3.4-4.4 6.5-4.4s5.3 1.4 6.5 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <strong>You</strong>
              <p>{left.promise.replace(". ", ".\n")}</p>
            </div>
          </div>
          <p className="swipe-hint">Swipe through services to find your balance.</p>
        </>
      ) : null}

      {step === 1 ? (
        <VisitStep
          left={left}
          right={right}
          summary={summary}
          visit={visit}
          details={details}
          onVisit={setVisit}
          onDetail={(serviceId, key, value) => setDetails((current) => ({ ...current, [serviceId]: { ...current[serviceId], [key]: value } }))}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      ) : null}

      {step === 2 ? (
        <section className="team-preview">
          <h1>Meet your team.</h1>
          <p className="book-sub">A cleaner and a second provider arrive for the same visit. We’ll introduce a real pair after you request the duo.</p>
          <div className="team-cards">
            <figure><img src={left.image} alt="" /><figcaption>{left.title}</figcaption></figure>
            <figure><img src={right.image} alt="" /><figcaption>{right.title}</figcaption></figure>
          </div>
          <button className="button" type="button" onClick={() => setStep(3)}>Review this duo</button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="review-duo">
          <h1>Review and request.</h1>
          <p className="book-sub">Nothing is charged on this screen. We’ll send the quote first.</p>
          <p><strong>{summary}</strong></p>
          <p>{visit.date || "Date to be chosen"} · {visit.time} · {visit.zip || "ZIP to be added"}</p>
          <p className="quote">Starting around ${quote}</p>
          <button className="button" type="button" onClick={() => setRequested(true)}>Request my duo</button>
        </section>
      ) : null}

      {step === 0 ? (
        <div className="duo-bar">
          <p><span>Your duo</span><strong>{summary}</strong></p>
          <p><span>Choose your visit details next</span><strong>Your quote comes before checkout</strong></p>
          <button className="button" type="button" onClick={() => setStep(1)}>Plan my visit →</button>
        </div>
      ) : null}
    </Shell>
  );
}

function Shell({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className="book">
      <header className="book-header">
        <a className="book-logo" href="/"><span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 19s-6.2-3.7-8.1-7.1C2.4 9.6 3.3 6.8 6 6.1c1.6-.4 3 .2 4 1.4 1-1.2 2.4-1.8 4-1.4 2.7.7 3.6 3.5 2.1 5.9C18.2 15.3 12 19 12 19Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg></span> dream duos</a>
        <nav>
          <a href="/#how-it-works">How it works</a>
          <a href="/#duos">Explore our providers</a>
        </nav>
      </header>
      <ol className="book-progress">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "is-current" : index < step ? "is-done" : undefined}>
            <span>{index + 1}</span> {label}
          </li>
        ))}
      </ol>
      <main>{children}</main>
    </div>
  );
}

function VisitStep({ left, right, summary, visit, details, onVisit, onDetail, onBack, onNext }: {
  left: DuoService;
  right: DuoService;
  summary: string;
  visit: { zip: string; date: string; time: string };
  details: Record<string, Record<string, string>>;
  onVisit: (visit: { zip: string; date: string; time: string }) => void;
  onDetail: (serviceId: string, key: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="visit-layout">
      <div className="visit-copy">
        <h1>A little planning. A lot more breathing room.</h1>
        <p className="book-sub">Reserve at least 10 days ahead so we can thoughtfully match your duo.</p>
      </div>
      <div className="visit-grid">
        <div className="visit-main">
          <div className="option-row">
            <ServiceOptions service={left} values={details[left.id] ?? {}} onChange={(key, value) => onDetail(left.id, key, value)} />
            <ServiceOptions service={right} values={details[right.id] ?? {}} onChange={(key, value) => onDetail(right.id, key, value)} />
          </div>
          <h2>Where and when?</h2>
          <div className="when-row">
            <label>ZIP code
              <span className="field-icon">⌖</span>
              <input value={visit.zip} placeholder="30066" onChange={(event) => onVisit({ ...visit, zip: event.target.value })} />
            </label>
            <label>Requested date
              <select value={visit.date} onChange={(event) => onVisit({ ...visit, date: event.target.value })}>
                {upcomingDates().map((date) => <option key={date}>{date}</option>)}
              </select>
            </label>
            <label>Requested start time
              <select value={visit.time} onChange={(event) => onVisit({ ...visit, time: event.target.value })}>
                {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => <option key={time}>{time}</option>)}
              </select>
            </label>
          </div>
          <p className="when-note">Your requested time is confirmed after matching.</p>
        </div>
        <aside className="visit-side">
          <div className="mini-venn" aria-hidden="true">
            <span>{left.title}</span>
            <strong>You</strong>
            <span>{right.title}</span>
          </div>
          <h2>How your reservation works</h2>
          <ol>
            <li>Reserve with a deposit.</li>
            <li>Meet your proposed duo within 3 days.</li>
            <li>Approve or request a change within 48 hours.</li>
            <li>We finalize everything by day 7.</li>
          </ol>
          <p>All timelines start when you reserve.</p>
        </aside>
      </div>
      <div className="duo-bar visit-bar">
        <button className="text-button" type="button" onClick={onBack}>← Back</button>
        <p><span>Your duo</span></p>
        <strong className="duo-pill">{summary}</strong>
        <button className="button" type="button" onClick={onNext}>Share my preferences →</button>
      </div>
      <p className="concept-note">Concept preview · Sample details and pricing</p>
    </div>
  );
}

function ServiceOptions({ service, values, onChange }: { service: DuoService; values: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return (
    <article className="option-card">
      <h3>{service.title}</h3>
      {visitFields[service.id].map((field) => {
        const value = values[field.key] ?? field.defaultValue;
        if (field.kind === "pills") {
          return (
            <div key={field.key} className="pill-field">
              <span>{field.label}</span>
              <div>
                {field.options.map((option) => (
                  <button key={option} type="button" className={value === option ? "is-on" : undefined} onClick={() => onChange(field.key, option)}>{option}</button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <label key={field.key}>{field.label}
            <select value={value} onChange={(event) => onChange(field.key, event.target.value)}>
              {field.options.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        );
      })}
    </article>
  );
}

function upcomingDates() {
  const dates: string[] = [];
  const start = new Date();
  start.setDate(start.getDate() + 10);
  for (let i = 0; i < 21; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
  }
  return dates;
}

function ServiceDial({ side, label, index, onChange }: { side: "left" | "right"; label: string; index: number; onChange: (index: number) => void }) {
  const service = duoServices[index];
  return (
    <div className={`dial ${side}`}>
      <div className="dial-inner">
        <div className="dial-card">
          <button type="button" aria-label={`Previous ${label}`} onClick={() => onChange(cycle(index, -1))}>‹</button>
          <img src={service.image} alt="" />
          <button type="button" aria-label={`Next ${label}`} onClick={() => onChange(cycle(index, 1))}>›</button>
        </div>
        <h2>{service.title}</h2>
        <p>{service.line}</p>
        <div className="dial-dots" aria-hidden="true">
          {duoServices.map((item, itemIndex) => <i key={item.id} className={itemIndex === index ? "is-on" : undefined} />)}
        </div>
        <p className="dial-label">{label}</p>
      </div>
    </div>
  );
}
