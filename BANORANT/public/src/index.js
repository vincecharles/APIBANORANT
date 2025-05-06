import { renderAgentSwiper } from './components/AgentSwiper.js';
import { renderMapsSection } from './components/MapsSection.js';
import { renderWeaponsSection } from './components/WeaponsSection.js';
import { renderBundlesSection } from './components/BundlesSection.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div id="home-section"></div>
  <div id="weapons-section" class="hidden"></div>
  <div id="maps-section" class="hidden"></div>
  <div id="bundles-section" class="hidden"></div>
`;

renderAgentSwiper(document.getElementById('home-section'));
renderWeaponsSection(document.getElementById('weapons-section'));
renderMapsSection(document.getElementById('maps-section'));
renderBundlesSection(document.getElementById('bundles-section'));

const sections = {
  home: document.getElementById('home-section'),
  weapons: document.getElementById('weapons-section'),
  maps: document.getElementById('maps-section'),
  bundles: document.getElementById('bundles-section'),
};

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