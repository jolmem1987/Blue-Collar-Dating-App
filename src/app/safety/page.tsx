import { PublicPage, Section, P, List } from "@/components/PublicPage";

export const metadata = { title: "Safety — BlueCollar Match" };

export default function SafetyPage() {
  return (
    <PublicPage
      eyebrow="Safety"
      title="Date smart, stay safe"
      intro="Your safety comes first. Here's how to protect yourself and what we do on our end."
    >
      <div className="rounded-plate border border-amber/30 bg-amber/5 p-5 text-amber">
        BlueCollar Match will never ask for your password or payment information. We never ask for
        money. If anyone on the app asks you for money, gift cards, or banking details, report them
        immediately.
      </div>

      <Section heading="Protect your money">
        <List
          items={[
            "Never send money, gift cards, crypto, or banking info to anyone you meet here — no matter the story.",
            "Be cautious of anyone who quickly professes strong feelings, then asks for help with an emergency, a flight, or an investment.",
            "Scammers often say they work offshore, on a rig, overseas, or on long-haul routes to avoid meeting. Stay alert.",
          ]}
        />
      </Section>

      <Section heading="Guard your personal info">
        <List
          items={[
            "Keep conversations on the app until you genuinely trust someone.",
            "Don't share your home address, workplace details, or financial information early on.",
            "Use photos and a first name only until you're comfortable.",
          ]}
        />
      </Section>

      <Section heading="Meeting in person">
        <List
          items={[
            "Meet in a public place for the first few dates — a diner, a coffee shop, somewhere busy.",
            "Tell a friend or family member where you're going and who you're meeting.",
            "Drive yourself or arrange your own transportation so you can leave whenever you want.",
            "Trust your gut. If something feels off, you don't owe anyone an explanation — just leave.",
          ]}
        />
      </Section>

      <Section heading="Tools we give you">
        <P>
          Every profile and conversation has Report and Block. Blocking someone removes any match,
          stops all contact, and makes sure they never see you again. Reports go straight to our
          moderation team, who can warn, hide, or ban accounts.
        </P>
      </Section>

      <Section heading="If you're in immediate danger">
        <P>
          If you ever feel unsafe or threatened, contact your local emergency services right away.
          Then report the person here so we can take action and help protect others.
        </P>
      </Section>
    </PublicPage>
  );
}
