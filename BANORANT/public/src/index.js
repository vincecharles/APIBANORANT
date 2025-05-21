import { renderAgentSwiper } from './components/AgentSwiper.js';
import { renderMapsSection } from './components/MapsSection.js';
import { renderWeaponsSection } from './components/WeaponsSection.js';
import { renderBundlesSection } from './components/BundlesSection.js';
import { renderPlayerSearch } from './components/PlayerSearch.js';
import { getCompetitiveTiers } from './api/valorant.js';
import { renderPlayerCardsSection } from './components/PlayerCardsSection.js';

const allTiers = [];
const app = document.getElementById('app');
const spinner = document.getElementById('loading-spinner');
spinner.style.display = 'flex'; 

let sections = {};

const initializeApp = async () => {
  app.innerHTML = `
  <div id="home-section"></div>
  <div id="weapons-section" class="hidden"></div>
  <div id="maps-section" class="hidden"></div>
  <div id="bundles-section" class="hidden"></div>
  <div id="players-section" class="hidden"></div>
  <div id="playercards-section" class="hidden"></div>
`;


  // Initialize sections after creating them in the DOM
  sections = {
    home: document.getElementById('home-section'),
    weapons: document.getElementById('weapons-section'),
    maps: document.getElementById('maps-section'),
    bundles: document.getElementById('bundles-section'),
    players: document.getElementById('players-section'),
    playercards: document.getElementById('playercards-section'),
  };

  window.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('valo-hero');
    const logo = document.getElementById('valo-logo');
    const title = document.getElementById('valo-title');
    setTimeout(() => {
      hero.classList.add('reveal');
      setTimeout(() => {
        title.style.opacity = 1;
        setTimeout(() => {
          hero.classList.add('hide');
          setTimeout(() => {
            hero.style.display = 'none';
          }, 700);
        }, 1200); 
      }, 700); 
    }, 300); 
  });

  // Render all sections
  await Promise.all([
    renderAgentSwiper(document.getElementById('home-section')),
    renderCompetitiveTiers(document.getElementById('home-section')),
    renderWeaponsSection(document.getElementById('weapons-section')),
    renderMapsSection(document.getElementById('maps-section')),
    renderBundlesSection(document.getElementById('bundles-section')),
    renderPlayerSearch(document.getElementById('players-section')),
    renderPlayerCardsSection(document.getElementById('playercards-section')) 
  ]);

  spinner.style.display = 'none';
  showSection('home');
};

export const renderCompetitiveTiers = async (container) => {
  if (!allTiers.length) {
    const data = await getCompetitiveTiers();
    allTiers.push(...data[data.length - 1].tiers.filter(tier => tier.tierName && tier.largeIcon));
  }

  const div = document.createElement('div');
  div.className = 'glass';
  div.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-indigo-300">Competitive Tiers</h2>
    <div class="flex flex-wrap gap-6 justify-center">
      ${allTiers.map(tier => `
        <div class="flex flex-col items-center">
          <img src="${tier.largeIcon}" alt="${tier.tierName}" class="w-16 h-16 mb-2"/>
          <div class="text-indigo-200 font-semibold">${tier.tierName}</div>
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(div); 
};

const showSection = (section) => {
  // Hide all sections
  Object.values(sections).forEach(el => {
    if (el) el.classList.add('hidden');
  });

  // Show the selected section
  if (sections[section]) {
    sections[section].classList.remove('hidden');
  }

  // Update active state of navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === section) {
      link.classList.add('active');
    }
  });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) {
        showSection(section);
      }
    });
  });
});

// Initialize the app
initializeApp();