export const renderPlayerCards = (container, cards, filter = '') => {
  const filtered = filter
    ? cards.filter(card => card.displayName.toLowerCase().includes(filter.toLowerCase()))
    : cards;

  if (!filtered.length) {
    container.innerHTML = `<div class="text-red-400 text-center">No player cards found.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="playercard-grid mt-6">
      ${filtered.map(card => `
        <div class="playercard">
          <img src="${card.largeArt}" alt="${card.displayName}" />
          <div class="playercard-content">
            <div class="playercard-title">${card.displayName}</div>
            <div class="playercard-subtitle">${card.themeUuid ? 'Special Theme' : 'Standard'}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};