import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0"

export async function middleware(request) {
    const authRes = await auth0.middleware(request);

    // authentication routes — let the middleware handle it
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes;
    }

     if (request.nextUrl.pathname === ("/page/buy")) {
        return authRes;
    }
    
    if (request.nextUrl.pathname === ("/")) {
        return authRes;
    }

    const { origin } = new URL(request.url)
    const session = await auth0.getSession()

    // user does not have a session — redirect to login
    if (!session) {
        return NextResponse.redirect(`${origin}/auth/login`)
    }

    return authRes
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - api (API routes)
         */
        "/((?!_next/static|_next/image|logo.png|sitemap.xml|robots.txt|api).*)",
    ],
}