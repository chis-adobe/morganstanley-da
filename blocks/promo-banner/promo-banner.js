function isCtaParagraph(p) {
  const nodes = [...p.childNodes];
  return p.querySelector('a') && nodes.every((n) => n.nodeName === 'A' || !n.textContent.trim());
}

export default function decorate(block) {
  const content = block.querySelector(':scope > div > div');
  if (!content) return;
  content.className = 'promo-banner-content';

  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('promo-banner-heading');
    const eyebrow = heading.previousElementSibling;
    if (eyebrow?.tagName === 'P') eyebrow.classList.add('promo-banner-eyebrow');
  }

  // Gather link-only paragraphs into a single actions row
  const ctaParas = [...content.querySelectorAll(':scope > p')].filter(isCtaParagraph);
  if (ctaParas.length) {
    const actions = document.createElement('div');
    actions.className = 'promo-banner-actions';
    ctaParas.forEach((p) => {
      p.querySelectorAll('a').forEach((a) => {
        if (!a.classList.contains('btn')) a.classList.add('promo-banner-link');
        actions.append(a);
      });
      p.remove();
    });
    content.append(actions);
  }

  block.replaceChildren(content);
}
