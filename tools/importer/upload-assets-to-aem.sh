#!/bin/bash
# Upload migrated images to AEM Assets
# Target: /content/dam/morgan-stanley/en/bank/
#
# Usage: AEM_TOKEN="Bearer eyJ..." bash tools/importer/upload-assets-to-aem.sh

AEM_HOST="https://author-p130746-e1275972.adobeaemcloud.com"
DAM_BASE="/content/dam/morgan-stanley/en"
ASSETS_DIR="content/assets"

if [ -z "$AEM_TOKEN" ]; then
  echo "ERROR: Set AEM_TOKEN environment variable first."
  echo 'Usage: AEM_TOKEN="Bearer eyJ..." bash tools/importer/upload-assets-to-aem.sh'
  exit 1
fi

upload_image() {
  local local_path="$1"
  local dam_path="$2"
  local filename=$(basename "$local_path")
  local mime_type

  case "${filename##*.}" in
    jpg|jpeg) mime_type="image/jpeg" ;;
    png) mime_type="image/png" ;;
    gif) mime_type="image/gif" ;;
    svg) mime_type="image/svg+xml" ;;
    webp) mime_type="image/webp" ;;
    *) mime_type="application/octet-stream" ;;
  esac

  echo "Uploading: $filename → $dam_path"

  # Create folder structure first
  local folder_path=$(dirname "$dam_path")
  curl -s -o /dev/null -w "%{http_code}" \
    -X POST "${AEM_HOST}${folder_path}" \
    -H "Authorization: ${AEM_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"class\":\"assetFolder\",\"properties\":{\"title\":\"$(basename $folder_path)\"}}" 2>/dev/null

  # Upload the asset using the Assets HTTP API
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "${AEM_HOST}/api/assets${dam_path#/content/dam}" \
    -H "Authorization: ${AEM_TOKEN}" \
    -H "Content-Type: ${mime_type}" \
    --data-binary "@${local_path}")

  if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    echo "  ✓ Success ($http_code)"
  else
    # Try alternative upload method (direct binary upload)
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
      -X PUT "${AEM_HOST}${dam_path}/jcr:content/renditions/original" \
      -H "Authorization: ${AEM_TOKEN}" \
      -H "Content-Type: ${mime_type}" \
      --data-binary "@${local_path}")

    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
      echo "  ✓ Success via PUT ($http_code)"
    else
      echo "  ✗ Failed ($http_code)"
    fi
  fi
}

echo "=== Uploading images to AEM Assets ==="
echo "Target: ${AEM_HOST}${DAM_BASE}/bank/"
echo ""

# Bank images
upload_image "${ASSETS_DIR}/bank/article-thumbnail-bank-buy-home.jpg" "${DAM_BASE}/bank/article-thumbnail-bank-buy-home.jpg"
upload_image "${ASSETS_DIR}/bank/article-thumbnail-bank-manage-cash.jpg" "${DAM_BASE}/bank/article-thumbnail-bank-manage-cash.jpg"
upload_image "${ASSETS_DIR}/bank/article-thumbnail-bank-supercharge.jpg" "${DAM_BASE}/bank/article-thumbnail-bank-supercharge.jpg"
upload_image "${ASSETS_DIR}/bank/award-thumbnail-bank-buy-side-wsj.png" "${DAM_BASE}/bank/award-thumbnail-bank-buy-side-wsj.png"
upload_image "${ASSETS_DIR}/bank/bank-line-of-credit-device-final.png" "${DAM_BASE}/bank/bank-line-of-credit-device-final.png"
upload_image "${ASSETS_DIR}/bank/premium-savings-account/basic-1up-psa-device.jpeg" "${DAM_BASE}/bank/premium-savings-account/basic-1up-psa-device.jpeg"
upload_image "${ASSETS_DIR}/bank/premium-savings-account/featured-1up-psa-device.jpeg" "${DAM_BASE}/bank/premium-savings-account/featured-1up-psa-device.jpeg"

# Promo images
upload_image "${ASSETS_DIR}/promo/hero-offer-savings-arrows.jpg" "${DAM_BASE}/bank/promo/hero-offer-savings-arrows.jpg"
upload_image "${ASSETS_DIR}/promo/promo-checking-offer.jpg" "${DAM_BASE}/bank/promo/promo-checking-offer.jpg"
upload_image "${ASSETS_DIR}/promo/hero-offer-arrows.jpg" "${DAM_BASE}/bank/promo/hero-offer-arrows.jpg"

# Article images
upload_image "${ASSETS_DIR}/articles/linkedin-sales-solutions.jpg" "${DAM_BASE}/bank/articles/linkedin-sales-solutions.jpg"
upload_image "${ASSETS_DIR}/articles/psa-or-cd-header.jpg" "${DAM_BASE}/bank/articles/psa-or-cd-header.jpg"

# Award images
upload_image "${ASSETS_DIR}/awards/best-checking-account-award-2025.png" "${DAM_BASE}/bank/awards/best-checking-account-award-2025.png"
upload_image "${ASSETS_DIR}/awards/bank-award-GO-Banking-Rate-2025-Award-Card.png" "${DAM_BASE}/bank/awards/bank-award-GO-Banking-Rate-2025-Award-Card.png"

echo ""
echo "=== Upload complete ==="
