/**
 * Updates image references in content files from CDN URLs to AEM Assets paths.
 * Run after uploading images to AEM Assets.
 *
 * Usage: node tools/importer/update-image-refs.js
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const AEM_DAM_BASE = '/content/dam/morgan-stanley/en';

// Map CDN URLs to AEM Assets DAM paths
const URL_MAP = [
  // Bank images
  ['https://cdn2.etrade.net/1/25102717290.0/aempros/content/dam/etrade/retail/en_US/images/bank/article-thumnail-bank-buy-home.jpg', `${AEM_DAM_BASE}/bank/article-thumbnail-bank-buy-home.jpg`],
  ['https://cdn2.etrade.net/1/25102717290.0/aempros/content/dam/etrade/retail/en_US/images/bank/article-thumnail-bank-manage-cash.jpg', `${AEM_DAM_BASE}/bank/article-thumbnail-bank-manage-cash.jpg`],
  ['https://cdn2.etrade.net/1/25102717290.0/aempros/content/dam/etrade/retail/en_US/images/bank/article-thumnail-bank-supercharge.jpg', `${AEM_DAM_BASE}/bank/article-thumbnail-bank-supercharge.jpg`],
  ['https://cdn2.etrade.net/1/25102717290.0/aempros/content/dam/etrade/retail/en_US/images/bank/award-thumbnail-bank-buy-side-wsj.png', `${AEM_DAM_BASE}/bank/award-thumbnail-bank-buy-side-wsj.png`],
  ['https://cdn2.etrade.net/1/25102815340.0/aempros/content/dam/etrade/retail/en_US/images/bank/bank-line-of-credit-device-final.png', `${AEM_DAM_BASE}/bank/bank-line-of-credit-device-final.png`],
  ['https://cdn2.etrade.net/1/26020309390.0/aempros/content/dam/etrade/retail/en_US/images/bank/premium-savings-account/basic-1up-psa-device.jpeg', `${AEM_DAM_BASE}/bank/premium-savings-account/basic-1up-psa-device.jpeg`],
  ['https://cdn2.etrade.net/1/26020309390.0/aempros/content/dam/etrade/retail/en_US/images/bank/premium-savings-account/featured-1up-psa-device.jpeg', `${AEM_DAM_BASE}/bank/premium-savings-account/featured-1up-psa-device.jpeg`],

  // Promo images
  ['https://cdn2.etrade.net/1/25103011060.0/aempros/content/dam/etrade/retail/en_US/images/test/dpx-testing/hero-offer-savings-arrows.jpg', `${AEM_DAM_BASE}/bank/promo/hero-offer-savings-arrows.jpg`],
  ['https://cdn2.etrade.net/1/25120915320.0/aempros/content/dam/etrade/retail/en_US/images/promo/promo-checking-offer.jpg', `${AEM_DAM_BASE}/bank/promo/promo-checking-offer.jpg`],
  ['https://cdn2.etrade.net/1/25102914270.0/aempros/content/dam/etrade/retail/en_US/images/promo/hero-offer-arrows.jpg', `${AEM_DAM_BASE}/bank/promo/hero-offer-arrows.jpg`],

  // Article images
  ['https://cdn2.etrade.net/1/23092013250.0/aempros/content/dam/etrade/retail/en_US/images/knowledge/library/getting-started/linkedin-sales-solutions.jpg', `${AEM_DAM_BASE}/bank/articles/linkedin-sales-solutions.jpg`],
  ['https://cdn2.etrade.net/1/24112009530.0/aempros/content/dam/etrade/retail/en_US/images/knowledge/library/banking-and-lending/psa-or-cd-header.jpg', `${AEM_DAM_BASE}/bank/articles/psa-or-cd-header.jpg`],

  // Award images (from us.etrade.com domain)
  ['https://us.etrade.com/content/dam/etrade/retail/en_US/images/awards/best-checking-account-award-2025.png', `${AEM_DAM_BASE}/bank/awards/best-checking-account-award-2025.png`],
  ['https://us.etrade.com/content/dam/etrade/retail/en_US/images/bank/bank-award-GO-Banking-Rate-2025-Award-Card.png', `${AEM_DAM_BASE}/bank/awards/bank-award-GO-Banking-Rate-2025-Award-Card.png`],
];

function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  URL_MAP.forEach(([oldUrl, newPath]) => {
    if (content.includes(oldUrl)) {
      content = content.replaceAll(oldUrl, newPath);
      changeCount++;
    }
  });

  if (changeCount > 0) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}: ${changeCount} image reference(s) replaced`);
  }
  return changeCount;
}

function walkDir(dir, ext) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && entry !== 'assets') {
      results.push(...walkDir(fullPath, ext));
    } else if (entry.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Update both .plain.html and .da.html files
const contentDir = 'content';
const htmlFiles = [
  ...walkDir(contentDir, '.plain.html'),
  ...walkDir(contentDir, '.da.html'),
];

console.log(`Found ${htmlFiles.length} content files to update\n`);

let totalChanges = 0;
htmlFiles.forEach((file) => {
  totalChanges += updateFile(file);
});

console.log(`\nDone. ${totalChanges} total replacements across ${htmlFiles.length} files.`);
