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

export async function searchPlayer(name, tag, apiKey) {
  const url = `https://valorant-api-public.vercel.app/api/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
  const res = await fetch(url, {
    headers: {
      'x-api-key': apiKey
    }
  });
  if (!res.ok) throw new Error('Player not found');
  const data = await res.json();
  return data.data;
}

export async function getCompetitiveTiers() {
  const res = await fetch('https://valorant-api.com/v1/competitivetiers');
  const data = await res.json();
  return data.data;
}