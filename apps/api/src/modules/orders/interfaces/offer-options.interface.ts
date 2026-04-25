export interface OfferOption {
  id: string;
  name: string;
  category: string; // e.g., "Boisson", "Extra"
  price: number;
}

export interface OfferOptions {
  selections: OfferOption[];
  notes?: string;
}
