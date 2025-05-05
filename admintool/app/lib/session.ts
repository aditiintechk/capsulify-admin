import { cookies } from 'next/headers';

const SESSION_ID_KEY = 'auth_session_id';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 60000; // 1 minute in milliseconds

interface SessionData {
  failedAttempts: number;
  lastFailedAttempt: number | null;
}

// In-memory session store (in production, you'd want to use Redis or similar)
const sessionStore = new Map<string, SessionData>();

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_ID_KEY)?.value;
  
  if (!sessionId) {
    return {
      failedAttempts: 0,
      lastFailedAttempt: null
    };
  }

  return sessionStore.get(sessionId) || {
    failedAttempts: 0,
    lastFailedAttempt: null
  };
}

export async function updateSession(failedAttempts: number, lastFailedAttempt: number | null) {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_ID_KEY)?.value;

  if (!sessionId) {
    // Generate a new session ID
    sessionId = crypto.randomUUID();
    cookieStore.set(SESSION_ID_KEY, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  }

  const sessionData: SessionData = {
    failedAttempts,
    lastFailedAttempt
  };

  sessionStore.set(sessionId, sessionData);
}

export async function clearSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_ID_KEY)?.value;
  
  if (sessionId) {
    sessionStore.delete(sessionId);
    cookieStore.delete(SESSION_ID_KEY);
  }
}

export async function isLockedOut(): Promise<boolean> {
  const session = await getSession();
  if (!session.lastFailedAttempt) return false;

  const now = Date.now();
  return session.failedAttempts >= MAX_ATTEMPTS && 
         (now - session.lastFailedAttempt) < LOCKOUT_DURATION;
}

export async function getRemainingLockoutTime(): Promise<number> {
  const session = await getSession();
  if (!session.lastFailedAttempt) return 0;

  const now = Date.now();
  const elapsed = now - session.lastFailedAttempt;
  return Math.max(0, LOCKOUT_DURATION - elapsed);
} 