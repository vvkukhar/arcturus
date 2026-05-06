export type BrickeconomyParsedListing = {
  externalListingId: string;
  titleRaw: string;
  url: string;
  imageUrl: string | null;
  price: number;
  currency: string;
};