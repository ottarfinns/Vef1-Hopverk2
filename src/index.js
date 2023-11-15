import { el } from './lib/element.js';
import { getSixProd } from './lib/api.js';

const bodyEl = document.body;
const wrapperEl = el('div', {
  class: 'wrapper',
});
const mainEl = el('main', {
  class: 'main',
});
wrapperEl.appendChild(mainEl);
bodyEl.appendChild(wrapperEl);

const navBar = async () => {
  const navEl = el(
    'nav',
    { class: 'nav flex justify-between' },
    el('h1', { class: 'h1 self-center text-2xl' }, 'Vefforritunarbúðin')
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
};
navBar();

async function nyjarVorur() {
  const products = await getSixProd();

  console.log(products);

  const list = el('ul', { class: 'product-list flex' });

  for (const prod of products) {
    const productElement = el(
      'li',
      { class: 'prod-container' },
      el(
        'div',
        { class: 'prod-card' },
        el('img', { class: 'prod-img', src: `${prod.image}` }),
        el(
          'div',
          { class: 'prod-info-container' },
          el(
            'span',
            { class: 'prod-title' },
            `${prod.title} ${prod.category_title}`
          ),
          el('span', { class: 'prod-price' }, `${prod.price} kr.-`)
        )
      )
    );
    list.appendChild(productElement);
  }

  mainEl.appendChild(list);
}
nyjarVorur();
