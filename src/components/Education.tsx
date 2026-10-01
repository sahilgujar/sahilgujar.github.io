import { education, extras, profile } from "@/data/resume";
import { SectionTitle } from "./Section";

function Entry({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="mb-3">
      <strong className="font-semibold">{title}</strong>
      <small className="block text-sm text-muted">{detail}</small>
    </li>
  );
}

export function Education() {
  return (
    <section id="education" className="grid grid-cols-1 gap-10 border-t border-line py-16 sm:grid-cols-2 sm:py-20 print:py-4">
      <div>
        <SectionTitle>Education</SectionTitle>
        <ul data-reveal className="m-0 list-none p-0">
          {education.map((e) => (
            <Entry key={e.title} {...e} />
          ))}
        </ul>
      </div>
      <div>
        <SectionTitle>Also</SectionTitle>
        <ul data-reveal className="m-0 list-none p-0">
          {extras.map((e) => (
            <Entry key={e.title} {...e} />
          ))}
          <li className="no-print">
            <a target="_blank" rel="noopener" href={profile.codewars}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.codewars.com/users/sahilgujar/badges/large"
                alt="Codewars profile badge for sahilgujar"
                className="max-w-full"
              />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
