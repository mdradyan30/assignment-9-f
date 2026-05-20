'use client';

const STEPS = [
  {
    step: '01',
    title: 'Write it down.',
    text: 'Describe the problem, your proposed solution, and who it serves. No pitch deck required — just a clear paragraph.',
  },
  {
    step: '02',
    title: 'Open the floor.',
    text: 'Other readers comment, question assumptions, and help you spot blind spots. The internet is, briefly, useful.',
  },
  {
    step: '03',
    title: 'Refine in public.',
    text: 'Watch your idea climb the trending pages as the discussion grows. Iterate with the confidence of having been read.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-base-300">
      <div className="vault-container py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-4">
            <p className="eyebrow text-secondary mb-4">§ A note on process</p>
            <h2 className="display text-4xl md:text-5xl">
              How an idea moves <span className="italic">through</span> the vault.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="body-prose text-lg">
              We don't believe in pitch decks here. Or hype cycles. Or growth
              hackers. We believe in a clean paragraph, a few honest readers,
              and the slow improvement that comes from being seen.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 border-t border-base-content">
          {STEPS.map((s) => (
            <article
              key={s.step}
              className="py-8 md:px-8 md:first:pl-0 md:last:pr-0 border-b md:border-b-0 md:border-r border-base-300 last:border-0"
            >
              <p className="num-badge mb-6">Step {s.step}</p>
              <h3 className="font-display text-2xl tracking-tightest mb-4">
                {s.title}
              </h3>
              <p className="body-prose text-base">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
