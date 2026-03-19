/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-award. Base: columns.
 * Source: https://us.etrade.com/bank
 * Selector: section:has(img.responsive-imageET[alt*='Awards']) .columncontrol
 *
 * Columns table structure (from library):
 * Row 1: Block name
 * Each subsequent row: N cells side by side
 *
 * Source DOM structure:
 * - .richTextEditor: h3 "Awards and recognition" + h2 quote text
 * - .columncontrol .row-flex: image column + text column
 *   - .col-sm-1 img.responsive-imageET: award badge image
 *   - .col-sm-5 .richTextEditor: attribution text
 * - .richTextEditor: "View all awards" link
 */
export default function parse(element, { document }) {
  // Find the section containing the awards content
  const parentSection = element.closest('section') || element;

  // Extract heading and quote from richTextEditor above the columncontrol
  const heading = parentSection.querySelector('h3.header-medium, h3');
  const quote = parentSection.querySelector('h2.vertical-offset-xxl, h2:not([class*="header-"])');

  // Extract award badge image
  const badgeImage = parentSection.querySelector('img.responsive-imageET, img[alt*="Awards"], img[alt*="award"]');

  // Extract attribution text
  const attribution = parentSection.querySelector('.col-sm-5 .text-default, .col-sm-5 .richTextEditor .text-default');

  // Extract "View all awards" link
  const viewAllLink = parentSection.querySelector('a[href*="awards"], a[title*="awards"]');

  // Build left column: heading + quote + link
  const leftCol = [];
  if (heading) leftCol.push(heading);
  if (quote) leftCol.push(quote);
  if (attribution) leftCol.push(attribution);
  if (viewAllLink) leftCol.push(viewAllLink);

  // Build right column: badge image
  const rightCol = [];
  if (badgeImage) rightCol.push(badgeImage);

  const cells = [[leftCol, rightCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-award', cells });
  element.replaceWith(block);
}
