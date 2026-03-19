/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-numbered. Base: cards (no images).
 * Source: https://us.etrade.com/bank
 * Selector: .card-container.pricing-card
 *
 * Cards (no images) table structure (from library):
 * Row 1: Block name
 * Each subsequent row: 1 cell with heading, description
 *
 * Source DOM structure:
 * - .card-container.pricing-card: each numbered benefit card
 *   - p.numeric-stats-lg > span: large number (1-4)
 *   - h3.header-small: benefit heading
 *   - .text-default: benefit description
 */
export default function parse(element, { document }) {
  const number = element.querySelector('p.numeric-stats-lg, .numeric-stats-lg');
  const title = element.querySelector('h3.header-small, h3');
  const description = element.querySelector('.card-text-group .text-default');

  const contentCell = [];
  if (number) contentCell.push(number);
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-numbered', cells });
  element.replaceWith(block);
}
