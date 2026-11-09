"use client";

import { useState } from "react";
import { audiences, duos } from "@/lib/content";
import { Icon } from "./Icons";

export function Duos() {
  const [active, setActive] = useState(0);

  return (
    <section className="duos" id="duos" aria-labelledby="duos-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">Better together</p>
          <h2 id="duos-title">A duo for your kind of day.</h2>
        </div>
        <p className="section-aside">
          A little practical. A little personal. A whole lot off your plate.
        </p>
      </div>
      <div className="audience-tabs" role="tablist" aria-label="Who the visit is for">
        {audiences.map((label, index) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`audience-tab-${index}`}
            aria-selected={active === index}
            aria-controls="duo-panel"
            className={active === index ? "is-active" : undefined}
            onClick={() => setActive(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id="duo-panel"
        role="tabpanel"
        aria-labelledby={`audience-tab-${active}`}
        className="duo-grid"
      >
        {duos.map((duo) => (
          <article key={duo.title} className={`duo-card tone-${duo.tone}`}>
            <div className="duo-icons">
              {duo.icons.map((icon) => (
                <span key={icon}>
                  <Icon name={icon} />
                </span>
              ))}
            </div>
            <p className="eyebrow">{duo.eyebrow}</p>
            <h3>{duo.title}</h3>
            <p>{duo.body}</p>
            <a href="#how-it-works">
              Explore this duo
              <Icon name="arrow" />
            </a>
          </article>
        ))}
      </div>
      <p className="duo-note">Two isn’t one-size-fits-all. Your support should be neither.</p>
    </section>
  );
}
