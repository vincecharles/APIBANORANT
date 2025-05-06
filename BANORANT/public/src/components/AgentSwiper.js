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
      <div class="flex flex-col lg:flex-row gap-8 max-h-[80vh] overflow-y-auto">
        <div class="flex-shrink-0 flex flex-col items-center w-full lg:w-1/3">
          <img src="${agent.fullPortrait}" class="w-60 max-w-full mx-auto mb-4 rounded-xl shadow-lg border-4 border-indigo-400"/>
          <div class="flex flex-wrap gap-2 mt-4 justify-center">
            ${agent.role ? `<span class="bg-indigo-600 px-4 py-2 rounded-full text-base font-bold">${agent.role.displayName}</span>` : ''}
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <h3 class="text-3xl font-extrabold mb-4 text-indigo-400">${agent.displayName}</h3>
          <p class="text-gray-200 mb-6 text-lg leading-relaxed whitespace-pre-line break-words">${agent.description}</p>
          <div class="mt-2">
            <h4 class="text-2xl font-bold text-indigo-300 mb-4">Abilities</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${agent.abilities.filter(a => a.displayName).map(a => `
                <div class="flex items-start gap-4 bg-gray-900 rounded-xl p-4 shadow transition hover:shadow-lg">
                  ${a.displayIcon ? `<img src="${a.displayIcon}" alt="${a.displayName}" class="w-14 h-14 rounded border-2 border-indigo-400 bg-gray-800" />` : ''}
                  <div>
                    <div class="font-bold text-lg text-indigo-200 mb-1">${a.displayName}</div>
                    <div class="text-gray-400 text-base">${a.description}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    container.querySelector('#close-modal').onclick = () => modal.classList.add('hidden');
  }
}