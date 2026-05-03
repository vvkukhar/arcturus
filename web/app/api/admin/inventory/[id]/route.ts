import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: NextRequest, { params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/inventory/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(null, { status: response.status });
  }

  return NextResponse.json(await response.json());
}