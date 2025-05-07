const BASE_URL = 'https://valorant-api.com/v1';

export async function getAgents() {
  const res = await fetch(`${BASE_URL}/agents?isPlayableCharacter=true`);
  const data = await res.json();
  return data.data;
}

export async function getMaps() {
  const res = await fetch(`${BASE_URL}/maps`);
  const data = await res.json();
  return data.data;
}

export async function getWeapons() {
  const res = await fetch(`${BASE_URL}/weapons`);
  const data = await res.json();
  return data.data;
}

export async function getPlayerCards() {
  const res = await fetch(`${BASE_URL}/playercards`);
  const data = await res.json();
  return data.data;
}

export async function getBundles() {
  const res = await fetch(`${BASE_URL}/bundles`);
  const data = await res.json();
  return data.data;
}

export async function searchPlayer(name, tag) {
  const res = await fetch(`/.netlify/functions/player-search?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
  if (!res.ok) throw new Error('Player not found');
  const data = await res.json();
  return data.data;
}

export async function getCompetitiveTiers() {
  const res = await fetch('https://valorant-api.com/v1/competitivetiers');
  const data = await res.json();
  return data.data;
}