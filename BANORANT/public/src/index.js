import { renderAgentSwiper } from './components/AgentSwiper.js';
import { renderMapsSection } from './components/MapsSection.js';
import { renderWeaponsSection } from './components/WeaponsSection.js';
import { renderBundlesSection } from './components/BundlesSection.js';
import { renderPlayerSearch } from './components/PlayerSearch.js';
import { getCompetitiveTiers } from './api/valorant.js'; 



let allTiers = [];
const app = document.getElementById('app');


//Spinner
const spinner = document.getElementById('loading-spinner');
spinner.style.display = 'flex'; 

async function initializeApp() {
  app.innerHTML = `
    <div id="home-section"></div>
    <div id="weapons-section" class="hidden"></div>
    <div id="maps-section" class="hidden"></div>
    <div id="bundles-section" class="hidden"></div>
    <div id="players-section" class="hidden"></div>
  `;

  // Render Agent Swiper and Competitive Tiers in Home
  await renderAgentSwiper(document.getElementById('home-section'));
  await renderCompetitiveTiers(document.getElementById('home-section'));
  await renderWeaponsSection(document.getElementById('weapons-section'));
  await renderMapsSection(document.getElementById('maps-section'));
  await renderBundlesSection(document.getElementById('bundles-section'));
  await renderPlayerSearch(document.getElementById('players-section'));

  spinner.style.display = 'none';
  showSection('home');
}

initializeApp();

const sections = {
  home: document.getElementById('home-section'),
  weapons: document.getElementById('weapons-section'),
  maps: document.getElementById('maps-section'),
  bundles: document.getElementById('bundles-section'),
  players: document.getElementById('players-section'),
  tiers: document.getElementById('tiers-section'),
};

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



function showSection(section) {
  Object.entries(sections).forEach(([key, el]) => {
    if (key === section) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.section === section) {
      link.classList.add('text-indigo-300');
    } else {
      link.classList.remove('text-indigo-300');
    }
  });
}



document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

showSection('home');