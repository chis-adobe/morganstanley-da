/**
 * Cards Award
 * Each row is an award: [icon | title, description, source].
 * A final row holding only a link becomes the footer link (e.g. "View all awards").
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  let footer;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const links = row.querySelectorAll('a');
    const linkOnly = links.length === 1 && row.textContent.trim() === links[0].textContent.trim();
    if (linkOnly && !row.querySelector('h1, h2, h3, h4, h5, h6')) {
      footer = document.createElement('p');
      footer.className = 'cards-award-footer';
      footer.append(links[0]);
      return;
    }
    const li = document.createElement('li');
    cells.forEach((cell) => {
      const iconOnly = cell.querySelector('.icon, svg, picture') && !cell.textContent.trim();
      cell.className = iconOnly ? 'cards-award-icon' : 'cards-award-body';
      li.append(cell);
    });
    // last paragraph after the description is the award source
    const body = li.querySelector('.cards-award-body');
    const paras = body ? [...body.querySelectorAll(':scope > p')] : [];
    if (paras.length > 1) paras[paras.length - 1].classList.add('cards-award-source');
    ul.append(li);
  });
  block.replaceChildren(ul);
  if (footer) block.append(footer);
}
