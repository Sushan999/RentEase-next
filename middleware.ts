import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Landlord dashboard
    if (pathname.startsWith("/dashboard/landlord")) {
      if (token?.role !== "LANDLORD") {
        return Response.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Admin dashboard
    if (pathname.startsWith("/dashboard/admin")) {
      if (token?.role !== "ADMIN") {
        return Response.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Tenant dashboard
    if (pathname.startsWith("/dashboard/tenant")) {
      if (token?.role !== "TENANT") {
        return Response.redirect(new URL("/unauthorized", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
