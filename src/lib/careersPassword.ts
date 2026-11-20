export const CAREERS_PASSWORD_MIN_LENGTH = 10;

export function validateCareersPassword(password: string, confirmation: string) {
  if (password.length < CAREERS_PASSWORD_MIN_LENGTH) {
    return `Use at least ${CAREERS_PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password !== confirmation) return "Passwords do not match.";
  return null;
}