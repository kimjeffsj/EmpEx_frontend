import { NextResponse, type NextRequest } from "next/server";
import { ProtectedRoute, UserRole, TokenPayload } from "./types/auth.types";
import { jwtDecode } from "jwt-decode";

const PROTECTED_ROUTES: ProtectedRoute[] = [
  {
    path: "/manager",
    roles: [UserRole.MANAGER],
  },
  {
    path: "/dashboard",
    roles: [UserRole.EMPLOYEE, UserRole.MANAGER],
  },
];

// Routes that should redirect when accessed while logged in
const AUTH_ROUTES = ["/login"];
const PUBLIC_ROUTES = [
  "/",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Check public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Handle authenticated users accessing auth pages
  if (
    AUTH_ROUTES.includes(pathname) &&
    accessToken &&
    !request.cookies.get("logging_out")
  ) {
    try {
      const decoded = jwtDecode<TokenPayload>(accessToken);
      const redirectPath =
        decoded.role === UserRole.MANAGER ? "/manager/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } catch {
      // Continue if token decoding fails
    }
  }

  // 3. Handle API requests
  if (pathname.startsWith("/api/")) {
    if (!accessToken && !refreshToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            // Add CORS headers
            "Access-Control-Allow-Origin":
              process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }
    return NextResponse.next();
  }

  // 4. Check protected route access
  const protectedRoute = PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    // Handle case with no tokens
    if (!accessToken && !refreshToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Save the originally requested URL
      response.cookies.set("returnUrl", request.url);
      return response;
    }

    // Role-based access control
    if (accessToken) {
      try {
        const decoded = jwtDecode<TokenPayload>(accessToken);
        if (!protectedRoute.roles.includes(decoded.role)) {
          // No permission - redirect to appropriate dashboard
          const redirectPath =
            decoded.role === UserRole.MANAGER
              ? "/manager/dashboard"
              : "/dashboard";
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      } catch {
        // Redirect to login page if token decoding fails
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
