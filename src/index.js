import { el } from './lib/element.js';
/* import { renderSixProd } from './lib/ui.js'; */
import { renderSixProd } from './lib/ui.js';

const bodyEl = document.body;
const mainEl = el('main', { class: 'main' });
bodyEl.appendChild(mainEl);

const navBar = () => {
  const navEl = el(
    'nav',
    { class: 'nav flex justify-between' },
    el('h1', { class: 'h1 self-center text-xl' }, 'Vefforritunarbúðin')
  );
  const navDiv = el(
    'div',
    { class: 'nav-div flex gap-4 flex-wrap' },
    el(
      'div',
      { class: 'flex gap-4' },
      el('a', { class: 'nav-link', href: '#' }, 'Nýskrá'),
      el('a', { class: 'nav-link', href: '#' }, 'Innskrá'),
      el('a', { class: 'nav-link', href: '#' }, 'Karfa')
    ),
    el(
      'div',
      { class: 'flex gap-4' },
      el('a', { class: 'nav-link', href: '#' }, 'Nýjar Vörur'),
      el('a', { class: 'nav-link', href: '#' }, 'Flokkar')
    )
  );

  navEl.appendChild(navDiv);
  mainEl.appendChild(navEl);

  const foo = renderSixProd();
  console.log(foo);
};

navBar();
