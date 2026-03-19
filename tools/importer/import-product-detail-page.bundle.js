var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-product-detail-page.js
  var import_product_detail_page_exports = {};
  __export(import_product_detail_page_exports, {
    default: () => import_product_detail_page_default
  });

  // tools/importer/parsers/hero-dark.js
  function parse(element, { document }) {
    const image = element.querySelector('img.responsive-imageET, img[class*="hero"], .col-sm-7 img, .col-sm-push-6 img');
    const eyebrow = element.querySelector("h1.eyebrow, .eyebrow");
    const heading = element.querySelector('h2.header-3xl, h2[class*="header"]');
    const description = element.querySelector("p.text-default, p:has(span.text-white)");
    const cta = element.querySelector("a.btn-primary, a.btn");
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    const cells = [];
    if (image) cells.push([image]);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const title = element.querySelector("h3.header-small, h3");
    const subtitle = element.querySelector("h4.subhead-small, h4");
    const featureList = element.querySelector("ul");
    const ctas = element.querySelectorAll(".card-btn-group a, a.btn");
    const contentCell = [];
    if (title) contentCell.push(title);
    if (subtitle) contentCell.push(subtitle);
    if (featureList) contentCell.push(featureList);
    ctas.forEach((cta) => contentCell.push(cta));
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-numbered.js
  function parse3(element, { document }) {
    const number = element.querySelector("p.numeric-stats-lg, .numeric-stats-lg");
    const title = element.querySelector("h3.header-small, h3");
    const description = element.querySelector(".card-text-group .text-default");
    const contentCell = [];
    if (number) contentCell.push(number);
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-numbered", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const image = element.querySelector("img.card-img, img");
    const title = element.querySelector("h3 .header-small, h3 .subhead-small, h3.header-small, h3");
    const subtitle = element.querySelector("h4.subhead-small, h4");
    const description = element.querySelector(".text-sm, .card-text-group > .text-default");
    const ctas = element.querySelectorAll(".card-btn-group a, a.btn");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-award.js
  function parse5(element, { document }) {
    const parentSection = element.closest("section") || element;
    const heading = parentSection.querySelector("h3.header-medium, h3");
    const quote = parentSection.querySelector('h2.vertical-offset-xxl, h2:not([class*="header-"])');
    const badgeImage = parentSection.querySelector('img.responsive-imageET, img[alt*="Awards"], img[alt*="award"]');
    const attribution = parentSection.querySelector(".col-sm-5 .text-default, .col-sm-5 .richTextEditor .text-default");
    const viewAllLink = parentSection.querySelector('a[href*="awards"], a[title*="awards"]');
    const leftCol = [];
    if (heading) leftCol.push(heading);
    if (quote) leftCol.push(quote);
    if (attribution) leftCol.push(attribution);
    if (viewAllLink) leftCol.push(viewAllLink);
    const rightCol = [];
    if (badgeImage) rightCol.push(badgeImage);
    const cells = [[leftCol, rightCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-award", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document }) {
    var _a;
    const parentSection = element.closest("section") || element;
    const image = parentSection.querySelector("img.rounded-corner-image, img.responsive-imageET");
    const eyebrow = parentSection.querySelector("p.eyebrow, .eyebrow");
    const heading = parentSection.querySelector("h2.header-2xl, h2");
    const description = parentSection.querySelector("p.text-default, p:has(span.text-white)");
    const disclaimer = parentSection.querySelector(".col-sm-pull-6 p:last-of-type span.text-white");
    const cta = parentSection.querySelector("a.btn-primary-outline, a.btn");
    const textCol = [];
    if (eyebrow) textCol.push(eyebrow);
    if (heading) textCol.push(heading);
    if (description) textCol.push(description);
    if (disclaimer && disclaimer.textContent.trim() !== ((_a = heading == null ? void 0 : heading.textContent) == null ? void 0 : _a.trim())) {
      const disclaimerP = document.createElement("p");
      disclaimerP.textContent = disclaimer.textContent.trim();
      textCol.push(disclaimerP);
    }
    if (cta) textCol.push(cta);
    const imageCol = [];
    if (image) imageCol.push(image);
    const cells = [[textCol, imageCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse7(element, { document }) {
    const items = element.querySelectorAll("li > .accordion-item-wrapper, li");
    const cells = [];
    items.forEach((item) => {
      const questionEl = item.querySelector(".accordion-trigger__text, .accordion-trigger span:last-child, h4");
      const answerEl = item.querySelector('section[id$="-panel"] > div, .accordion-item > section > div');
      if (questionEl && answerEl) {
        const questionText = questionEl.textContent.trim();
        const questionP = document.createElement("p");
        questionP.textContent = questionText;
        cells.push([questionP, answerEl]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/etrade-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".lip-container",
        ".cq\\:featuredimage",
        "link",
        "noscript"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#mainHeader",
        "footer#mainFooter",
        ".sticky-cta-xf",
        ".skip-navigation",
        "iframe"
      ]);
      element.querySelectorAll("[data-cmp-link-accessibility-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-link-accessibility-enabled");
      });
    }
  }

  // tools/importer/transformers/etrade-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = [...template.sections].reverse();
      for (const section of sections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[sections.length - 1].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-product-detail-page.js
  var parsers = {
    "hero-dark": parse,
    "cards-product": parse2,
    "cards-numbered": parse3,
    "cards-article": parse4,
    "columns-award": parse5,
    "columns-feature": parse6,
    "accordion-faq": parse7
  };
  var PAGE_TEMPLATE = {
    name: "product-detail-page",
    description: "Product detail page with dark hero, feature highlights, benefits grid, promotional offers, awards, education cards, FAQ accordion, and CTA sections",
    urls: [
      "https://us.etrade.com/bank",
      "https://us.etrade.com/bank/premium-savings-account",
      "https://us.etrade.com/bank/max-rate-checking",
      "https://us.etrade.com/bank/checking",
      "https://us.etrade.com/bank/certificate-of-deposit",
      "https://us.etrade.com/bank/line-of-credit"
    ],
    blocks: [
      {
        name: "hero-dark",
        instances: [".componentContainer:first-of-type > section .columncontrol:first-of-type"]
      },
      {
        name: "cards-product",
        instances: [".card-container.super-card-one"]
      },
      {
        name: "cards-numbered",
        instances: [".card-container.pricing-card"]
      },
      {
        name: "cards-article",
        instances: [".card-container.image-card", ".card-container.super-card-two"]
      },
      {
        name: "columns-award",
        instances: ["section:has(img.responsive-imageET[alt*='Awards']) .columncontrol"]
      },
      {
        name: "columns-feature",
        instances: ["section.content-prospect:has(.rounded-corner-image) .columncontrol"]
      },
      {
        name: "accordion-faq",
        instances: [".accordion-section .accordion-group"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        selector: ".componentContainer:first-of-type > section",
        style: "dark",
        blocks: ["hero-dark"],
        defaultContent: []
      },
      {
        id: "product-cards",
        name: "Product Cards Section",
        selector: "section.content-prospect:has(.super-card-one)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".columncontrol:first-of-type .richTextEditor h2", ".columncontrol:first-of-type .richTextEditor .text-default", ".richTextEditor:has(.currentDate)"]
      },
      {
        id: "benefits",
        name: "Benefits Section",
        selector: "section:has(.pricing-card)",
        style: null,
        blocks: ["cards-numbered"],
        defaultContent: [".col-centered-8 h2"]
      },
      {
        id: "limited-offers",
        name: "Limited Time Offers Section",
        selector: "section.content-prospect:has(.image-card)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: ["h2.header-2xl.text-center"]
      },
      {
        id: "awards",
        name: "Awards & Recognition Section",
        selector: "section:has(img.responsive-imageET[alt*='Awards'])",
        style: null,
        blocks: ["columns-award"],
        defaultContent: []
      },
      {
        id: "lending",
        name: "Lending Solutions Section",
        selector: "section.content-prospect:has(.rounded-corner-image)",
        style: "dark",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "education",
        name: "Education & Resources Section",
        selector: "section:has(.super-card-two)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [".richTextEditor .eyebrow", ".richTextEditor .header-3xl"]
      },
      {
        id: "faq",
        name: "FAQ Section",
        selector: "section:has(.accordion-section)",
        style: "light-gray",
        blocks: ["accordion-faq"],
        defaultContent: ["h2.header-3xl.text-center"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Selector failed for block "${blockDef.name}": ${selector}`, e);
        }
      });
    });
    return pageBlocks;
  }
  var import_product_detail_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_product_detail_page_exports);
})();
