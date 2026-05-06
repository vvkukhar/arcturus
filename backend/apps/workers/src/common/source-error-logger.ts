import { prisma } from '../prisma';

export async function logSourceError(params: {
  scope: string;
  sourceCode: string;
  referenceId?: string;
  message: string;
  detailsJson?: object;
}): Promise<void> {
  await prisma.syncErrorLog.create({
    data: {
      scope: params.scope,
      sourceCode: params.sourceCode,
      referenceId: params.referenceId,
      message: params.message,
      detailsJson: params.detailsJson ?? {},
    },
  });
}