export function isValidUsername(username: string): boolean {
  // Username validation: 6-20 chars, letters, numbers, _ and . only
  const usernameRegex = /^[a-zA-Z0-9_.]{6,20}$/;
  return usernameRegex.test(username);
}
