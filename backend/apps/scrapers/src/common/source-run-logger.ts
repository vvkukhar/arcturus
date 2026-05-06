import { prisma } from '../prisma';

export async function startSourceRun(sourceCode: string): Promise<string> {
  const source = await prisma.marketSource.findUnique({
    where: {
      code: sourceCode,
    },
  });

  if (!source) {
    throw new Error(`Source not found: ${sourceCode}`);
  }

  const run = await prisma.sourceRunLog.create({
    data: {
      sourceId: source.id,
      startedAt: new Date(),
      status: 'running',
      itemsSeen: 0,
      itemsMatched: 0,
      itemsInserted: 0,
      itemsUpdated: 0,
    },
  });

  return run.id;
}

export async function finishSourceRun(params: {
  runId: string;
  itemsSeen: number;
  itemsMatched: number;
  itemsInserted: number;
  itemsUpdated: number;
  status: string;
  errorMessage?: string;
}): Promise<void> {
  await prisma.sourceRunLog.update({
    where: {
      id: params.runId,
    },
    data: {
      finishedAt: new Date(),
      status: params.status,
      itemsSeen: params.itemsSeen,
      itemsMatched: params.itemsMatched,
      itemsInserted: params.itemsInserted,
      itemsUpdated: params.itemsUpdated,
      errorMessage: params.errorMessage,
    },
  });
}