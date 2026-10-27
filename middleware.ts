import { NextResponse } from "next/server"; import type { NextRequest } from "next/server";
export function middleware(request: NextRequest){ if(request.nextUrl.pathname==="/login"||request.nextUrl.pathname.startsWith("/api/login")||request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next(); if(!request.cookies.get("ampy_session")) return NextResponse.redirect(new URL("/login",request.url)); return NextResponse.next(); }
export const config={matcher:["/((?!favicon.ico).*)"]};
