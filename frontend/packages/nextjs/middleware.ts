import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';
import { type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// applies this middleware to all routes except for api, next/static, next/image, and public files.
export const config = {
  matcher: '/((?!api|static|.*\..*|_next).*)/',
};