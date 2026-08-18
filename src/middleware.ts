import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
// /checkout is intentionally NOT here — the checkout page handles its own auth
// so it can show a guest-friendly prompt instead of a hard redirect.
const protectedPaths = ['/account'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Maintenance Mode Check
  // Skip check for the maintenance page itself to avoid redirect loops
  if (!pathname.startsWith('/maintenance')) {
    try {
      // Fetch from backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vitaformapi-tx0e.onrender.com/api/v1';
      
      // Cache the response for 60 seconds so we don't bombard the backend on every page load
      const res = await fetch(`${apiUrl}/admin/settings/maintenance`, {
        next: { revalidate: 60 }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Handle both direct object and typical wrapped { data: ... } responses
        const isMaintenance = data?.data?.maintenanceMode ?? data?.maintenanceMode;
        
        if (isMaintenance === true) {
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
      }
    } catch (err) {
      // Fail-open: If the backend is down, we don't want to show a maintenance page by mistake.
      // We just log it and proceed normally.
      console.error('Maintenance check failed in middleware:', err);
    }
  }

  // 2. Auth Guard

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    // Check for the cookie set by auth.store.ts on successful login
    // The cookie name must match what is set in login() in auth.store.ts
    const token = request.cookies.get('vita_session_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
