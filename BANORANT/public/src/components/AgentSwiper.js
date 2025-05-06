import { getAgents } from '../api/valorant.js';

export async function renderAgentSwiper(container) {
  const agents = await getAgents();
  container.innerHTML = `
    <div class="glass p-8 mb-8">
      <h2 class="text-3xl font-bold mb-6 text-center tracking-widest text-indigo-400">Meet the Agents</h2>
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          ${agents.map(agent => `
            <div class="swiper-slide flex flex-col items-center cursor-pointer" data-agent-id="${agent.uuid}">
              <img src="${agent.displayIcon}" alt="${agent.displayName}" class="w-28 h-28 rounded-full border-4 border-gray-700 shadow-lg"/>
              <span class="mt-3 font-semibold text-lg">${agent.displayName}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div id="agent-modal" class="hidden">
      <div class="glass p-8 rounded-2xl max-w-lg w-full relative animate-fade-in">
        <button id="close-modal" class="absolute top-2 right-4 text-white text-3xl hover:text-indigo-400">&times;</button>
        <div id="agent-modal-content"></div>
      </div>
    </div>
  `;

  const swiper = new Swiper('.mySwiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    centeredSlides: true,
    grabCursor: true,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 4 }
    }
  });

  container.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const agentId = slide.getAttribute('data-agent-id');
      const agent = agents.find(a => a.uuid === agentId);
      showAgentModal(agent);
    });
  });

  function showAgentModal(agent) {
    const modal = container.querySelector('#agent-modal');
    const content = container.querySelector('#agent-modal-content');
    content.innerHTML = `
      <h3 class="text-2xl font-bold mb-2 text-indigo-400">${agent.displayName}</h3>
      <img src="${agent.fullPortrait}" class="w-48 mx-auto mb-4 rounded-xl shadow-lg"/>
      <p class="text-gray-200 mb-2">${agent.description}</p>
      <div class="flex flex-wrap gap-2 mt-4 justify-center">
        ${agent.role ? `<span class="bg-indigo-600 px-3 py-1 rounded-full text-xs">${agent.role.displayName}</span>` : ''}
        ${agent.abilities.filter(a => a.displayName).map(a => `
          <span class="bg-gray-700 px-2 py-1 rounded text-xs">${a.displayName}</span>
        `).join('')}
      </div>
    `;
    modal.classList.remove('hidden');
    container.querySelector('#close-modal').onclick = () => modal.classList.add('hidden');
  }
}