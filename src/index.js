import { el } from './lib/element.js';

const firstEl = () => {
  const anEl = el('main', { class: 'main bg-red-400' });
  document.body.appendChild(anEl);
  const insideMain = el('h1', { class: 'text-sky-500' }, 'Halló');
  const mainEl = document.querySelector('main');
  if (!mainEl) return;
  mainEl.appendChild(insideMain);
};

firstEl();
