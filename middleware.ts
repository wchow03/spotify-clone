import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
    matcher: ['/']
}

export async function middleware(req:any) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    // if (pathname.includes("/api/auth") || token) {
    //     return NextResponse.next();
    // }

    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}