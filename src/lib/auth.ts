import { createSession } from 'next-session';
import { createCookie } from 'next-session/cookie';

const cookie = createCookie('session', {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

export const session = createSession({
  cookie,
  maxAge: 60 * 60 * 24 * 30, // 30 days
});

export async function getSession() {
  return session;
}
