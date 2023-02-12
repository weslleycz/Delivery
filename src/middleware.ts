import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, res: NextApiResponse) {
    if (request.nextUrl.pathname === "/login") {
        if (request.cookies.get("@token")?.value != undefined) {
            return NextResponse.rewrite(new URL("/", request.url));
        } else {
            return NextResponse.next();
        }
    }

    if (request.nextUrl.pathname === "/admin/dashboard") {
        if (request.cookies.get("@tokenAdmin")?.value != undefined) {
            return NextResponse.next();
        } else {
            return NextResponse.rewrite(new URL("/admin/login", request.url));
        }
    }

    if (request.nextUrl.pathname === "/admin/login") {
        if (request.cookies.get("@tokenAdmin")?.value === undefined) {
            return NextResponse.next();
        } else {
            return NextResponse.rewrite(
                new URL("/admin/dashboard", request.url)
            );
        }
    }

    if (request.nextUrl.pathname === "/admin") {
        if (request.cookies.get("@tokenAdmin")?.value != undefined) {
            return NextResponse.rewrite(new URL("/admin/dashboard", request.url));
        } else {
            return NextResponse.rewrite(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/admin/dashboard", "/admin/login", "/admin"],
};
