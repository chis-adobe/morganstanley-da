function createButton(className, label, html) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.innerHTML = html;
  return button;
}

function decorateSlide(row, idx, total) {
  const slide = document.createElement('li');
  slide.className = 'carousel-article-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${idx + 1} of ${total}`);
  [...row.children].forEach((col) => {
    const isImage = col.children.length === 1 && col.querySelector('picture');
    col.className = isImage ? 'carousel-article-slide-image' : 'carousel-article-slide-body';
    slide.append(col);
  });
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('ul');
  track.className = 'carousel-article-track';
  const slides = rows.map((row, idx) => decorateSlide(row, idx, rows.length));
  track.append(...slides);

  const prev = createButton('carousel-article-prev', 'Previous slide', '<span aria-hidden="true">&#8249;</span>');
  const next = createButton('carousel-article-next', 'Next slide', '<span aria-hidden="true">&#8250;</span>');
  const nav = document.createElement('div');
  nav.className = 'carousel-article-nav';
  nav.append(prev, next);

  const dots = document.createElement('div');
  dots.className = 'carousel-article-dots';
  const dotButtons = slides.map((slide, idx) => {
    const dot = createButton('carousel-article-dot', `Go to slide ${idx + 1}`, '');
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dots.append(dot);
    return dot;
  });

  const step = () => {
    const [first, second] = slides;
    return second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  const update = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const current = Math.round(track.scrollLeft / step());
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
    dotButtons.forEach((dot, idx) => {
      const active = next.disabled ? idx === slides.length - 1 : idx === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
    nav.hidden = maxScroll <= 1;
    dots.hidden = maxScroll <= 1;
  };

  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  new ResizeObserver(update).observe(track);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(nav, track, dots);
  update();
}
