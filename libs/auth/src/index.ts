export const allowedEmailDomain = 'ntusa.ntu.edu.tw' as const;

export interface AuthUser {
  email: string;
  name?: string;
  picture?: string;
  domain: typeof allowedEmailDomain;
}

export interface AuthMeResponse {
  user: AuthUser | null;
}

export interface SessionRecord {
  idHash: string;
  user: AuthUser;
  createdAt: string;
  expiresAt: string;
}

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${allowedEmailDomain}`);
}
