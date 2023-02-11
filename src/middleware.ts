import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/login") {
        if (request.cookies.get("@token")?.value != undefined) {
            return NextResponse.rewrite(new URL("/rewrite", request.url));
        } else {
            console.log(request.cookies.get("@token")?.value);
            return NextResponse.next();
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/login"],
};
