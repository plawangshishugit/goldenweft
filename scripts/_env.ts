/**
 * Loads DATABASE_URL (and anything else in .env) into process.env without
 * depending on the `dotenv` package (it's only present transitively, via
 * Prisma's own CLI, and isn't declared in package.json — not something
 * these standalone scripts should silently rely on staying available).
 *
 * Uses Node's built-in process.loadEnvFile (Node 20.6+) instead. If no
 * .env file is found (e.g. in a deployment where env vars are injected
 * directly by the platform), this quietly does nothing and whatever is
 * already in process.env is used as-is.
 */
export function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    process.loadEnvFile();
  } catch {
    // No .env in the current working directory — assume the environment
    // already has DATABASE_URL set some other way.
  }
}
