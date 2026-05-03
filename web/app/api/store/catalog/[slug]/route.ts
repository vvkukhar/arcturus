import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: NextRequest, { params }: Props) {
  const { slug } = await params;

  const response = await fetch(
    `${appConfig.apiBaseUrl}/public/catalog/${encodeURIComponent(slug)}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return NextResponse.json(null, { status: response.status });
  }

  return NextResponse.json(await response.json());
}