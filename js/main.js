// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Safety net: long pages (e.g. project detail with 5 layers + many mermaid
// blocks) put later sections far below the initial viewport; IntersectionObserver
// only triggers when the user scrolls there. Combined with slow external assets
// (e.g. Google Fonts blocked in CN — load event never fires) the late sections
// stay at opacity:0 forever and look "missing". 2.5 s after the script runs,
// force every still-hidden .reveal element to become visible. We bind on a bare
// setTimeout (not window.load) so that even if load never fires, fallback works.
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 2500);

// Nav scroll effect
const nav = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  // Active link (only for pages with hash sections)
  const hashLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (hashLinks.length > 0) {
    const sections = [];
    hashLinks.forEach(a => {
      const id = a.getAttribute('href').replace('#', '');
      if (id && document.getElementById(id)) sections.push(id);
    });
    const scrollPos = window.scrollY + 200;
    hashLinks.forEach(a => a.classList.remove('active'));
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = document.getElementById(sections[i]);
      if (sec && sec.offsetTop <= scrollPos) {
        const link = document.querySelector(`.nav-links a[href="#${sections[i]}"]`);
        if (link) link.classList.add('active');
        break;
      }
    }
  }
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Auto-build table of contents on detail pages (project + publication)
(function buildDetailTOC() {
  const desc = document.querySelector('.detail-desc');
  if (!desc) return;
  const layers = document.querySelectorAll('.project-detail .detail-layer');
  const flatSections = document.querySelectorAll('.project-detail .detail-section');
  if (flatSections.length < 2) return;

  // Build TOC element
  const toc = document.createElement('div');
  toc.className = 'detail-toc reveal';
  toc.id = 'detail-toc';

  const label = document.createElement('div');
  label.className = 'detail-toc-label';
  label.textContent = '目录';
  toc.appendChild(label);

  const list = document.createElement('ol');
  list.className = 'detail-toc-list';

  if (layers.length > 0) {
    // Hierarchical TOC: layers as top-level items, sections as nested
    layers.forEach((layer, li) => {
      const layerTitleEl = layer.querySelector('.detail-layer-title');
      if (!layerTitleEl) return;
      const layerId = layer.id || ('layer-' + (li + 1));
      layer.id = layerId;

      // Extract layer number + name (use the structured spans if present)
      const numEl = layerTitleEl.querySelector('.detail-layer-num');
      const nameEl = layerTitleEl.querySelector('.detail-layer-name');
      const layerLabel = (numEl && nameEl)
        ? (numEl.textContent.trim() + ' ' + nameEl.textContent.trim())
        : layerTitleEl.textContent.trim();

      const layerItem = document.createElement('li');
      layerItem.className = 'toc-layer-item';

      const layerLink = document.createElement('a');
      layerLink.href = '#' + layerId;
      layerLink.textContent = layerLabel;
      layerLink.className = 'detail-toc-link toc-layer-link';
      layerItem.appendChild(layerLink);

      // Sections within this layer
      const innerSections = layer.querySelectorAll('.detail-section');
      if (innerSections.length > 0) {
        const subList = document.createElement('ol');
        subList.className = 'detail-toc-sublist';
        innerSections.forEach((sec, si) => {
          const titleEl = sec.querySelector('.detail-section-title');
          if (!titleEl) return;
          const id = sec.id || ('sec-' + (li + 1) + '-' + (si + 1));
          sec.id = id;

          const subItem = document.createElement('li');
          const subLink = document.createElement('a');
          subLink.href = '#' + id;
          subLink.textContent = titleEl.textContent.trim();
          subLink.className = 'detail-toc-link';
          subItem.appendChild(subLink);
          subList.appendChild(subItem);
        });
        layerItem.appendChild(subList);
      }
      list.appendChild(layerItem);
    });
  } else {
    // Flat TOC fallback (pages without layer wrappers)
    flatSections.forEach((sec, i) => {
      const titleEl = sec.querySelector('.detail-section-title');
      if (!titleEl) return;
      const id = sec.id || ('sec-' + (i + 1));
      sec.id = id;

      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = titleEl.textContent.trim();
      link.className = 'detail-toc-link';
      item.appendChild(link);
      list.appendChild(item);
    });
  }

  toc.appendChild(list);
  desc.parentNode.insertBefore(toc, desc.nextSibling);
  // Observe for reveal animation
  if (typeof observer !== 'undefined') observer.observe(toc);

  // Floating "back to top" button (labelled 返回目录)
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'back-to-toc';
  backBtn.title = '返回目录';
  backBtn.setAttribute('aria-label', '返回目录');
  backBtn.textContent = '返回目录';
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(backBtn);

  // Show button only after scrolling past the TOC
  function checkScroll() {
    const tocBottom = toc.getBoundingClientRect().bottom + window.scrollY;
    if (window.scrollY > tocBottom + 80) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();

// Copy to clipboard function for WeChat ID
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ 已复制';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(() => {
    alert('复制失败，请手动复制：' + text);
  });
}
