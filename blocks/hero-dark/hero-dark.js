export default function decorate(block) {
  // Check for image in first row (picture or img)
  const hasImage = block.querySelector(':scope > div:first-child picture, :scope > div:first-child img');
  if (!hasImage) {
    block.classList.add('no-image');
  }
}
