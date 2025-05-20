import { getAgents } from '../api/valorant.js';

export const renderAgentSwiper = async (container) => {
  const agents = await getAgents();
  container.innerHTML = `
    <div class="glass p-8 mb-8">
      <h2 class="text-3xl font-bold mb-6 text-center tracking-widest text-indigo-400">Meet the Agents</h2>
      <div class="relative">
        <button class="swiper-nav-btn left-0" id="swiper-prev" aria-label="Previous Agent">
          <svg class="w-10 h-10 text-indigo-400 hover:text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
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
        <button class="swiper-nav-btn right-0" id="swiper-next" aria-label="Next Agent">
          <svg class="w-10 h-10 text-indigo-400 hover:text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
    <div id="agent-modal" class="hidden">
      <div class="glass p-8 rounded-2xl max-w-lg w-full relative animate-fade-in">
        <button id="close-modal" class="absolute top-2 right-4 text-white text-3xl hover:text-indigo-400">&times;</button>
        <div id="agent-modal-content"></div>
      </div>
    </div>
    <style>
      .swiper-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(30,41,59,0.7);
        border: none;
        border-radius: 9999px;
        padding: 0.25rem;
        cursor: pointer;
        transition: background 0.2s;
      }
      .swiper-nav-btn.left-0 { left: -2.5rem; }
      .swiper-nav-btn.right-0 { right: -2.5rem; }
      @media (max-width: 640px) {
        .swiper-nav-btn.left-0 { left: 0; }
        .swiper-nav-btn.right-0 { right: 0; }
      }
    </style>
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

  const showAgentModal = (agent) => {
    const modal = container.querySelector('#agent-modal');
    const content = container.querySelector('#agent-modal-content');
    content.innerHTML = `
      <div class="flex flex-col lg:flex-row gap-6 max-h-[80vh] overflow-y-auto">
        <div class="flex-shrink-0 flex flex-col items-center w-full lg:w-1/3">
          <img src="${agent.fullPortrait}" class="w-40 max-w-full mx-auto mb-4 rounded-xl shadow-lg border-4 border-indigo-400"/>
          <div class="flex flex-wrap gap-2 mt-2 justify-center">
            ${agent.role ? `<span class="bg-indigo-600 px-4 py-2 rounded-full text-base font-bold">${agent.role.displayName}</span>` : ''}
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <h3 class="text-2xl font-extrabold mb-2 text-indigo-400">${agent.displayName}</h3>
          <p class="text-gray-200 mb-4 text-base leading-relaxed whitespace-pre-line break-words">${agent.description}</p>
          <div class="mt-2">
            <h4 class="text-xl font-bold text-indigo-300 mb-3">Abilities</h4>
            <div class="flex flex-col gap-4">
              ${agent.abilities.filter(a => a.displayName).map(a => `
                <div class="flex items-start gap-4 bg-gray-900 rounded-xl p-3 shadow transition hover:shadow-lg">
                  ${a.displayIcon ? `<img src="${a.displayIcon}" alt="${a.displayName}" class="w-12 h-12 rounded border-2 border-indigo-400 bg-gray-800" />` : ''}
                  <div>
                    <div class="font-bold text-base text-indigo-200 mb-1">${a.displayName}</div>
                    <div class="text-gray-300 text-sm leading-snug" style="word-break:break-word;max-width:320px;">${a.description}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    modal.querySelector('.glass').style.maxWidth = '700px';
    modal.classList.remove('hidden');
  };

  // Event Listeners
  container.querySelector('#swiper-prev').addEventListener('click', () => swiper.slidePrev());
  container.querySelector('#swiper-next').addEventListener('click', () => swiper.slideNext());
  container.querySelector('#close-modal').addEventListener('click', () => {
    container.querySelector('#agent-modal').classList.add('hidden');
  });

  container.querySelectorAll('.swiper-slide').forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      swiper.slideToLoop(idx, 100, false);
      swiper.once('transitionEnd', () => {
        const agentId = slide.dataset.agentId;
        const agent = agents.find(a => a.uuid === agentId);
        showAgentModal(agent);
      });
    });
  });
};