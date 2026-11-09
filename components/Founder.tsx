import { Icon } from "./Icons";

export function Founder() {
  return (
    <section className="founder" id="our-why" aria-labelledby="why-title">
      <div className="founder-mark" aria-hidden="true">
        <Icon name="burst" />
        <p>
          you, <em>too.</em>
        </p>
      </div>
      <div className="founder-copy">
        <p className="eyebrow">A note from our founder</p>
        <h2 id="why-title">
          You take care of everyone.
          <span>
            <em>Let’s take care of you.</em>
          </span>
        </h2>
        <p>
          Dream Duos started with a simple thought: what if getting help at home also made space for you? We’re building a way to pair everyday support with personal care, because you shouldn’t have to finish your entire to-do list before you get to rest.
        </p>
        <p className="signature">
          <em>Danielle</em>
          <span>Founder, Dream Duos</span>
        </p>
      </div>
    </section>
  );
}
