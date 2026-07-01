import { PublicPage, Section, P, List } from "@/components/PublicPage";

export const metadata = { title: "Privacy Policy — BlueCollar Match" };

export default function PrivacyPage() {
  return (
    <PublicPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="Last updated: this is a starter template. Have a lawyer review and customize it before launch."
    >
      <div className="rounded-plate border border-steel-700 bg-steel-900 p-4 text-sm text-steel-400">
        Template notice: This is placeholder content to make the app complete. It is not legal
        advice. Replace it with a privacy policy reviewed by a qualified attorney and aligned with
        laws like GDPR and CCPA where applicable.
      </div>

      <Section heading="Information we collect">
        <List
          items={[
            "Account info: email, password (stored hashed), and date of birth for age verification.",
            "Profile info: name, photos, trade and work details, preferences, and prompt answers you choose to share.",
            "Usage info: likes, matches, messages, reports, and activity needed to run the service.",
            "Approximate location, if you provide it, to show nearby matches.",
          ]}
        />
      </Section>

      <Section heading="How we use your information">
        <List
          items={[
            "To create your profile and show you compatible people.",
            "To enable matching and messaging between mutual matches.",
            "To keep the community safe — reviewing reports and moderating content.",
            "To improve the service and communicate important updates.",
          ]}
        />
      </Section>

      <Section heading="How we share information">
        <P>
          Your profile is visible to other members as part of normal use. We don&apos;t sell your
          personal information. We use service providers (for example, hosting, image storage, and —
          when enabled — payment processing) who handle data on our behalf under appropriate
          agreements.
        </P>
      </Section>

      <Section heading="Your choices and rights">
        <List
          items={[
            "You can edit or remove most profile information at any time.",
            "You can pause your account to hide your profile, or delete it to remove your data.",
            "Depending on where you live, you may have rights to access, correct, or delete your data.",
          ]}
        />
      </Section>

      <Section heading="Data retention and security">
        <P>
          We keep your information for as long as your account is active and as needed to provide the
          service or meet legal obligations. We use reasonable safeguards to protect your data, but
          no system is completely secure.
        </P>
      </Section>

      <Section heading="Children">
        <P>
          BlueCollar Match is only for people 18 and older. We don&apos;t knowingly collect data from
          anyone under 18, and we remove such accounts when identified.
        </P>
      </Section>

      <Section heading="Contact">
        <P>Questions about privacy? Email support@bluecollarmatch.app.</P>
      </Section>
    </PublicPage>
  );
}
