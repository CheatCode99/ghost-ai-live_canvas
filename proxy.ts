import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL + "(.*)",
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL + "(.*)",
])

// API routes own their own auth responses (e.g. JSON 401s) instead of
// Clerk's middleware-level protect(), which falls back to a 404 for
// non-page requests rather than the 401 our route handlers return.
const isApiRoute = createRouteMatcher(["/api(.*)"])

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !isApiRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
}
