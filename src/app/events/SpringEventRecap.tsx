import {
  SPRING_2026_PARTNER_PROGRAMS,
  SPRING_2026_SPONSORS,
} from "@/data/events";

const sponsorList = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
}).format([...SPRING_2026_SPONSORS]);

export function SpringEventRecap() {
  return (
    <div className="space-y-5 text-base leading-relaxed text-pretty text-[var(--kbk-text)]/80">
      <p>
        What an incredible day at our spring event. Thank you to everyone who
        showed up, donated, volunteered, shared our posts, invited friends, and
        helped make it a success. Seeing families fill the space, neighbors
        helping neighbors, and our community come together was truly
        special and really the “why” behind our mission.
      </p>
      <p>
        Because of your generosity, thousands of kids’ clothing items,
        shoes, toys, books, and baby essentials found new homes instead of
        ending up in landfills. Events like this are a beautiful reminder that
        sustainability and community care can go hand in hand.
      </p>
      <p>
        We are also grateful for partnerships that continue to grow through this
        work. Thanks to local organizations and community connections, many
        remaining donations will keep reaching families and programs throughout
        our area—extending the impact far beyond one day. Programs we were able
        to support include:
      </p>
      <ul className="m-0 list-disc space-y-3 pl-5">
        {SPRING_2026_PARTNER_PROGRAMS.map(({ name, description }) => (
          <li key={name} className="min-w-0">
            <span className="font-semibold text-[var(--kbk-text)]">{name}</span>
            {" — "}
            {description}
          </li>
        ))}
      </ul>
      <p>And this is only the beginning.</p>
      <p>
        A big thank you to our sponsors{" "}
        <span className="font-semibold text-[var(--kbk-text)]">{sponsorList}</span>
        . Thank you for believing in this mission and helping us create a space
        where families feel welcomed, supported, and cared for. We’re already
        looking forward to the next one.
      </p>
    </div>
  );
}
