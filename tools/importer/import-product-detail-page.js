/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroDarkParser from './parsers/hero-dark.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsNumberedParser from './parsers/cards-numbered.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsAwardParser from './parsers/columns-award.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import etradeCleanupTransformer from './transformers/etrade-cleanup.js';
import etradeSectionsTransformer from './transformers/etrade-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-dark': heroDarkParser,
  'cards-product': cardsProductParser,
  'cards-numbered': cardsNumberedParser,
  'cards-article': cardsArticleParser,
  'columns-award': columnsAwardParser,
  'columns-feature': columnsFeatureParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'product-detail-page',
  description: 'Product detail page with dark hero, feature highlights, benefits grid, promotional offers, awards, education cards, FAQ accordion, and CTA sections',
  urls: [
    'https://us.etrade.com/bank',
    'https://us.etrade.com/bank/premium-savings-account',
    'https://us.etrade.com/bank/max-rate-checking',
    'https://us.etrade.com/bank/checking',
    'https://us.etrade.com/bank/certificate-of-deposit',
    'https://us.etrade.com/bank/line-of-credit',
  ],
  blocks: [
    {
      name: 'hero-dark',
      instances: ['.componentContainer:first-of-type > section .columncontrol:first-of-type'],
    },
    {
      name: 'cards-product',
      instances: ['.card-container.super-card-one'],
    },
    {
      name: 'cards-numbered',
      instances: ['.card-container.pricing-card'],
    },
    {
      name: 'cards-article',
      instances: ['.card-container.image-card', '.card-container.super-card-two'],
    },
    {
      name: 'columns-award',
      instances: ['section:has(img.responsive-imageET[alt*=\'Awards\']) .columncontrol'],
    },
    {
      name: 'columns-feature',
      instances: ['section.content-prospect:has(.rounded-corner-image) .columncontrol'],
    },
    {
      name: 'accordion-faq',
      instances: ['.accordion-section .accordion-group'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      selector: '.componentContainer:first-of-type > section',
      style: 'dark',
      blocks: ['hero-dark'],
      defaultContent: [],
    },
    {
      id: 'product-cards',
      name: 'Product Cards Section',
      selector: 'section.content-prospect:has(.super-card-one)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.columncontrol:first-of-type .richTextEditor h2', '.columncontrol:first-of-type .richTextEditor .text-default', '.richTextEditor:has(.currentDate)'],
    },
    {
      id: 'benefits',
      name: 'Benefits Section',
      selector: 'section:has(.pricing-card)',
      style: null,
      blocks: ['cards-numbered'],
      defaultContent: ['.col-centered-8 h2'],
    },
    {
      id: 'limited-offers',
      name: 'Limited Time Offers Section',
      selector: 'section.content-prospect:has(.image-card)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2.header-2xl.text-center'],
    },
    {
      id: 'awards',
      name: 'Awards & Recognition Section',
      selector: 'section:has(img.responsive-imageET[alt*=\'Awards\'])',
      style: null,
      blocks: ['columns-award'],
      defaultContent: [],
    },
    {
      id: 'lending',
      name: 'Lending Solutions Section',
      selector: 'section.content-prospect:has(.rounded-corner-image)',
      style: 'dark',
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'education',
      name: 'Education & Resources Section',
      selector: 'section:has(.super-card-two)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['.richTextEditor .eyebrow', '.richTextEditor .header-3xl'],
    },
    {
      id: 'faq',
      name: 'FAQ Section',
      selector: 'section:has(.accordion-section)',
      style: 'light-gray',
      blocks: ['accordion-faq'],
      defaultContent: ['h2.header-3xl.text-center'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  etradeCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [etradeSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Selector failed for block "${blockDef.name}": ${selector}`, e);
      }
    });
  });
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
