import { Injectable } from '@nestjs/common';

@Injectable()
export class SourceConfidenceService {
  private readonly weights: Record<string, number> = {
    bricklink: 1.0,
    brickowl: 0.92,
    ebay: 0.88,
    olx: 0.72,
    rozetka: 0.7,
    prom: 0.68,
    unknown: 0.5,
  };

  getWeight(sourceCode: string | null | undefined): number {
    if (!sourceCode) {
      return this.weights.unknown;
    }
    return this.weights[sourceCode.toLowerCase()] ?? this.weights.unknown;
  }
}