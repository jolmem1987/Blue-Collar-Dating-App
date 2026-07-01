import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    // Admin gate
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/discover", req.url));
    }

    // Force onboarding before using the app
    const appPaths = ["/discover", "/matches", "/messages", "/profile", "/settings"];
    const needsOnboarding = appPaths.some((p) => path.startsWith(p));
    if (needsOnboarding && token && !token.onboardingComplete && path !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: [
    "/onboarding",
    "/discover/:path*",
    "/matches/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/u/:path*",
    "/account-safety/:path*",
    "/support/:path*",
    "/admin/:path*",
  ],
};
