"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import { Icon } from "./Icons";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">A few things you might wonder.</h2>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div key={item.question} className={isOpen ? "faq-item is-open" : "faq-item"}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {item.question}
                  <Icon name="plus" />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
