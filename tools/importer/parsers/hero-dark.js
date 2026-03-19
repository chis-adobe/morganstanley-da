/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-dark. Base: hero.
 * Source: https://us.etrade.com/bank
 * Selector: .componentContainer:first-of-type > section .columncontrol:first-of-type
 *
 * Hero block table structure (from library):
 * Row 1: Block name
 * Row 2: Background image (optional)
 * Row 3: Heading, subheading, description, CTA
 *
 * Source DOM structure:
 * - h1.eyebrow.text-white: eyebrow text
 * - h2.header-3xl.text-white: main heading
 * - p.text-default > span.text-white: description
 * - a.btn.btn-primary: CTA button
 * - .cash-hero or img: device mockup image (right column)
 */
export default function parse(element, { document }) {
  // Extract hero image from right column
  const image = element.querySelector('img.responsive-imageET, img[class*="hero"], .col-sm-7 img, .col-sm-push-6 img');

  // Extract text content from left column
  const eyebrow = element.querySelector('h1.eyebrow, .eyebrow');
  const heading = element.querySelector('h2.header-3xl, h2[class*="header"]');
  const description = element.querySelector('p.text-default, p:has(span.text-white)');
  const cta = element.querySelector('a.btn-primary, a.btn');

  // Build content cell: eyebrow + heading + description + CTA
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Build cells array matching hero library structure
  const cells = [];
  if (image) cells.push([image]);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-dark', cells });
  element.replaceWith(block);
}
