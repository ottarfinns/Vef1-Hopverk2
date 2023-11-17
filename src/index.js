import { el } from './lib/element.js';
import { renderProduct, renderFrontPage, navBar } from './lib/ui.js';

const bodyEl = document.body;
const wrapperEl = el('div', {
  class: 'wrapper',
});
bodyEl.appendChild(wrapperEl);
navBar(wrapperEl);

function route() {
  const { pathname } = window.location;

  const sParams = new URLSearchParams(pathname);

  const id = sParams.get('id');

  if (id) {
    renderProduct();
  } else {
    renderFrontPage(wrapperEl);
  }
}
route();
