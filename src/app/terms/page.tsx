import { PublicPage, Section, P, List } from "@/components/PublicPage";

export const metadata = { title: "Terms of Service — BlueCollar Match" };

export default function TermsPage() {
  return (
    <PublicPage
      eyebrow="Terms of Service"
      title="Terms of Service"
      intro="Last updated: this is a starter template. Have a lawyer review and customize it before launch."
    >
      <div className="rounded-plate border border-steel-700 bg-steel-900 p-4 text-sm text-steel-400">
        Template notice: This is placeholder legal content to make the app complete. It is not legal
        advice. Replace it with terms reviewed by a qualified attorney for your jurisdiction before
        going live.
      </div>

      <Section heading="1. Eligibility">
        <P>
          You must be at least 18 years old to create an account or use BlueCollar Match. By using
          the service, you represent that you meet this requirement and that the information you
          provide is accurate.
        </P>
      </Section>

      <Section heading="2. Your account">
        <List
          items={[
            "You're responsible for keeping your login credentials secure.",
            "You may not share your account or create accounts for others.",
            "We may suspend or terminate accounts that violate these terms or our Community Guidelines.",
          ]}
        />
      </Section>

      <Section heading="3. Acceptable use">
        <P>
          You agree to follow our Community Guidelines. You won&apos;t use the service to harass,
          defraud, or harm others, to post unlawful content, or to solicit money. We may remove
          content and restrict accounts at our discretion.
        </P>
      </Section>

      <Section heading="4. Content you provide">
        <P>
          You retain ownership of the photos and text you upload, and you grant us a limited license
          to display that content within the service so it can function. You&apos;re responsible for
          the content you share and confirm you have the right to share it.
        </P>
      </Section>

      <Section heading="5. Subscriptions and payments">
        <P>
          Paid plans, when available, are billed as described at checkout. Pricing and features may
          change. Any payment processing is handled by a third-party provider.
        </P>
      </Section>

      <Section heading="6. Disclaimers and limitation of liability">
        <P>
          The service is provided &quot;as is.&quot; We don&apos;t conduct criminal background checks
          and can&apos;t guarantee the conduct or identity of any member. To the fullest extent
          permitted by law, we&apos;re not liable for interactions between members. Always follow our
          Safety guidelines.
        </P>
      </Section>

      <Section heading="7. Changes to these terms">
        <P>
          We may update these terms from time to time. If we make material changes, we&apos;ll take
          reasonable steps to notify you. Continued use after changes means you accept the updated
          terms.
        </P>
      </Section>

      <Section heading="8. Contact">
        <P>Questions about these terms? Email support@bluecollarmatch.app.</P>
      </Section>
    </PublicPage>
  );
}
