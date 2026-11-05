import { loadFragment } from '../fragment/fragment.js';

const ARROW_TEXT = 'arrow_forward';

/**
 * A row whose only content is a path (text or a same-site link), e.g. /fragments/accounts/x,
 * is a card stored in a fragment page.
 */
function getFragmentPath(row) {
  if (row.querySelector('h1, h2, h3, h4, h5, h6, ul, ol, picture')) return null;
  const text = row.textContent.trim();
  const link = row.querySelector('a');
  let path = text;
  if (link) {
    if (link.textContent.trim() !== text) return null;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin && !/\.(aem|hlx)\.(page|live)$/.test(url.hostname)) return null;
    path = url.pathname;
  }
  return /^\/[\w\-/]+$/.test(path) ? path.replace(/\.(plain\.)?html$/, '') : null;
}

/** Loads a fragment and returns its content as a single card cell. */
async function loadFragmentCell(path) {
  try {
    const fragment = await loadFragment(path);
    const cell = document.createElement('div');
    fragment.querySelectorAll(':scope > .section > div').forEach((group) => {
      cell.append(...group.childNodes);
    });
    return cell.textContent.trim() ? cell : null;
  } catch {
    return null;
  }
}

function isLinkOnly(p) {
  return p.querySelector('a') && [...p.childNodes]
    .every((n) => ['A', 'EM', 'STRONG'].includes(n.nodeName) || !n.textContent.trim());
}

/**
 * Collects the link-only paragraphs of a card into one actions row:
 * the first link is the primary button, the rest are arrow text links.
 */
function decorateActions(li) {
  const paras = [...li.querySelectorAll('p')].filter(isLinkOnly);
  if (!paras.length) return;
  const actions = document.createElement('div');
  actions.className = 'cards-product-actions';
  paras.forEach((p) => {
    p.querySelectorAll('a').forEach((a) => {
      // legacy markup: "Label <em>arrow_forward</em>" or a duplicate arrow-only link
      if (a.textContent.trim() === ARROW_TEXT) return;
      a.querySelectorAll('em').forEach((em) => {
        if (em.textContent.trim() === ARROW_TEXT) em.remove();
      });
      actions.append(a);
    });
    p.remove();
  });
  [...actions.children].forEach((a, idx) => {
    a.classList.add(idx === 0 ? 'cards-product-primary' : 'cards-product-link');
  });
  li.append(actions);
}

function decorateTag(li) {
  const heading = li.querySelector('h2, h3, h4');
  const tag = heading?.previousElementSibling;
  if (tag?.tagName === 'P' && !tag.querySelector('a')) tag.classList.add('cards-product-tag');
}

export default async function decorate(block) {
  const rows = [...block.children];
  // swap fragment-path rows for the fragment content, keeping row order
  await Promise.all(rows.map(async (row) => {
    const path = getFragmentPath(row);
    if (!path) return;
    const cell = await loadFragmentCell(path);
    if (cell) row.replaceChildren(cell);
    else row.remove();
  }));

  const ul = document.createElement('ul');
  rows.filter((row) => row.isConnected).forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-product-card-image';
      else div.className = 'cards-product-card-body';
    });
    decorateTag(li);
    decorateActions(li);
    li.querySelectorAll(':scope > div:empty').forEach((div) => div.remove());
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
