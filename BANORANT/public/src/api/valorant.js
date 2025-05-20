const BASE_URL = 'https://valorant-api.com/v1';


export const getAgents = async () => {
  const res = await fetch(`${BASE_URL}/agents?isPlayableCharacter=true`);
  const { data } = await res.json();
  return data;
};

export const getMaps = async () => {
  const res = await fetch(`${BASE_URL}/maps`);
  const { data } = await res.json();
  return data;
};

export const getWeapons = async () => {
  const res = await fetch(`${BASE_URL}/weapons`);
  const { data } = await res.json();
  return data;
};

export const getPlayerCards = async () => {
  const res = await fetch(`${BASE_URL}/playercards`);
  const { data } = await res.json();
  return data;
};

export const getBundles = async () => {
  const res = await fetch(`${BASE_URL}/bundles`);
  const { data } = await res.json();
  return data;
};

export const searchPlayer = async (name, tag) => {
  const res = await fetch(`/.netlify/functions/player-search?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
  
  if (!res.ok) {
    let errorPayload = { error: `Player not found or API error (status ${res.status})` };
    try {
      errorPayload = await res.json();
    } catch {
    
    }
    throw new Error(errorPayload.error || `Player not found or API error (status ${res.status})`);
  }
  
  const { data } = await res.json();
  return data;
};

export const getCompetitiveTiers = async () => {
  const res = await fetch(`${BASE_URL}/competitivetiers`);
  const { data } = await res.json();
  return data;
};