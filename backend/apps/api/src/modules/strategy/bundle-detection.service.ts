import { Injectable } from '@nestjs/common';

export type BundleDetectionInput = {
  title: string;
  price?: number | null;
};

export type BundleDetectionResult = {
  isBundle: boolean;
  confidence: number;
  signals: string[];
};

@Injectable()
export class BundleDetectionService {
  detect(input: BundleDetectionInput): BundleDetectionResult {
    const normalized = input.title.toLowerCase();
    const signals: string[] = [];

    const bundleWords = [
      'bundle',
      'lot',
      'collection',
      'комплект',
      'набір наборів',
      'партія',
      'колекція',
      'купа',
      'разом',
    ];

    for (const word of bundleWords) {
      if (normalized.includes(word)) {
        signals.push(`word:${word}`);
      }
    }

    if (/\b\d+\s*(sets|набор)/i.test(input.title)) {
      signals.push('multi_set_count');
    }

    if (normalized.includes('+')) {
      signals.push('plus_sign');
    }

    if (normalized.includes('minifigures') || normalized.includes('мініфігур')) {
      signals.push('multiple_minifigs');
    }

    const confidence = Math.min(0.95, signals.length * 0.25);

    return {
      isBundle: confidence >= 0.35,
      confidence,
      signals,
    };
  }
}