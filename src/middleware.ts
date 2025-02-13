import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/manager"];
const authRoutes = ["/login"];
const publicRoutes = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // API 요청 처리
  if (pathname.startsWith("/api/")) {
    // public API 엔드포인트는 항상 허용
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // 나머지 API 요청들은 인증 필요
    if (!token) {
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
          },
        }
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // When accessing protected pages
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // When accessing login page
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token && !request.cookies.get("logging_out")) {
    // return NextResponse.redirect(new URL("/manager/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure paths for middleware
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/manager/:path*",
    // Authentication routes
    "/login",
    // API routes
    "/api/:path*",
  ],
};
