import { cookies } from 'next/headers';

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('arcturus_admin_token')?.value ?? process.env.ADMIN_TOKEN ?? null;
}