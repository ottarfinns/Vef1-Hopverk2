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
      'li',
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
    el('button', { class: 'button' /* 'btn btn-neutral' */ }, 'Leita')
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
  console.log(parentElement);
  console.log(searchForm);
  const main = document.querySelector('main');
  /* const prodListElement = document.querySelector('.product-list');

  if (prodListElement) {
    prodListElement.remove();
  } */

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

  /* const selectedLink = document.querySelector('.allar-link');
  if (selectedLink) {
    selectedLink.classList.add('font-bold');
  } */

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
    { class: 'top' /* flex justify-between w-full' */ },
    el(
      'nav',
      { class: 'nav' },
      el(
        'a',
        { class: 'titill' /* 'h1 self-center text-2xl' */, href: '/' },
        'Vefforritunarbúðin'
      ),
      el(
        'div',
        { class: 'hlekkir' },
        el(
          'div',
          { class: 'hlekkir1' /* flex gap-4' */ },
          el('a', { class: 'hlekkir1 ul', href: '#' }, 'Nýskrá'),
          el('a', { class: 'hlekkir1 ul', href: '#' }, 'Innskrá'),
          el('a', { class: 'hlekkir1 ul', href: '#' }, 'Karfa')
        ),
        el(
          'div',
          { class: 'hlekkir2' /* 'flex gap-4' */ },
          el(
            'a',
            { class: 'hlekkir2 ul nyjar-link', href: '#' },
            'Nýjar Vörur'
          ),
          el('a', { class: 'hlekkir2 ul', href: '#' }, 'Flokkar')
        )
      )
    )
  );
  /* const navDiv = el('div', {
    class: 'nav'  'nav-div flex gap-4 flex-wrap' ,
  }); */
  // navEl.appendChild(navDiv);
  parentElement.appendChild(navEl);
}

/* async function categoriesFront() {
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
} */

export async function renderFrontPage(parentElement, query) {
  const mainEl = el('main', { class: 'main' });
  const homePageProducts = await nyjarVorur('products?limit=6');
  const productsListButton = pageButton('Vörulisti', '?limit=100');
  /* const categoryContainer = await categoriesFront(); */

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
  /* mainEl.appendChild(categoryContainer); */
  parentElement.appendChild(mainEl);

  if (query) {
    searchAndRender(mainEl, form, query);
  }
}
