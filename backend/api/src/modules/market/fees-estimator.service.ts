import { Injectable } from '@nestjs/common';
export type FeesEstimateInput = {
 salePrice: number;
 channel: string;
};
export type FeesEstimateResult = {
 platformFeeRate: number;
 paymentFeeRate: number;
 packagingCost: number;
};
@Injectable()
export class FeesEstimatorService {
 estimate(input: FeesEstimateInput): FeesEstimateResult {
 const channel = input.channel.toLowerCase();
 if (channel === 'olx') {
 return {
 platformFeeRate: 0.00,
 paymentFeeRate: 0.00,
 packagingCost: 30,
 };
 }
 if (channel === 'bricklink') {
 return {
 platformFeeRate: 0.085,
 paymentFeeRate: 0.03,
 packagingCost: 40,
 };
 }
 if (channel === 'brickowl') {
 return {
 platformFeeRate: 0.09,
 paymentFeeRate: 0.03,
 packagingCost: 40,
 };
 }
 if (channel === 'ebay') {
 return {
 platformFeeRate: 0.13,
 paymentFeeRate: 0.03,
 packagingCost: 45,
 };
 }
 return {
 platformFeeRate: 0.08,
 paymentFeeRate: 0.02,
 packagingCost: 35,
 };
 }
}