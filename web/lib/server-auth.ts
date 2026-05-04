import { cookies } from 'next/headers';

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('arcturus_admin_token')?.value;
  return token || process.env.ADMIN_TOKEN || null;
}