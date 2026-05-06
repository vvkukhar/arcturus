export type EbayParsedListing = {
  externalListingId: string;
  titleRaw: string;
  url: string;
  imageUrl: string | null;
  sellerName: string | null;
  sellerRating: number | null;
  price: number;
  currency: string;
  shippingPrice: number | null;
  shippingCurrency: string | null;
  country: string;
  condition: string | null;
  sealed: boolean | null;
  completenessPercent: number | null;
  quantityAvailable: number | null;
};