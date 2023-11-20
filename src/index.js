import { el } from './lib/element.js';
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
route();
