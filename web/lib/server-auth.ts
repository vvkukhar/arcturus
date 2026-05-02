export async function getAdminToken(): Promise<string | null> {
  return process.env.ADMIN_TOKEN ?? null;
}