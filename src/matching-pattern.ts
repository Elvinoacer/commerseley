export function isMatchingPath(pattern: string, path: string): boolean {
  // Convert the pattern to a regex
  const regexPattern = pattern
    .replace(/(:\w+\*)/g, "(.*)") // Handle wildcard params like :path*
    .replace(/(:\w+)/g, "([^/]+)") // Handle normal params like :id
    .replace(/\//g, "\\/"); // Escape slashes

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}
