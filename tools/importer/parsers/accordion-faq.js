/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://us.etrade.com/bank
 * Selector: .accordion-section .accordion-group
 *
 * Accordion table structure (from library):
 * Row 1: Block name
 * Each subsequent row: 2 cells - Title | Content
 *
 * Source DOM structure:
 * - ul.accordion-group > li: each FAQ item
 *   - .accordion-item-wrapper > .accordion-item:
 *     - h4 > button.accordion-trigger > span.accordion-trigger__text: question
 *     - section[id$="-panel"] > div: answer content (paragraphs, lists, links, tables)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('li > .accordion-item-wrapper, li');
  const cells = [];

  items.forEach((item) => {
    // Extract question text from the trigger button
    const questionEl = item.querySelector('.accordion-trigger__text, .accordion-trigger span:last-child, h4');
    // Extract answer content from the panel section
    const answerEl = item.querySelector('section[id$="-panel"] > div, .accordion-item > section > div');

    if (questionEl && answerEl) {
      const questionText = questionEl.textContent.trim();
      const questionP = document.createElement('p');
      questionP.textContent = questionText;
      cells.push([questionP, answerEl]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
