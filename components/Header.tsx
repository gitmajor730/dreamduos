"use client";

import { useState } from "react";
import { nav } from "@/lib/content";
import { Icon } from "./Icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" id="top">
      <a className="wordmark" href="#top">
        dreamduos
      </a>
      <nav className="desktop-nav" aria-label="Primary">
        {nav.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="button button-small header-cta" href="#providers">
        Become a provider
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open ? (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Primary mobile">
          {nav.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="button" href="#providers" onClick={() => setOpen(false)}>
            Become a provider
          </a>
        </nav>
      ) : null}
    </header>
  );
}
