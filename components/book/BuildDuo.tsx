"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cycle, duoServices } from "@/lib/duo-services";

const steps = ["Build your duo", "Your visit", "Meet your team", "Review & pay"];

export function BuildDuo() {
  const [step, setStep] = useState(0);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(1);
  const [visit, setVisit] = useState({ zip: "", date: "", window: "Morning", notes: "" });
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
            <ServiceDial label="Your first service" index={first} onChange={(index) => { setFirst(index); if (index === second) setSecond(cycle(index, 1)); }} />
            <ServiceDial label="Your second service" index={second} onChange={(index) => setSecond(index === first ? cycle(index, 1) : index)} />
            <div className="venn-you">
              <span className="you-icon" aria-hidden="true">☺</span>
              <strong>You</strong>
              <p>{left.promise}</p>
            </div>
          </div>
          <p className="swipe-hint">Swipe through services to find your balance.</p>
        </>
      ) : null}

      {step === 1 ? (
        <form className="visit-form" onSubmit={(event) => { event.preventDefault(); setStep(2); }}>
          <h1>Your visit.</h1>
          <p className="book-sub">Tell us when and where. The quote comes before checkout.</p>
          <label>ZIP<input value={visit.zip} onChange={(event) => setVisit({ ...visit, zip: event.target.value })} required /></label>
          <label>Date<input type="date" value={visit.date} onChange={(event) => setVisit({ ...visit, date: event.target.value })} required /></label>
          <fieldset>
            <legend>Time of day</legend>
            {["Morning", "Afternoon", "Evening"].map((option) => (
              <label key={option} className="check"><input type="radio" name="window" checked={visit.window === option} onChange={() => setVisit({ ...visit, window: option })} /> {option}</label>
            ))}
          </fieldset>
          <label>Notes<textarea value={visit.notes} onChange={(event) => setVisit({ ...visit, notes: event.target.value })} /></label>
          <button className="button" type="submit">Continue</button>
        </form>
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
          <p>{visit.date || "Date to be chosen"} · {visit.window} · {visit.zip || "ZIP to be added"}</p>
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
        <a className="book-logo" href="/"><span aria-hidden="true">♡</span> dream duos</a>
        <nav>
          <a href="/#how-it-works">How it works</a>
          <a href="/join">My account</a>
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

function ServiceDial({ label, index, onChange }: { label: string; index: number; onChange: (index: number) => void }) {
  const service = duoServices[index];
  return (
    <div className="dial">
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
  );
}
