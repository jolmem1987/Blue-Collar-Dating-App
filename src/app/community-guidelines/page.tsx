import { PublicPage, Section, P, List } from "@/components/PublicPage";

export const metadata = { title: "Community Guidelines — BlueCollar Match" };

export default function CommunityGuidelinesPage() {
  return (
    <PublicPage
      eyebrow="Community guidelines"
      title="How we treat each other here"
      intro="BlueCollar Match works because people are real, respectful, and here for the right reasons. These rules keep it that way."
    >
      <Section heading="Be real">
        <List
          items={[
            "Use your own recent photos and accurate information.",
            "You must be 18 or older to use BlueCollar Match.",
            "One account per person. No impersonating anyone else.",
          ]}
        />
      </Section>

      <Section heading="Be respectful">
        <List
          items={[
            "Treat everyone with respect, especially when someone isn't interested.",
            "No harassment, hate speech, threats, or discrimination of any kind.",
            "No unsolicited explicit messages or photos. Consent matters.",
          ]}
        />
      </Section>

      <Section heading="Keep it safe and honest">
        <List
          items={[
            "No scams, solicitation, or asking anyone for money.",
            "No promoting other services, selling, or spamming.",
            "Don't share other people's private information.",
          ]}
        />
      </Section>

      <Section heading="What happens when rules are broken">
        <P>
          Depending on severity, we may warn an account, hide content, remove photos, or
          permanently ban someone. Serious violations — like scams, threats, or anything involving a
          minor — result in an immediate ban and may be reported to the authorities.
        </P>
        <P>
          If someone breaks these guidelines, use Report. Every report is reviewed by a real person
          on our team.
        </P>
      </Section>
    </PublicPage>
  );
}
