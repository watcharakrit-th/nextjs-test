import { NextRequest, NextResponse } from 'next/server';
import { Config } from './app/Config';

export function middleware(request: NextRequest) {
    const token = request.cookies.get(Config.tokenKey)?.value;
    // console.log('Middleware token:', token);

    // if (!token) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }
}

export const config = {
    matcher: ['/main/:path*'],
}