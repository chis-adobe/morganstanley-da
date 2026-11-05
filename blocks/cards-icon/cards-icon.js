import loadIcons from '../../scripts/utils/icons.js';

/** Turns a cell whose only text is ":icon-name:" into that icon (if not already converted). */
function decorateIconText(cell) {
  const match = cell.textContent.trim().match(/^:([a-z0-9-]+):$/);
  if (!match) return false;
  const span = document.createElement('span');
  span.className = `icon icon-${match[1]}`;
  cell.replaceChildren(span);
  loadIcons([span]);
  return true;
}

/**
 * Cards Icon
 * Each row is a card: [icon | heading + text].
 * A row whose first cell is only a picture is the feature media; an optional
 * second cell in that row is shown as a notification over the image.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    const [first, second] = cells;
    const isMedia = first?.children.length === 1 && first.querySelector('picture');

    if (isMedia) {
      li.className = 'cards-icon-media';
      first.className = 'cards-icon-media-image';
      li.append(first);
      if (second?.textContent.trim()) {
        second.className = 'cards-icon-notification';
        li.append(second);
      }
    } else {
      li.className = 'cards-icon-card';
      cells.forEach((cell) => {
        const iconOnly = decorateIconText(cell) || (cell.children.length <= 1
          && cell.querySelector('.icon, svg, picture') && !cell.textContent.trim());
        cell.className = iconOnly ? 'cards-icon-icon' : 'cards-icon-body';
        li.append(cell);
      });
    }
    ul.append(li);
  });
  if (ul.querySelector('.cards-icon-media')) block.classList.add('has-media');
  block.replaceChildren(ul);
}
