import { getWeapons } from '../api/valorant.js';

let allWeapons = [];

export async function renderWeaponsSection(container) {
  if (!allWeapons.length) {
    allWeapons = await getWeapons();
  }

  container.innerHTML = `
    <div class="glass">
      <h2 class="text-2xl font-bold mb-4 text-indigo-300">Weapons</h2>
      <div class="mb-4 relative">
        <input id="weapon-search-input" type="text" placeholder="Search weapons..." class="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
        <ul id="weapon-autosuggest" class="absolute left-0 right-0 bg-gray-800 rounded shadow-lg z-10 hidden"></ul>
      </div>
      <button id="weapon-search-btn" class="bg-indigo-600 px-6 py-2 rounded text-white font-semibold hover:bg-indigo-500 transition">Search</button>
      <div id="weapon-results" class="mt-6"></div>
    </div>
  `;

  const input = container.querySelector('#weapon-search-input');
  const autosuggest = container.querySelector('#weapon-autosuggest');
  const results = container.querySelector('#weapon-results');
  const searchBtn = container.querySelector('#weapon-search-btn');

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      autosuggest.classList.add('hidden');
      return;
    }
    const suggestions = allWeapons.filter(w => w.displayName.toLowerCase().includes(value));
    if (suggestions.length) {
      autosuggest.innerHTML = suggestions
        .slice(0, 5)
        .map(w => `<li class="px-4 py-2 hover:bg-indigo-600 cursor-pointer" data-name="${w.displayName}">${w.displayName}</li>`)
        .join('');
      autosuggest.classList.remove('hidden');
    } else {
      autosuggest.classList.add('hidden');
    }
  });

  autosuggest.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      input.value = e.target.dataset.name;
      autosuggest.classList.add('hidden');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => autosuggest.classList.add('hidden'), 100);
  });

  searchBtn.addEventListener('click', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      results.innerHTML = '';
      return;
    }
    const filtered = allWeapons.filter(w => w.displayName.toLowerCase().includes(value));
    if (!filtered.length) {
      results.innerHTML = `<div class="text-red-400 text-center">No weapons found.</div>`;
      return;
    }
    results.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${filtered.map(weapon => `
          <div class="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition">
          <img src="${weapon.displayIcon}" alt="${weapon.displayName}" title="${weapon.displayName}" class="w-full h-20 object-contain mb-2"/>
            <div class="font-semibold text-lg text-indigo-200">${weapon.displayName}</div>
          </div>
        `).join('')}
      </div>
    `;
  });


let selectedIndex = -1;

input.addEventListener('input', () => {
  const value = input.value.trim().toLowerCase();
  if (!value) {
    autosuggest.classList.add('hidden');
    return;
  }
  const suggestions = allWeapons.filter(w => w.displayName.toLowerCase().includes(value));
  if (suggestions.length) {
    autosuggest.innerHTML = suggestions
      .slice(0, 5)
      .map((w, i) => `<li class="px-4 py-2 hover:bg-red-600 cursor-pointer" data-index="${i}" data-name="${w.displayName}">${w.displayName}</li>`)
      .join('');
    autosuggest.classList.remove('hidden');
    selectedIndex = -1;
  } else {
    autosuggest.classList.add('hidden');
  }
});

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