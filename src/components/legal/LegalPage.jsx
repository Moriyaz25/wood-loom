export default function LegalPage({ eyebrow, title, intro, children }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 md:py-20">
      <header className="max-w-3xl">
        <p className="font-data text-xs uppercase tracking-[.2em] text-sienna">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-5xl text-walnut md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 font-body text-base leading-7 text-walnut/65">
            {intro}
          </p>
        )}
        <p className="mt-4 font-body text-xs text-walnut/45">
          Last updated: 23 August 2026
        </p>
      </header>
      <div className="mt-12 grid gap-x-14 gap-y-10 font-body text-sm leading-7 text-walnut/70 md:grid-cols-2">
        {children}
      </div>
      <div className="mt-14 rounded-2xl bg-walnut p-7 text-ivory">
        <h2 className="font-display text-2xl">Still need help?</h2>
        <p className="mt-2 font-body text-sm text-ivory/65">
          Send us your order number and the email or phone used at checkout.
          Never send passwords or payment credentials.
        </p>
        <a
          href="/contact"
          className="mt-5 inline-block rounded-full bg-ivory px-5 py-2.5 font-body text-sm text-walnut"
        >
          Contact support
        </a>
      </div>
    </main>
  );
}
export function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-walnut">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
