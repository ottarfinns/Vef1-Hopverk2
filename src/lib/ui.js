import { el, empty } from './element.js';
import { fetchFromLink } from './api.js';

async function nyjarVorur(link) {
  const res = await fetchFromLink(link);
  const products = res.items;

  if (products.length === 0) {
    const noResultsEl = el(
      'span',
      { class: 'noresults font-bold' },
      'Vara fannst ekki'
    );
    return noResultsEl;
  }

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

function pageButton(page, query) {
  const button = el(
    'button',
    { class: 'bg-black text-white w-64 h-12' },
    `${page}`
  );
  button.addEventListener('click', () => {
    window.location.href = `${query}`;
  });
  return button;
}

function renderSearchForm(searchHandler, query = undefined) {
  const form = el(
    'form',
    {},
    el('input', {
      value: query ?? '',
      name: 'query',
      class: 'input input-bordered w-full max-w-xs',
      placeholder: 'Leita að vörum',
    }),
    el('button', { class: 'btn btn-neutral' }, 'Leita')
  );

  form.addEventListener('submit', searchHandler);

  return form;
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

async function searchAndRender(parentElement, searchForm, query) {
  const main = document.querySelector('main');

  if (!main) {
    console.warn('fann ekki <main> element');
    return;
  }
  empty(main);

  const resultsElement = document.querySelector('.results');
  if (resultsElement) {
    resultsElement.remove();
  }

  const button = pageButton('Forsíða', '/');

  const searchResultsEl = await nyjarVorur(`/products?search=${query}`);

  main.appendChild(searchResultsEl);
  main.appendChild(button);
}

async function onSearch(e) {
  e.preventDefault();

  if (!e.target || !(e.target instanceof Element)) {
    return;
  }

  const { value } = e.target.querySelector('input') ?? {};

  if (!value) {
    return;
  }

  const mainEl = document.querySelector('main');

  await searchAndRender(mainEl, e.target, value);

  window.history.pushState({}, '', `?query=${value}`);
}

export async function renderProductsList(parentElement, limit, query) {
  const main = el('main', { class: 'main' });

  const productList = await nyjarVorur(`products?limit=${limit}`);
  const button = pageButton('Forsíða', '/');

  const form = renderSearchForm(onSearch, query);
  const formContainer = el('div', { class: 'form-container' });
  formContainer.appendChild(form);
  parentElement.appendChild(formContainer);

  main.appendChild(productList);
  main.appendChild(button);
  parentElement.appendChild(main);

  if (query) {
    searchAndRender(main, form, query);
  }
}

export function navBar(parentElement) {
  const navEl = el(
    'nav',
    { class: 'nav flex justify-between w-full' },
    el(
      'a',
      { class: 'h1 self-center text-2xl', href: '/' },
      'Vefforritunarbúðin'
    )
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

export async function renderFrontPage(parentElement, query) {
  const mainEl = el('main', { class: 'main' });
  const homePageProducts = await nyjarVorur('products?limit=6');
  const productsListButton = pageButton('Vörulisti', '?limit=100');

  const form = renderSearchForm(onSearch, query);
  const formContainer = el('div', { class: 'form-container' });
  formContainer.appendChild(form);
  parentElement.appendChild(formContainer);

  mainEl.appendChild(homePageProducts);
  mainEl.appendChild(productsListButton);
  parentElement.appendChild(mainEl);

  if (query) {
    searchAndRender(mainEl, form, query);
  }
}
