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

  const list = el('ul', { class: 'product-list' });

  for (const prod of products) {
    const productElement = el(
      'li',
      { class: 'prod-card' },
      el(
        'a',
        { href: `/?id=${prod.id}` },
        el('img', { class: 'prod-img', src: `${prod.image}` })
      ),
      el(
        'div',
        { class: 'prod-info-container' },
        el(
          'div',
          {},
          el('p', { class: 'prod-title font-bold' }, `${prod.title}`),
          el('p', {}, `${prod.category_title}`)
        ),

        el('p', { class: 'prod-price font-bold' }, `${prod.price} kr.-`)
      )
    );
    list.appendChild(productElement);
  }

  return list;
}

function pageButton(page, query) {
  const button = el('button', { class: 'button' }, `${page}`);
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
      class: 'input',
      placeholder: 'Leita að vörum',
    }),
    el('button', { class: 'button' }, 'Leita')
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
    { class: 'single-product' },
    el('img', { src: `${product.image}` }),
    el(
      'div',
      { class: 'sp-info' },
      el('h3', { class: '' }, `${product.title}`),
      el(
        'div',
        { class: 'sp-info-price' },
        el('p', {}, `Flokkur: ${product.category_title}`),
        el('p', {}, `Verð: ${product.price}`)
      ),
      el('p', {}, product.description)
    )
  );

  main.appendChild(singleProductElement);

  const catLink = `/products?limit=3&category=${product.category_id}`;
  const catContainer = await nyjarVorur(catLink);

  const svipadarProd = el('h3', { class: 'svipadar-prod' }, 'Svipaðar vörur');

  main.appendChild(svipadarProd);
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
    'div',
    { class: 'top' },
    el(
      'nav',
      { class: 'nav' },
      el(
        'div',
        { class: 'titill' },
        el('a', { href: '/' }, 'Vefforritunarbúðin')
      ),
      el(
        'div',
        { class: 'hlekkir' },
        el(
          'div',
          { class: 'hlekkir1' },
          el('a', { href: '#' }, 'Nýskrá'),
          el('a', { href: '#' }, 'Innskrá'),
          el('a', { href: '#' }, 'Karfa')
        ),
        el(
          'div',
          { class: 'hlekkir2' },
          el('a', { href: '#' }, 'Nýjar Vörur'),
          el('a', { href: '#' }, 'Flokkar')
        )
      )
    )
  );
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

  const selectedLink = document.querySelector('.nyjar-link');
  if (selectedLink) {
    selectedLink.classList.add('font-bold');
  }

  mainEl.appendChild(homePageProducts);
  mainEl.appendChild(productsListButton);
  parentElement.appendChild(mainEl);

  if (query) {
    searchAndRender(mainEl, form, query);
  }
}
