import { NextResponse, type NextRequest } from "next/server";

// Middleware function to handle authentication and routing
export function middleware(request: NextRequest) {
  // Get the current URL path from the request
  const pathname = request.nextUrl.pathname;

  // Retrieve authentication token from cookies, if available
  const token = request.cookies.get("accessToken")?.value;

  // Determine if the request is for the login page
  const isAuthPage = pathname.startsWith("/login");

  // Determine if the request is for a protected route (dashboard or manager pages)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/manager");

  // If accessing a protected route without a token, redirect to login page
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing the login page with a valid token, redirect to the dashboard
  if (isAuthPage && token) {
    const dashboardUrl = new URL("/manager/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Proceed with request handling if no conditions match
  return NextResponse.next();
}

// Export middleware configuration specifying the routes to match
export const config = {
  matcher: ["/dashboard/:path*", "/manager/:path*", "/login"],
};
