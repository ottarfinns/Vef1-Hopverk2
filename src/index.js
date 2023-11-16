import { el } from './lib/element.js';
import { fetchFromLink } from './lib/api.js';

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
  const res = await fetchFromLink('products?limit=6');

  const products = res.items;

  const list = el('ul', { class: 'product-list grid grid-cols-12 gap-4' });

  for (const prod of products) {
    const productElement = el(
      'div',
      { class: 'prod-card col-span-4' },
      el(
        'div',
        { class: 'prod-img-container' },
        el('img', { class: 'prod-img object-cover', src: `${prod.image}` })
      ),
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
    );
    list.appendChild(productElement);
  }

  mainEl.appendChild(list);
}
nyjarVorur();

async function categoriesFront() {
  const res = await fetchFromLink('/categories?limit=12');
  const categories = res.items;

  const categoryContainer = el(
    'div',
    { class: 'cat-container' },
    el(
      'h2',
      { class: 'cat-cont-header text-xl font-bold' },
      'Skoðaðu vöruflokkana okkar'
    )
  );

  const list = el('ul', { class: 'category-list grid gap-4 grid-cols-12' });

  for (const cat of categories) {
    const catElement = el(
      'div',
      {
        class:
          'category border-solid border-black border-2 col-span-4 text-center text-5xl',
      },
      `${cat.title}`
    );
    list.appendChild(catElement);
  }
  console.log(res);
  categoryContainer.appendChild(list);
  mainEl.appendChild(categoryContainer);
}

categoriesFront();
