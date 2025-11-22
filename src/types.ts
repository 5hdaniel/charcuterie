
export interface Item {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  title: string;
  selectionLimit: number;
  items: Item[];
}

export interface Vote {
  category: string;
  itemIds: string[];
}

export interface Guest {
  id: string;
  name: string;
  votes: Record<string, string[]>; // categoryId -> itemIds[]
}

export interface PartyState {
  id: string;
  hostName: string;
  guests: Guest[];
  createdAt: number;
  status: 'setup' | 'active' | 'finalized';
  finalSelections: string[]; // IDs of items selected by host for the final board
  allowedItemIds: string[]; // IDs of items allowed for voting
}

// Event keys for local storage synchronization
export const STORAGE_KEY = 'charcuterie_party_v1';
export const EVENT_UPDATE = 'party_update';