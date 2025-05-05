'use server';

import { updateSession, clearSession, isLockedOut, getRemainingLockoutTime } from '../lib/session';
import { cookies } from 'next/headers';

export async function authenticate(password: string) {
  const lockedOut = await isLockedOut();
  if (lockedOut) {
    const remainingTime = await getRemainingLockoutTime();
    return {
      success: false,
      error: `Too many failed attempts. Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again.`
    };
  }

  if (password === 'capmydata') {
    await clearSession();
    const cookieStore = await cookies();
    cookieStore.set('isAuthenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    return { success: true };
  }

  const session = await updateSession(1, Date.now());
  return {
    success: false,
    error: 'Incorrect password'
  };
} 