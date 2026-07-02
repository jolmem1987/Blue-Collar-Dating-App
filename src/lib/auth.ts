import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXT_AUTH;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.accountStatus === "BANNED")
          throw new Error("This account has been suspended.");
        if (user.accountStatus === "DELETED")
          throw new Error("This account no longer exists.");

        if (REQUIRE_EMAIL_VERIFICATION && !user.emailVerified)
          throw new Error("Please verify your email before signing in.");

        // Bootstrap admins from env
        if (ADMIN_EMAILS.includes(email) && user.role !== "ADMIN") {
          await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return { id: user.id, email: user.email, name: user.firstName ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      if (token.uid) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: { role: true, onboardingComplete: true, accountStatus: true },
        });
        token.role = dbUser?.role ?? "USER";
        token.onboardingComplete = dbUser?.onboardingComplete ?? false;
        token.accountStatus = dbUser?.accountStatus ?? "ACTIVE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as string;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
        session.user.accountStatus = token.accountStatus as string;
      }
      return session;
    },
  },
  secret: AUTH_SECRET,
};
