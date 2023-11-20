import { el, empty } from './lib/element.js';
import {
  renderProductPage,
  renderFrontPage,
  navBar,
  renderProductsList,
} from './lib/ui.js';

const bodyEl = document.body;
const wrapperEl = el('div', {
  class: 'wrapper',
});
bodyEl.appendChild(wrapperEl);
navBar(wrapperEl);

function route() {
  const { search } = window.location;

  const sParams = new URLSearchParams(search);

  const id = sParams.get('id');

  const limit = sParams.get('limit');

  const query = sParams.get('query');

  if (id) {
    renderProductPage(wrapperEl, id);
  } else if (limit) {
    renderProductsList(wrapperEl, limit, query);
  } else {
    renderFrontPage(wrapperEl, query);
  }
}

window.onpopstate = () => {
  const mainEl = document.querySelector('main');
  const form = document.querySelector('.form-container');
  /* const sParams = new URLSearchParams(window.location.search);
  const query = sParams.get('query'); */

  if (form) {
    form.remove();
  }

  if (mainEl) {
    mainEl.remove();
  }

  route();
};

route();
