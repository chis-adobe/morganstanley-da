/**
 * Nav Flyout Block
 *
 * Groups a top-level nav link with its flyout (mega-menu) columns.
 *
 * Content model (table):
 *   Row 1: [Link] | [Column 1] | [Column 2] | …
 *   Row 2 (optional): [Footer CTA]
 *
 * After decoration the DOM becomes:
 *   .nav-flyout
 *     .nav-flyout-link          – the top-level link
 *     .nav-flyout-menu          – wrapper (hidden by default, shown on hover/click)
 *       .nav-flyout-columns     – CSS-grid of flyout columns
 *         .nav-flyout-column *N
 *       .nav-flyout-footer      – optional CTA row
 */
export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const firstRow = rows[0];
  const cells = [...firstRow.children];
  if (!cells.length) return;

  /* ---- link ---- */
  const linkCell = cells[0];
  const linkWrapper = document.createElement('div');
  linkWrapper.className = 'nav-flyout-link';
  while (linkCell.firstChild) linkWrapper.append(linkCell.firstChild);

  el.textContent = '';
  el.append(linkWrapper);

  /* ---- flyout menu (only when there are extra columns) ---- */
  if (cells.length > 1) {
    const menu = document.createElement('div');
    menu.className = 'nav-flyout-menu';

    const columns = document.createElement('div');
    columns.className = 'nav-flyout-columns';
    columns.style.setProperty('--flyout-columns', cells.length - 1);

    for (let i = 1; i < cells.length; i += 1) {
      cells[i].className = 'nav-flyout-column';
      columns.append(cells[i]);
    }
    menu.append(columns);

    /* optional footer rows */
    for (let r = 1; r < rows.length; r += 1) {
      const footer = document.createElement('div');
      footer.className = 'nav-flyout-footer';
      while (rows[r].firstChild) footer.append(rows[r].firstChild);
      menu.append(footer);
    }

    el.append(menu);
  }
}
