import { getCompetitiveTiers } from '../api/valorant.js';

let allTiers = [];

export async function renderCompetitiveTiers(container) {
  if (!allTiers.length) {
    const data = await getCompetitiveTiers();
    // Get the latest season's tiers
    allTiers = data[data.length - 1].tiers.filter(t => t.tierName && t.largeIcon);
  }
  container.innerHTML = `
    <div class="glass">
      <h2 class="text-2xl font-bold mb-4 text-indigo-300">Competitive Tiers</h2>
      <div class="flex flex-wrap gap-6 justify-center">
        ${allTiers.map(tier => `
          <div class="flex flex-col items-center">
            <img src="${tier.largeIcon}" alt="${tier.tierName}" class="w-16 h-16 mb-2"/>
            <div class="text-indigo-200 font-semibold">${tier.tierName}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}