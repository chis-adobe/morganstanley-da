/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature. Base: columns.
 * Source: https://us.etrade.com/bank
 * Selector: section.content-prospect:has(.rounded-corner-image) .columncontrol
 *
 * Columns table structure (from library):
 * Row 1: Block name
 * Each subsequent row: N cells side by side
 *
 * Source DOM structure (lending section):
 * - .col-sm-push-6: right column (image) pushed visually right
 *   - img.rounded-corner-image: device mockup image
 * - .col-sm-pull-6: left column (text) pulled visually left
 *   - p.eyebrow: "Line of Credit"
 *   - h2.header-2xl: "Explore lending solutions"
 *   - p.text-default > span.text-white: description
 *   - span.text-white: "Not FDIC insured" disclaimer
 *   - a.btn-primary-outline: "Learn more" CTA
 */
export default function parse(element, { document }) {
  const parentSection = element.closest('section') || element;

  // Extract image from the pushed-right column
  const image = parentSection.querySelector('img.rounded-corner-image, img.responsive-imageET');

  // Extract text content from the pulled-left column
  const eyebrow = parentSection.querySelector('p.eyebrow, .eyebrow');
  const heading = parentSection.querySelector('h2.header-2xl, h2');
  const description = parentSection.querySelector('p.text-default, p:has(span.text-white)');
  const disclaimer = parentSection.querySelector('.col-sm-pull-6 p:last-of-type span.text-white');
  const cta = parentSection.querySelector('a.btn-primary-outline, a.btn');

  // Build text column: eyebrow + heading + description + disclaimer + CTA
  const textCol = [];
  if (eyebrow) textCol.push(eyebrow);
  if (heading) textCol.push(heading);
  if (description) textCol.push(description);
  if (disclaimer && disclaimer.textContent.trim() !== heading?.textContent?.trim()) {
    const disclaimerP = document.createElement('p');
    disclaimerP.textContent = disclaimer.textContent.trim();
    textCol.push(disclaimerP);
  }
  if (cta) textCol.push(cta);

  // Build image column
  const imageCol = [];
  if (image) imageCol.push(image);

  const cells = [[textCol, imageCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
