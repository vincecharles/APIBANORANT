import { getWeapons } from '../api/valorant.js';

const allWeapons = [];

export const renderWeaponsSection = async (container) => {
  if (!allWeapons.length) {
    allWeapons.push(...await getWeapons());
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
  let selectedIndex = -1;

  const handleInput = () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      autosuggest.classList.add('hidden');
      return;
    }
    const suggestions = allWeapons.filter(w => w.displayName.toLowerCase().includes(value));
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
  };

  const handleSearch = () => {
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
            <div class="text-white-400 text-sm mt-2">
              <div>Category: ${weapon.shopData?.category ?? 'N/A'}</div>
              <div>Cost: ${weapon.shopData?.cost ?? 'N/A'}</div>
              <div>Fire Rate: ${weapon.weaponStats?.fireRate ?? 'N/A'}</div>
              <div>Magazine: ${weapon.weaponStats?.magazineSize ?? 'N/A'}</div>
              <div>Reload: ${weapon.weaponStats?.reloadTimeSeconds ? `${weapon.weaponStats.reloadTimeSeconds}s` : 'N/A'}</div>
              ${weapon.weaponStats?.damageRanges?.length ? `
                <div class="mt-1">
                  <span class="font-bold text-indigo-200">Damage:</span>
                  ${weapon.weaponStats.damageRanges.map(dmg => `
                    <div class="ml-2 text-xs">
                      <span>${dmg.rangeStartMeters}-${dmg.rangeEndMeters}m:</span>
                      <span>Head: ${dmg.headDamage}, Body: ${dmg.bodyDamage}, Leg: ${dmg.legDamage}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const handleKeyDown = (e) => {
    const items = autosuggest.querySelectorAll('li');
    if (!items.length) return;

    switch (e.key) {
      case 'ArrowDown':
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((li, i) => li.classList.toggle('bg-indigo-600', i === selectedIndex));
        e.preventDefault();
        break;
      case 'ArrowUp':
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle('bg-indigo-600', i === selectedIndex));
        e.preventDefault();
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          input.value = items[selectedIndex].dataset.name;
          autosuggest.classList.add('hidden');
          searchBtn.click();
          e.preventDefault();
        }
        break;
    }
  };

  // Event Listeners
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('blur', () => setTimeout(() => autosuggest.classList.add('hidden'), 100));
  searchBtn.addEventListener('click', handleSearch);
  autosuggest.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      input.value = e.target.dataset.name;
      autosuggest.classList.add('hidden');
    }
  });
};