/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product. Base: cards (no images).
 * Source: https://us.etrade.com/bank
 * Selector: .card-container.super-card-one
 *
 * Cards (no images) table structure (from library):
 * Row 1: Block name
 * Each subsequent row: 1 cell with heading, description, CTA
 *
 * Source DOM structure:
 * - .card-container.super-card-one: each product card
 *   - h3.header-small: card title
 *   - h4.subhead-small: card subtitle (APY info)
 *   - ul > li.text-default: feature list
 *   - .card-btn-group: CTA buttons (Open an account + Learn more)
 */
export default function parse(element, { document }) {
  const title = element.querySelector('h3.header-small, h3');
  const subtitle = element.querySelector('h4.subhead-small, h4');
  const featureList = element.querySelector('ul');
  const ctas = element.querySelectorAll('.card-btn-group a, a.btn');

  const contentCell = [];
  if (title) contentCell.push(title);
  if (subtitle) contentCell.push(subtitle);
  if (featureList) contentCell.push(featureList);
  ctas.forEach((cta) => contentCell.push(cta));

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
