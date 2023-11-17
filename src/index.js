import { el } from './lib/element.js';
import { renderProductPage, renderFrontPage, navBar } from './lib/ui.js';

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

  if (id) {
    renderProductPage(wrapperEl, id);
  } else {
    renderFrontPage(wrapperEl);
  }
}
route();
