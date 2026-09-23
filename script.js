// Replace these sample entries with project news, newest first.
const newsItems = [
  { title: 'Starting the journey', summary: 'Heading to Tübingen for the kick-off meeting of the priority program.' },
];
const pageSize = 3;
let currentPage = 1;
const grid = document.querySelector('#news-grid');
const pagination = document.querySelector('#pagination');
const status = document.querySelector('#news-status');

function renderNews(focusLabel) {
  const pageCount = Math.ceil(newsItems.length / pageSize);
  grid.replaceChildren();
  const start = (currentPage - 1) * pageSize;
  newsItems.slice(start, start + pageSize).forEach(item => {
    const card = document.createElement('article');
    card.className = 'card news-card';
    for (const [tag, className, text] of [
      ['h3', '', item.title],
      ['p', '', item.summary]
    ]) {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = text;
      card.append(element);
    }
    grid.append(card);
  });
  status.textContent = newsItems.length ? `Showing ${start + 1}–${Math.min(start + pageSize, newsItems.length)} of ${newsItems.length} updates` : 'No updates yet. Check back soon.';
  pagination.replaceChildren();
  if (pageCount < 2) return;
  function addButton(text, label, target, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-controls', 'news-grid');
    button.disabled = disabled;
    if (text === String(currentPage)) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => { currentPage = target; renderNews(label); });
    pagination.append(button);
  }
  addButton('←', 'Previous news page', currentPage - 1, currentPage === 1);
  for (let page = 1; page <= pageCount; page++) addButton(String(page), `News page ${page}`, page);
  addButton('→', 'Next news page', currentPage + 1, currentPage === pageCount);
  if (focusLabel) {
    const previousControl = Array.from(pagination.children).find(button => button.getAttribute('aria-label') === focusLabel && !button.disabled);
    (previousControl || pagination.querySelector('[aria-current="page"]')).focus({ preventScroll: true });
  }
}
renderNews();

const links = Array.from(document.querySelectorAll('.header-inner nav a'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
