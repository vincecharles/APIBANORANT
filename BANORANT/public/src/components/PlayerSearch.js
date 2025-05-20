import { searchPlayer } from '../api/valorant.js';

export const renderPlayerSearch = (container) => {
  container.innerHTML = `
    <div class="glass mb-6">
      <h2 class="text-2xl font-bold mb-4 text-indigo-300">Player Search</h2>
      <div class="flex flex-col md:flex-row items-center gap-2">
        <input id="player-name-input" type="text" placeholder="Player Name (case-sensitive, e.g. Takoyaki)" class="px-4 py-2 rounded bg-gray-700 text-white flex-grow" />
        <input id="player-tag-input" type="text" placeholder="Tag (e.g. VINCE)" class="px-4 py-2 rounded bg-gray-700 text-white flex-grow" />
        <button id="player-search-btn" class="bg-indigo-600 px-6 py-2 rounded text-white font-semibold hover:bg-indigo-500 transition">Search</button>
      </div>
      <div id="player-result" class="mt-6"></div>
    </div>
  `;

  const nameInput = container.querySelector('#player-name-input');
  const tagInput = container.querySelector('#player-tag-input');
  const searchBtn = container.querySelector('#player-search-btn');
  const resultDiv = container.querySelector('#player-result');

  const handleSearch = async () => {
    const name = nameInput.value.trim();
    const tag = tagInput.value.trim();
    
    if (!name || !tag) {
      resultDiv.innerHTML = `<div class="text-red-400">Please enter both name and tag.</div>`;
      return;
    }
    
    resultDiv.innerHTML = `<div class="text-gray-400">Searching...</div>`;
    
    try {
      const player = await searchPlayer(name, tag);
      resultDiv.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg flex flex-col items-center gap-4">
          <img src="${player.card.small}" alt="Player Card" class="w-24 h-24 rounded shadow-lg" />
          <div class="text-xl font-bold text-indigo-200">${player.name} #${player.tag}</div>
          <div class="text-gray-400">Region: ${player.region}</div>
          <div class="text-gray-400">Account Level: ${player.account_level}</div>
          <div class="text-gray-400">Current Rank: ${player.current_rank}</div>
          <div class="text-gray-400">Last Act: ${player.last_act}</div>
          <div class="text-gray-400">Kills: ${player.stats?.kills ?? 'N/A'}</div>
          <div class="text-gray-400">Deaths: ${player.stats?.deaths ?? 'N/A'}</div>
          <div class="text-gray-400">Assists: ${player.stats?.assists ?? 'N/A'}</div>
          <div class="text-gray-400">Score: ${player.stats?.score ?? 'N/A'}</div>
          <div class="text-gray-400">K/D: ${player.stats?.kd ?? 'N/A'}</div>
          <div class="text-gray-400">Win Rate: ${player.stats?.winRate ?? 'N/A'}</div>
          <div class="text-gray-400">Matches Played: ${player.stats?.matchesPlayed ?? 'N/A'}</div>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-bold text-indigo-300 mb-2">Recent Matches</h3>
          ${player.match_history?.length ? `
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm text-gray-300">
                <thead>
                  <tr>
                    <th class="px-2 py-1">Map</th>
                    <th class="px-2 py-1">Mode</th>
                    <th class="px-2 py-1">Result</th>
                    <th class="px-2 py-1">Kills</th>
                    <th class="px-2 py-1">Deaths</th>
                    <th class="px-2 py-1">Assists</th>
                    <th class="px-2 py-1">Score</th>
                    <th class="px-2 py-1">Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${player.match_history.slice(0, 10).map(match => `
                    <tr>
                      <td class="px-2 py-1">${match.map}</td>
                      <td class="px-2 py-1">${match.mode}</td>
                      <td class="px-2 py-1">${match.result}</td>
                      <td class="px-2 py-1">${match.kills}</td>
                      <td class="px-2 py-1">${match.deaths}</td>
                      <td class="px-2 py-1">${match.assists}</td>
                      <td class="px-2 py-1">${match.score}</td>
                      <td class="px-2 py-1">${new Date(match.date).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `<div class="text-gray-400">No recent matches found.</div>`}
        </div>
      `;
    } catch (error) {
      resultDiv.innerHTML = `<div class="text-red-400">Player not found or API error.</div>`;
    }
  };

  searchBtn.addEventListener('click', handleSearch);
};