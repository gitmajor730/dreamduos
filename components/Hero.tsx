import { Icon } from "./Icons";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <Icon name="sparkle" />
          More support. More you.
        </p>
        <h1 id="hero-title">
          Two helping hands.
          <span>One <em>happier you.</em></span>
        </h1>
        <p className="lede">
          The house needs a little love. So do you. Pair two in-home services for the kind of support that makes your whole day feel different.
        </p>
        <a className="button" href="#duos">
          Find your dream duo
          <Icon name="arrow" />
        </a>
        <p className="fine-print">Takes a minute. No commitment.</p>
      </div>
      <figure className="hero-card">
        <img
          src="/hero-living-room.jpg"
          alt="A sunlit living room with a linen sofa, a gallery wall, and houseplants"
        />
        <figcaption>
          <p className="hero-card-title">
            <Icon name="sparkle" />
            A clean home. <em>A deep exhale.</em>
          </p>
          <p>A little practical. A little personal. A whole lot off your plate.</p>
        </figcaption>
      </figure>
    </section>
  );
}
