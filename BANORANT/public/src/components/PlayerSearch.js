import { searchPlayer } from '../api/valorant.js';

const API_KEY = import.meta.env.VITE_VALORANT_API_KEY || process.env.VALORANT_API_KEY;

export function renderPlayerSearch(container) {
  container.innerHTML = `
    <div class="glass mb-6">
      <h2 class="text-2xl font-bold mb-4 text-indigo-300">Player Search</h2>
      <div class="flex flex-col md:flex-row items-center gap-2">
        <input id="player-name-input" type="text" placeholder="Player Name" class="flex-1 p-2 rounded bg-gray-700 text-white" />
        <input id="player-tag-input" type="text" placeholder="Tag (e.g. NA1)" class="w-32 p-2 rounded bg-gray-700 text-white" />
        <button id="player-search-btn" class="bg-indigo-600 px-6 py-2 rounded text-white font-semibold hover:bg-indigo-500 transition">Search</button>
      </div>
      <div id="player-result" class="mt-6"></div>
    </div>
  `;

  const nameInput = container.querySelector('#player-name-input');
  const tagInput = container.querySelector('#player-tag-input');
  const searchBtn = container.querySelector('#player-search-btn');
  const resultDiv = container.querySelector('#player-result');

  searchBtn.onclick = async () => {
    const name = nameInput.value.trim();
    const tag = tagInput.value.trim();
    if (!name || !tag) {
      resultDiv.innerHTML = `<div class="text-red-400">Please enter both name and tag.</div>`;
      return;
    }
    resultDiv.innerHTML = `<div class="text-gray-400">Searching...</div>`;
    try {
      const player = await searchPlayer(name, tag, API_KEY);
      resultDiv.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-4">
          <img src="${player.card.small}" alt="Player Card" class="w-24 h-24 rounded shadow-lg" />
          <div class="text-xl font-bold text-indigo-200">${player.name} #${player.tag}</div>
          <div class="text-gray-400">Region: ${player.region}</div>
          <div class="text-gray-400">Account Level: ${player.account_level}</div>
          <div class="text-gray-400">Kills: ${player.stats?.kills ?? 'N/A'}</div>
          <div class="text-gray-400">Deaths: ${player.stats?.deaths ?? 'N/A'}</div>
          <div class="text-gray-400">Assists: ${player.stats?.assists ?? 'N/A'}</div>
          <div class="text-gray-400">Score: ${player.stats?.score ?? 'N/A'}</div>
          <div class="text-gray-400">Elo: ${player.stats?.elo ?? 'N/A'}</div>
        </div>
      `;
    } catch (err) {
      resultDiv.innerHTML = `<div class="text-red-400">Player not found or API error.</div>`;
    }
  };
}