import { Icon } from "./Icons";

export function ProviderBand() {
  return (
    <section className="provider" id="providers" aria-labelledby="provider-title">
      <p className="eyebrow">Do good work. Make a real difference.</p>
      <h2 id="provider-title">Someone’s dream duo could start with you.</h2>
      <p>
        Cleaners, childcare providers, and massage therapists: help us build a more caring kind of home service.
      </p>
      <a className="button button-light" href="#faq">
        Explore becoming a provider
        <Icon name="arrow" />
      </a>
    </section>
  );
}
