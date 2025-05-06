import { getBundles, getWeapons, getPlayerCards } from '../api/valorant.js';

let allBundles = [];
let allSkins = [];
let allPlayerCards = [];

export async function renderBundlesSection(container) {
  if (!allBundles.length) {
    allBundles = await getBundles();
  }
  if (!allSkins.length) {
    const weapons = await getWeapons();
    allSkins = weapons.flatMap(w => w.skins);
  }
  if (!allPlayerCards.length) {
    allPlayerCards = await getPlayerCards();
  }

  container.innerHTML = `
    <div class="glass">
      <h2 class="text-2xl font-bold mb-4 text-indigo-300">Bundles</h2>
      <div class="mb-4 relative">
        <input id="bundle-search-input" type="text" placeholder="Search bundles..." class="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
        <ul id="bundle-autosuggest" class="absolute left-0 right-0 bg-gray-800 rounded shadow-lg z-10 hidden"></ul>
      </div>
      <button id="bundle-search-btn" class="bg-indigo-600 px-6 py-2 rounded text-white font-semibold hover:bg-indigo-500 transition">Search</button>
      <div id="bundle-results" class="mt-6"></div>
    </div>
    <div id="bundle-modal" class="hidden fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div class="glass max-w-2xl w-full relative p-8">
        <button id="close-bundle-modal" class="absolute top-2 right-4 text-white text-3xl hover:text-indigo-400">&times;</button>
        <div id="bundle-modal-content"></div>
      </div>
    </div>
  `;

  const input = container.querySelector('#bundle-search-input');
  const autosuggest = container.querySelector('#bundle-autosuggest');
  const results = container.querySelector('#bundle-results');
  const searchBtn = container.querySelector('#bundle-search-btn');
  const modal = container.querySelector('#bundle-modal');
  const modalContent = container.querySelector('#bundle-modal-content');
  const closeModalBtn = container.querySelector('#close-bundle-modal');

  // Autosuggest
  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      autosuggest.classList.add('hidden');
      return;
    }
    const suggestions = allBundles.filter(b => b.displayName.toLowerCase().includes(value));
    if (suggestions.length) {
      autosuggest.innerHTML = suggestions
        .slice(0, 5)
        .map(w => `
          <li class="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600 cursor-pointer" data-name="${w.displayName}">
            <img src="${w.displayIcon}" alt="${w.displayName}" class="w-8 h-8 object-contain rounded" />
            <span>${w.displayName}</span>
          </li>
        `)
        .join('');
      autosuggest.classList.remove('hidden');
    } else {
      autosuggest.classList.add('hidden');
    }
  });

  autosuggest.addEventListener('click', (e) => {
    if (e.target.closest('li')) {
      input.value = e.target.closest('li').dataset.name;
      autosuggest.classList.add('hidden');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => autosuggest.classList.add('hidden'), 100);
  });

  // Search logic
  searchBtn.addEventListener('click', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      results.innerHTML = '';
      return;
    }
    const filtered = allBundles.filter(b => b.displayName.toLowerCase().includes(value));
    if (!filtered.length) {
      results.innerHTML = `<div class="text-red-400 text-center">No bundles found.</div>`;
      return;
    }
    results.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filtered.map(bundle => `
          <div class="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer bundle-card" data-bundle-id="${bundle.uuid}">
            <img src="${bundle.displayIcon}" alt="${bundle.displayName}" class="w-full h-40 object-contain mb-2 rounded"/>
            <div class="font-semibold text-lg text-indigo-200">${bundle.displayName}</div>
            <div class="text-gray-400 text-sm mt-1">${bundle.description || ''}</div>
            ${bundle.displayName && bundle.price ? `<div class="mt-2 text-indigo-400 font-bold">Price: ${bundle.price}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Add click event to each bundle card
    results.querySelectorAll('.bundle-card').forEach(card => {
      card.addEventListener('click', () => {
        const bundleId = card.getAttribute('data-bundle-id');
        const bundle = allBundles.find(b => b.uuid === bundleId);
        showBundleModal(bundle);
      });
    });
  });

  // Modal
  function showBundleModal(bundle) {
    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <img src="${bundle.displayIcon}" alt="${bundle.displayName}" class="w-40 h-40 object-contain rounded mb-4 md:mb-0"/>
        <div>
          <h3 class="text-2xl font-bold text-indigo-400 mb-2">${bundle.displayName}</h3>
          <div class="text-gray-400 mb-2">${bundle.description || ''}</div>
          <div class="font-semibold text-lg text-indigo-200 mb-2">Contents:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${bundle.items && bundle.items.length
              ? bundle.items.map(item => {
                  //find the item in skins or player cards
                  let found = allSkins.find(skin => skin.uuid === item.itemUuid);
                  if (!found) {
                    found = allPlayerCards.find(card => card.uuid === item.itemUuid);
                  }
                  return found
                    ? `<div class="bg-gray-900 p-2 rounded flex items-center gap-3">
                        ${found.displayIcon || found.largeArt ? `<img src="${found.displayIcon || found.largeArt}" alt="${found.displayName}" class="w-12 h-12 object-contain rounded"/>` : ''}
                        <div>
                          <div class="font-bold text-indigo-200">${found.displayName}</div>
                        </div>
                      </div>`
                    : `<div class="bg-gray-900 p-2 rounded flex items-center gap-3">
                        <div class="font-bold text-indigo-200">Unknown Item</div>
                      </div>`;
                }).join('')
              : '<div class="text-gray-400">No items found in this bundle.</div>'
            }
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  }

  closeModalBtn.onclick = () => modal.classList.add('hidden');

  let selectedIndex = -1;
  input.addEventListener('keydown', (e) => {
    const items = autosuggest.querySelectorAll('li');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      selectedIndex = (selectedIndex + 1) % items.length;
      items.forEach((li, i) => li.classList.toggle('bg-red-600', i === selectedIndex));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      items.forEach((li, i) => li.classList.toggle('bg-red-600', i === selectedIndex));
      e.preventDefault();
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      input.value = items[selectedIndex].dataset.name;
      autosuggest.classList.add('hidden');
      searchBtn.click();
      e.preventDefault();
    }
  });
}