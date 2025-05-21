import { getPlayerCards } from '../api/valorant.js';

const CARDS_PER_PAGE = 12;

export const renderPlayerCardsSection = async (container) => {
  let allCards = await getPlayerCards();
  let currentPage = 1;
  const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);

  function renderPage(page) {
    const start = (page - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    const cards = allCards.slice(start, end);

    container.innerHTML = `
      <div class="glass">
        <h2 class="text-2xl font-bold mb-4 text-indigo-300">Player Cards</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${cards.map(card => `
            <div class="playercard-card group relative cursor-pointer transition-transform duration-200 hover:scale-105" data-card-id="${card.uuid}">
              <img src="${card.largeArt}" alt="${card.displayName}" class="rounded-lg shadow-lg w-full h-40 object-cover"/>
              <div class="mt-2 font-semibold text-indigo-200 text-center">${card.displayName}</div>
              <div class="text-xs text-gray-400 text-center">${card.themeUuid ? 'Special Theme' : 'Standard'}</div>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-center items-center gap-4 mt-6">
          <button id="prev-page" class="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition" ${page === 1 ? 'disabled' : ''}>&laquo; Prev</button>
          <span class="text-indigo-200 font-bold">Page ${page} / ${totalPages}</span>
          <button id="next-page" class="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition" ${page === totalPages ? 'disabled' : ''}>Next &raquo;</button>
        </div>
      </div>
      <div id="playercard-modal" class="hidden fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div class="glass max-w-md w-full relative p-8">
          <button id="close-playercard-modal" class="absolute top-2 right-4 text-white text-3xl hover:text-indigo-400">&times;</button>
          <div id="playercard-modal-content"></div>
        </div>
      </div>
      <style>
        .playercard-card:hover {
          z-index: 2;
          box-shadow: 0 8px 32px 0 var(--valo-accent);
        }
      </style>
    `;

    // Pagination
    container.querySelector('#prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });
    container.querySelector('#next-page').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });

    // Modal logic
    const modal = container.querySelector('#playercard-modal');
    const modalContent = container.querySelector('#playercard-modal-content');
    container.querySelector('#close-playercard-modal').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    container.querySelectorAll('.playercard-card').forEach(cardEl => {
      const cardId = cardEl.getAttribute('data-card-id');
      const card = allCards.find(c => c.uuid === cardId);

      // Show modal on click
      cardEl.addEventListener('click', () => {
        modalContent.innerHTML = `
          <img src="${card.largeArt}" alt="${card.displayName}" class="w-full h-64 object-cover rounded-xl mb-4 shadow-lg"/>
          <div class="text-2xl font-bold text-indigo-400 mb-2 text-center">${card.displayName}</div>
          <div class="text-gray-400 text-center mb-2">${card.themeUuid ? 'Special Theme' : 'Standard'}</div>
          ${card.wideArt ? `<img src="${card.wideArt}" alt="Wide Art" class="w-full rounded mb-2"/>` : ''}
        `;
        modal.classList.remove('hidden');
      });
    });
  }

  renderPage(currentPage);
};