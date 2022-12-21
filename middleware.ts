import { NextResponse } from 'next/server';

export async function middleware(req, ev) {
  const { pathname } = req.nextUrl;
  if (pathname == '/') {
    return NextResponse.redirect(new URL('/today', req.url));
  }
  return NextResponse.next();
}
