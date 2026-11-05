const ARROW_TEXT = 'arrow_forward';

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

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
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
