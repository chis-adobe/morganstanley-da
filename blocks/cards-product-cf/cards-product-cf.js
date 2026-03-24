const GQL_ENDPOINT = 'https://publish-p130746-e1275972.adobeaemcloud.com/graphql/execute.json/securbank/AccountOfferByPath;path=';

function getBestSmartCrop(smartCrops, screenWidth) {
  if (!smartCrops || smartCrops.length === 0) return null;
  return smartCrops.reduce((best, crop) => {
    const bestDiff = Math.abs(best.width - screenWidth);
    const cropDiff = Math.abs(crop.width - screenWidth);
    return cropDiff < bestDiff ? crop : best;
  });
}

function cleanDetailsHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('li');
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.textContent.trim();
    ul.append(li);
  });
  return ul;
}

function getSmartCropSrc(baseUrl, smartCrops) {
  const crop = getBestSmartCrop(smartCrops, window.innerWidth);
  const now = new Date();
  const cacheBuster = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return crop ? `${baseUrl}:${crop.name}?ts=${cacheBuster}` : `${baseUrl}?ts=${cacheBuster}`;
}

function buildBannerImage(banner, title) {
  const { _dmS7Url: baseUrl, _smartCrops: smartCrops } = banner;
  if (!baseUrl) return null;

  const img = document.createElement('img');
  img.src = getSmartCropSrc(baseUrl, smartCrops);
  img.alt = title || '';
  img.loading = 'lazy';
  img.dataset.dmUrl = baseUrl;
  img.dataset.smartCrops = JSON.stringify(smartCrops);
  return img;
}

async function fetchContentFragment(cfPath) {
  const ts = Math.floor(Date.now() / 1000);
  const url = `${GQL_ENDPOINT}${cfPath};ts=${ts}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`GraphQL request failed: ${resp.status}`);
  const json = await resp.json();
  return json?.data?.accountOfferByPath?.item;
}

export default async function decorate(block) {
  const cfPath = block.textContent.trim();
  block.textContent = '';

  if (!cfPath) return;

  let item;
  try {
    item = await fetchContentFragment(cfPath);
  } catch (e) {
    block.textContent = 'Failed to load content.';
    return;
  }

  if (!item) {
    block.textContent = 'No content found.';
    return;
  }

  const {
    title, offer, details, ctaLabel, ctaUrl, banner,
  } = item;

  const ul = document.createElement('ul');
  const li = document.createElement('li');

  // First div: title (h3)
  const titleDiv = document.createElement('div');
  titleDiv.className = 'cards-product-cf-card-body';
  const h3 = document.createElement('h3');
  h3.textContent = title || '';
  titleDiv.append(h3);
  li.append(titleDiv);

  // Banner image between title and offer
  if (banner) {
    const img = buildBannerImage(banner, title);
    if (img) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'cards-product-cf-card-image';
      imageDiv.append(img);
      li.append(imageDiv);
    }
  }

  // Second div: offer (h4) + details list + CTA
  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'cards-product-cf-card-body';

  if (offer) {
    const h4 = document.createElement('h4');
    h4.textContent = offer;
    bodyDiv.append(h4);
  }

  if (details?.html) {
    const detailsList = cleanDetailsHtml(details.html);
    bodyDiv.append(detailsList);
  }

  if (ctaLabel && ctaUrl) {
    const a = document.createElement('a');
    a.href = ctaUrl;
    a.textContent = ctaLabel;
    bodyDiv.append(a);
  }

  li.append(bodyDiv);
  ul.append(li);
  block.append(ul);

  const cfImg = block.querySelector('.cards-product-cf-card-image img[data-dm-url]');
  if (cfImg) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const url = cfImg.dataset.dmUrl;
        const crops = JSON.parse(cfImg.dataset.smartCrops || '[]');
        cfImg.src = getSmartCropSrc(url, crops);
      }, 150);
    });
  }
}
