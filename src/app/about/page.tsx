import { PublicPage, Section, P } from "@/components/PublicPage";

export const metadata = { title: "About — BlueCollar Match" };

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About"
      title="Built for people who work hard"
      intro="BlueCollar Match is dating for blue-collar singles and the people who appreciate them."
    >
      <Section heading="Why we built this">
        <P>
          Most dating apps are built for people with nine-to-five desk jobs. They don&apos;t get
          rotating shifts, on-call weeks, travel for work, or the pride that comes with building,
          fixing, and running the things everyone else relies on.
        </P>
        <P>
          We wanted a place where a welder, a diesel mechanic, a lineman, a nurse&apos;s aide, a
          trucker, or a farmer can meet someone who respects the hands-on lifestyle — and where
          people who love that kind of partner can find them.
        </P>
      </Section>

      <Section heading="What we stand for">
        <P>
          This isn&apos;t a hookup app. It&apos;s built around real-life compatibility: schedules,
          values, work ethic, and what you want out of a relationship. We take safety seriously,
          especially for women, with reporting, blocking, and human moderation built in from day
          one.
        </P>
      </Section>

      <Section heading="Where we&apos;re headed">
        <P>
          Today it&apos;s a place to meet people. Over time we want it to become a verified-worker
          community with events, meetups, and a real sense of belonging for the people who keep the
          lights on.
        </P>
      </Section>
    </PublicPage>
  );
}
