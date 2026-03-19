/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article. Base: cards (with images).
 * Source: https://us.etrade.com/bank
 * Selectors: .card-container.image-card, .card-container.super-card-two
 *
 * Cards (with images) table structure (from library):
 * Row 1: Block name
 * Each subsequent row: 2 cells - Image | Text content (heading, description, CTA)
 *
 * Source DOM structure (image-card variant - offer cards):
 * - img.card-img: card image
 * - h3 > .header-small: card title
 * - h4.subhead-small: card subtitle
 * - .text-sm or .text-default: description
 * - .card-btn-group a: CTA links
 *
 * Source DOM structure (super-card-two variant - education cards):
 * - img.card-img: card image
 * - h3 > .subhead-small: card title
 * - .text-default: description
 * - .card-btn-group a: read more link
 */
export default function parse(element, { document }) {
  const image = element.querySelector('img.card-img, img');
  const title = element.querySelector('h3 .header-small, h3 .subhead-small, h3.header-small, h3');
  const subtitle = element.querySelector('h4.subhead-small, h4');
  const description = element.querySelector('.text-sm, .card-text-group > .text-default');
  const ctas = element.querySelectorAll('.card-btn-group a, a.btn');

  const textCell = [];
  if (title) textCell.push(title);
  if (subtitle) textCell.push(subtitle);
  if (description) textCell.push(description);
  ctas.forEach((cta) => textCell.push(cta));

  const cells = [];
  if (image) {
    cells.push([image, textCell]);
  } else {
    cells.push(textCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
