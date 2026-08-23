import LegalPage, { Section } from "@/components/legal/LegalPage";
export const metadata = { title: "Terms | WOODLOOM" };
export default function TermsPage() {
  return (
    <LegalPage eyebrow="The essentials" title="Terms & Conditions">
      <Section title="Orders">
        <p>
          An order is confirmed only after we validate availability, quotation,
          payment and delivery details with you directly.
        </p>
      </Section>
      <Section title="Handmade variation">
        <p>
          Natural grain, colour and dimensions may vary slightly. These are
          characteristics of handmade wood products, not defects.
        </p>
      </Section>
      <Section title="Pricing and payment">
        <p>
          Displayed prices are in INR and may be indicative for custom work.
          Payment method and delivery charges are confirmed before an order is
          accepted. Cash on delivery is not offered.
        </p>
      </Section>
      <Section title="Acceptable use">
        <p>
          Do not attempt unauthorised access, submit fraudulent enquiries,
          scrape private data or interfere with service availability.
        </p>
      </Section>
      <Section title="Contact">
        <p>
          Questions can be sent to mozain0145@gmail.com or WhatsApp +91 74529
          05405.
        </p>
      </Section>
    </LegalPage>
  );
}
