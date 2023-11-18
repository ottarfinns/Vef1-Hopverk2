import { el } from './element.js';
import { fetchFromLink } from './api.js';

async function nyjarVorur(link) {
  const res = await fetchFromLink(link);
  const products = res.items;

  const list = el('ul', { class: 'product-list grid grid-cols-12 gap-4' });

  for (const prod of products) {
    const productElement = el(
      'div',
      { class: 'prod-card col-span-4' },
      el(
        'a',
        { href: `/?id=${prod.id}` },
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

  return list;
}

export async function renderProductPage(parentElement, id) {
  const main = el('main', { class: 'main' });
  const fetchLink = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products/${id}`;
  const product = await fetchFromLink(fetchLink);

  const singleProductElement = el(
    'div',
    { class: '' },
    el('img', { src: `${product.image}` }),
    el(
      'div',
      { class: 'SPInfo' },
      el('h3', { class: '' }, `${product.title}`),
      el(
        'div',
        {},
        el('p', {}, `Flokkur: ${product.category_title}`),
        el('p', {}, `Verð: ${product.price}`)
      ),
      el('p', {}, product.description)
    )
  );

  main.appendChild(singleProductElement);

  const catLink = `/products?limit=3&category=${product.category_id}`;
  const catContainer = await nyjarVorur(catLink);

  main.appendChild(catContainer);
  parentElement.appendChild(main);
}

export function navBar(parentElement) {
  const navEl = el(
    'nav',
    { class: 'nav flex justify-between w-full' },
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
  parentElement.appendChild(navEl);
}

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

  categoryContainer.appendChild(list);
  return categoryContainer;
}

export async function renderFrontPage(parentElement) {
  const mainEl = el('main', { class: 'main' });
  const productList = await nyjarVorur('products?limit=6');
  const categoryContainer = await categoriesFront();
  mainEl.appendChild(productList);
  mainEl.appendChild(categoryContainer);
  parentElement.appendChild(mainEl);
}
