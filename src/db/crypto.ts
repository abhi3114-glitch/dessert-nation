/**
 * Secure password hashing using Web Crypto API (SHA-256 + salt).
 * Works 100% offline — no library needed, built into every modern browser.
 *
 * Security model:
 * - Each user gets a unique random salt (prevents rainbow table attacks)
 * - Password is hashed as SHA-256(salt + password)
 * - Only the hash and salt are ever stored — never the plain text password
 * - Even if the database is leaked, hashes cannot be reversed without brute force
 */

/** Generate a cryptographically random salt (16 bytes = 32 hex chars) */
export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Hash a password using SHA-256 with the given salt */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a password against a stored hash + salt.
 * Returns true if the password matches.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Hash a new password and return hash + salt pair.
 * Use this when creating or changing a password.
 */
export async function createPasswordHash(
  password: string
): Promise<{ passwordHash: string; passwordSalt: string }> {
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  return { passwordHash, passwordSalt: salt };
}
