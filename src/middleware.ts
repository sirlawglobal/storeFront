import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add protected paths here
const protectedPaths = ['/account', '/checkout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtected) {
    // Check for our specific cookie or assume client-side handles token validity.
    // Since we use localStorage for token (Zustand persist), the Next.js middleware 
    // doesn't easily see it unless we also set a cookie on login.
    // A simple workaround for App Router is to let a client-side wrapper handle the redirect,
    // OR we can check for a 'vita_token' cookie if we implement it later.
    // For now, let's allow it to pass and the Axios interceptor / AuthGuard component will catch it.
    
    // If you add a cookie later:
    // const token = request.cookies.get('vita_token');
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
