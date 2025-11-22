import { PartyState, Guest, EVENT_UPDATE } from '../types';
import { BOARD_DATA } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// --- DRAFT SYSTEM (Kept Local) ---
export const saveDraftVotes = (partyId: string, guestId: string, votes: Record<string, string[]>) => {
  localStorage.setItem(`draft_${partyId}_${guestId}`, JSON.stringify(votes));
};

export const getDraftVotes = (partyId: string, guestId: string): Record<string, string[]> | null => {
  const stored = localStorage.getItem(`draft_${partyId}_${guestId}`);
  return stored ? JSON.parse(stored) : null;
};

// --- SUPABASE SERVICE ---

// Helper to notify React components to re-fetch
const notify = () => {
  window.dispatchEvent(new Event(EVENT_UPDATE));
};

// Cache to hold the current party state in memory for the view
let currentPartyCache: PartyState | null = null;

export const getParty = (partyId?: string): PartyState | null => {
  return currentPartyCache;
};

// Helper to map DB rows to Application State
const mapDbToParty = (partyRow: any, guestRows: any[]): PartyState => {
  return {
    id: partyRow.id,
    hostName: partyRow.host_name,
    createdAt: new Date(partyRow.created_at).getTime(),
    status: partyRow.status,
    finalSelections: partyRow.final_selections || [],
    allowedItemIds: partyRow.allowed_item_ids || [],
    guests: guestRows.map(g => ({
      id: g.id,
      name: g.name,
      votes: g.votes || {}
    }))
  };
};

// Create a new party in Supabase
export const createParty = async (hostName: string): Promise<PartyState> => {
  const allItemIds = BOARD_DATA.flatMap(cat => cat.items.map(i => i.id));
  const newId = uuidv4();

  const { data, error } = await supabase
    .from('parties')
    .insert([
      { 
        id: newId, 
        host_name: hostName,
        status: 'setup',
        final_selections: [],
        allowed_item_ids: allItemIds
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating party:", error);
    throw error;
  }

  // Initialize cache
  currentPartyCache = mapDbToParty(data, []);
  return currentPartyCache;
};

// Join an existing party
export const joinParty = async (partyId: string, guestName: string): Promise<Guest> => {
  const newGuestId = uuidv4();

  const { data, error } = await supabase
    .from('guests')
    .insert([
      {
        id: newGuestId,
        party_id: partyId,
        name: guestName,
        votes: {}
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    votes: data.votes
  };
};

// Submit votes (Update guest row)
export const submitVotes = async (partyId: string, guestId: string, votes: Record<string, string[]>) => {
  const { error } = await supabase
    .from('guests')
    .update({ votes: votes })
    .eq('id', guestId)
    .eq('party_id', partyId);

  if (error) console.error("Error submitting votes", error);
  else {
    localStorage.removeItem(`draft_${partyId}_${guestId}`);
  }
};

// Update Party Status/Selections
export const updatePartyStatus = async (partyId: string, status: 'setup' | 'active' | 'finalized', finalSelections?: string[]) => {
  const updates: any = { status };
  if (finalSelections) updates.final_selections = finalSelections;

  await supabase.from('parties').update(updates).eq('id', partyId);
};

export const updatePartyAllowedItems = async (partyId: string, allowedItemIds: string[]) => {
  await supabase.from('parties').update({ allowed_item_ids: allowedItemIds }).eq('id', partyId);
};

// Fetch and Subscribe (Realtime)
export const subscribeToParty = (partyId: string, callback: () => void) => {
  let subscription: any = null;

  const fetchInitial = async () => {
    // 1. Get Party
    const { data: partyData, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('id', partyId)
      .single();

    if (partyError || !partyData) {
      // console.error("Party not found");
      currentPartyCache = null;
      callback();
      return;
    }

    // 2. Get Guests
    const { data: guestsData } = await supabase
      .from('guests')
      .select('*')
      .eq('party_id', partyId);

    currentPartyCache = mapDbToParty(partyData, guestsData || []);
    callback();
  };

  // Run initial fetch
  fetchInitial();

  // Set up Realtime Subscription
  subscription = supabase
    .channel(`party:${partyId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'parties', filter: `id=eq.${partyId}` }, (payload) => {
      // Refresh full state on party update (simplified approach)
      fetchInitial(); 
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guests', filter: `party_id=eq.${partyId}` }, (payload) => {
      fetchInitial();
    })
    .subscribe();

  // Cleanup function
  return () => {
    if (subscription) supabase.removeChannel(subscription);
  };
};