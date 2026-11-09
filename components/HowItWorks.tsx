import { steps } from "@/lib/content";
import { Icon } from "./Icons";

export function HowItWorks() {
  return (
    <section className="how" id="how-it-works" aria-labelledby="how-title">
      <div className="how-copy">
        <p className="eyebrow">Less planning. More exhaling.</p>
        <h2 id="how-title">
          Good things come in <em>twos.</em>
        </h2>
        <p className="lede">Two services. One visit. Support that fits into your real life.</p>
        <a className="button" href="#duos">
          Build your duo
          <Icon name="arrow" />
        </a>
      </div>
      <ol className="step-list">
        {steps.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
