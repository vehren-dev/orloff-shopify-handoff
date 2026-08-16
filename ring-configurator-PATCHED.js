/**
 * Orloff Shared Configurator Utilities
 * Single source of truth for logic duplicated across every configurator type below.
 */
window.ORLOFF = window.ORLOFF || {};

window.ORLOFF.hideDefaultElements = function() {
  var sectionId = window.ORLOFF_SECTION_ID;
  var el;
  el = document.querySelector('quantity-selector'); if (el) el.style.display = 'none';
  el = document.getElementById('price-' + sectionId); if (el) el.style.display = 'none';
  el = document.getElementById('variant-selects-' + sectionId); if (el) el.style.display = 'none';
  el = document.querySelector('#product-form-' + sectionId + ' button[name="add"], #product-form-' + sectionId + ' .product-form__submit'); if (el) el.style.display = 'none';
  el = document.querySelector('.quantity__input, .product-form__quantity');
  if (el) {
    var wrap = el.closest('.product-form__input, .quantity');
    if (wrap) wrap.style.display = 'none';
  }
  el = document.querySelector('.shopify-payment-button, .dynamic-checkout'); if (el) el.style.display = 'none';
};

/**
 * Orloff Ring Configurator
 */

(function() {
  'use strict';

  let state = {
    origin: window.ORLOFF_CURRENT_ORIGIN || 'lab',
    metal: '14K Yellow Gold',
    grade: 'Signature - SI1/H',
    carat: '0.5'
  };

  function getKey() {
    return `${state.metal}|${state.grade}|${state.carat}`;
  }

  function getConfigLabel() {
    const originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    const gradeShort = state.grade === 'Prestige - VS1/F' ? 'Prestige VS1/F' : 'Signature SI1/H';
    return `${state.metal} · ${gradeShort} · ${state.carat} ct · ${originLabel}`;
  }

  function updatePrice() {
    const key = getKey();
    const combo = (window.ORLOFF_COMBO_DATA || {})[key];
    const variantMap = window.ORLOFF_VARIANT_MAP || {};

    const priceEl = document.getElementById('rc-price');
    const skuEl = document.getElementById('rc-sku');
    const btn = document.getElementById('rc-add-to-cart');
    const stickyPrice = document.getElementById('rc-sticky-price');
    const stickyConfig = document.getElementById('rc-sticky-config');
    const stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo || !combo[state.origin]) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    const data = combo[state.origin];
    const variantId = variantMap[data.sku];
    const priceFormatted = `$${data.price.toLocaleString('en-US')} USD`;

    if (priceEl) {
      priceEl.innerHTML = `<span class="rc-price-amount">$${data.price.toLocaleString('en-US')}</span><span class="rc-price-currency"> USD</span>`;
    }
    if (skuEl) skuEl.textContent = data.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    const vid = variantId || '';
    const sku = data.sku;
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = sku; }

    const variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage(metal) {
    const metalImages = window.ORLOFF_METAL_IMAGES || {};
    const srcs = metalImages[metal];
    if (!srcs) return;

    const slides = document.querySelectorAll('.product-image-container .product-single__media img');
    slides.forEach((img, i) => {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });

    const carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      const flickitySlides = carousel.querySelectorAll('.product-single__media');
      flickitySlides.forEach((slide, i) => {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }

    const thumbs = document.querySelectorAll('.product-thumbnail-container .product-thumbnail');
    thumbs.forEach((thumb, i) => {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        const img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    sessionStorage.setItem('orloff_grade', state.grade);
    sessionStorage.setItem('orloff_carat', state.carat);
    const sibling = window.ORLOFF_SIBLING_HANDLE;
    if (sibling) window.location.href = `/products/${sibling}`;
  }

  function restoreSelections() {
    const savedMetal = sessionStorage.getItem('orloff_metal');
    const savedGrade = sessionStorage.getItem('orloff_grade');
    const savedCarat = sessionStorage.getItem('orloff_carat');

    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(b => b.classList.toggle('active', b.dataset.metal === savedMetal));
      const label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    if (savedGrade) {
      state.grade = savedGrade;
      document.querySelectorAll('[data-grade]').forEach(b => b.classList.toggle('active', b.dataset.grade === savedGrade));
    }
    if (savedCarat) {
      state.carat = savedCarat;
    }

    sessionStorage.removeItem('orloff_metal');
    sessionStorage.removeItem('orloff_grade');
    sessionStorage.removeItem('orloff_carat');
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    const bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    const title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        bar.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    observer.observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    const sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    const ringSize = sizeEl ? sizeEl.value : '';
    if (!ringSize) { alert('Please select a ring size'); return; }

    btn.disabled = true;
    btn.textContent = 'Adding...';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
        properties: {
          'Metal': state.metal,
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'Diamond Grade': state.grade,
          'Carat Weight': state.carat + ' ct',
          'Ring Size': ringSize,
          'SKU': sku
        }
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.status) {
        alert(data.description || 'Could not add to cart');
        btn.disabled = false;
        btn.textContent = 'Add to cart';
        return;
      }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(r => r.json()).then(cart => {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(el => {
          el.textContent = cart.item_count;
        });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(() => { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function initOriginBtns() {
    document.querySelectorAll('[data-origin]').forEach(btn => {
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });
  }

  function initMetalBtns() {
    document.querySelectorAll('[data-metal]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.metal = this.dataset.metal;
        const label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        buildCaratButtons();
        updateImage(state.metal);
        updatePrice();
      });
    });
  }

  function initGradeBtns() {
    document.querySelectorAll('[data-grade]').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-grade]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.grade = this.dataset.grade;
        buildCaratButtons();
        updatePrice();
      });
    });
  }

  // Carats are built from this specific ring's own combo_data (metal|grade|carat
  // keys), not a fixed shared list -- so a ring only ever shows sizes it
  // actually offers, instead of a phantom button with no real price behind it.
  function getAvailableCarats() {
    const combo = window.ORLOFF_COMBO_DATA || {};
    const carats = [];
    Object.keys(combo).forEach(key => {
      const parts = key.split('|');
      if (parts[0] === state.metal && parts[1] === state.grade && carats.indexOf(parts[2]) === -1) {
        carats.push(parts[2]);
      }
    });
    carats.sort((a, b) => parseFloat(a) - parseFloat(b));
    return carats;
  }

  function buildCaratButtons() {
    const group = document.getElementById('rc-carat-group');
    if (!group) return;
    const carats = getAvailableCarats();
    if (!state.carat || carats.indexOf(state.carat) === -1) state.carat = carats[0];
    group.innerHTML = '';
    carats.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'rc-btn' + (c === state.carat ? ' active' : '');
      btn.type = 'button';
      btn.dataset.carat = c;
      btn.textContent = parseFloat(c).toFixed(2) + ' ct';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-carat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.carat = c;
        updatePrice();
      });
      group.appendChild(btn);
    });
  }

  function initAddToCartBtns() {
    const btn = document.getElementById('rc-add-to-cart');
    if (btn) {
      btn.addEventListener('click', function() {
        addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this);
      });
    }
    const stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', function() {
        addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this);
      });
    }
  }

  function initCarouselLimit() {
    const carousel = document.querySelector('.product-images.carousel');
    if (!carousel) return;
    setTimeout(function() {
      const flkty = window.Flickity ? Flickity.data(carousel) : null;
      if (!flkty) return;
      flkty.on('change', function(index) {
        if (index > 2) flkty.select(0);
        if (index < 0) flkty.select(2);
      });
    }, 800);
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    if (window.ORLOFF_IS_THREESTONE) return;
    if (window.ORLOFF_IS_EARRING_LUNA) return;
    if (window.ORLOFF_IS_EARRING_SIMPLE) return;
    if (window.ORLOFF_IS_EARRING) return;
    if (window.ORLOFF_IS_WB_PLAIN) return;
    if (window.ORLOFF_IS_WB_DIAMOND) return;
    if (window.ORLOFF_IS_MICRO) return;
    if (window.ORLOFF_IS_BRACELET) return;
    if (window.ORLOFF_IS_PENDANT) return;
    restoreSelections();
    hideDefaultElements();
    initOriginBtns();
    initMetalBtns();
    initGradeBtns();
    buildCaratButtons();
    initAddToCartBtns();
    initStickyBar();
    updatePrice();
    updateImage(state.metal);
    initCarouselLimit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/**
 * Orloff Ring Configurator — Threestone
 */

(function() {
  'use strict';

  if (!window.ORLOFF_IS_THREESTONE) return;

  var THREESTONE_CARATS = {
    'mia':      [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'madeline': [
      { center: '0.20', sides: '0.15', total: '0.80', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.30', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.80', key: '1'   }
    ],
    'bianca':   [
      { center: '0.20', sides: '0.10', total: '0.40', key: '0.2' },
      { center: '0.30', sides: '0.15', total: '0.60', key: '0.3' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' }
    ],
    'stella':   [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'serena':   [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'elise':    [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'helena':   [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'hazel':    [
      { center: '0.20', sides: '0.15', total: '0.50', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.00', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.50', key: '1'   }
    ],
    'eleanor':  [
      { center: '0.20', sides: '0.15', total: '0.65', key: '0.2' },
      { center: '0.50', sides: '0.25', total: '1.15', key: '0.5' },
      { center: '1.00', sides: '0.25', total: '1.65', key: '1'   }
    ]
  };

  function getRingName() {
    var handle = (window.ORLOFF_PRODUCT_HANDLE || window.location.pathname.split('/products/')[1] || '').toLowerCase();
    var names = Object.keys(THREESTONE_CARATS);
    for (var i = 0; i < names.length; i++) {
      if (handle.indexOf(names[i]) !== -1) return names[i];
    }
    return null;
  }

  var ringName = getRingName();
  var caratOptions = ringName ? THREESTONE_CARATS[ringName] : [];

  var state = {
    origin: window.ORLOFF_CURRENT_ORIGIN || 'lab',
    metal: '14K Yellow Gold',
    grade: 'Signature - SI1/H',
    carat: caratOptions.length ? caratOptions[0].key : '0.2',
    caratOption: caratOptions.length ? caratOptions[0] : null
  };

  function getKey() {
    return state.metal + '|' + state.grade + '|' + state.carat;
  }

  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    var gradeShort = state.grade === 'Prestige - VS1/F' ? 'Prestige VS1/F' : 'Signature SI1/H';
    var centerLabel = state.caratOption ? state.caratOption.center + ' ct center' : state.carat + ' ct';
    return state.metal + ' · ' + gradeShort + ' · ' + centerLabel + ' · ' + originLabel;
  }

  function getImageKey() {
    var metalKey = state.metal === 'Platinum' ? '14K White Gold' : state.metal;
    var centerCarat = state.caratOption ? state.caratOption.center : state.carat;
    return metalKey + '|' + centerCarat;
  }

  function updateInfoBar() {
    var bar = document.getElementById('rc-ts-infobar');
    if (!bar || !state.caratOption) return;
    var o = state.caratOption;
    bar.textContent = o.center + ' ct center · ' + o.sides + ' ct × 2 side stones · Total ' + o.total + ' ct';
  }

  function updatePrice() {
    var key = getKey();
    var combo = (window.ORLOFF_COMBO_DATA || {})[key];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo || !combo[state.origin]) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var data = combo[state.origin];
    var variantId = variantMap[data.sku];

    // Origin delta on the non-active button
    var otherOrigin = state.origin === 'natural' ? 'lab' : 'natural';
    var otherOriginData = combo[otherOrigin];
    if (otherOriginData) {
      var originDelta = otherOriginData.price - data.price;
      var originDeltaText = originDelta > 0 ? 'USD +' + originDelta : 'USD ' + originDelta;
      document.querySelectorAll('[data-origin]').forEach(function(ob) {
        var deltaEl = ob.querySelector('.rc-origin-delta');
        if (!deltaEl) {
          deltaEl = document.createElement('small');
          deltaEl.className = 'rc-origin-delta';
          deltaEl.style.cssText = 'display:block;font-size:10px;font-style:italic;font-weight:400;opacity:0.75;margin-top:2px;letter-spacing:0.04em;';
          ob.appendChild(deltaEl);
        }
        deltaEl.textContent = ob.dataset.origin === state.origin ? '' : originDeltaText;
      });
    }

    var priceFormatted = '$' + data.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + data.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = data.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = data.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = data.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var imageKey = getImageKey();
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[imageKey];
    if (!srcs) return;

    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });

    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }

    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function buildCaratButtons() {
    var group = document.getElementById('rc-carat-group');
    if (!group || !caratOptions.length) return;
    group.innerHTML = '';
    caratOptions.forEach(function(opt, idx) {
      var btn = document.createElement('button');
      btn.className = 'rc-btn' + (idx === 0 ? ' active' : '');
      btn.type = 'button';
      btn.dataset.caratKey = opt.key;
      btn.innerHTML = opt.center + ' ct<small>Total ' + opt.total + ' ct</small>';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-carat-key]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.carat = opt.key;
        state.caratOption = opt;
        updateInfoBar();
        updateImage();
        updatePrice();
      });
      group.appendChild(btn);
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    sessionStorage.setItem('orloff_grade', state.grade);
    sessionStorage.setItem('orloff_carat', state.carat);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    var savedGrade = sessionStorage.getItem('orloff_grade');
    var savedCarat = sessionStorage.getItem('orloff_carat');

    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    if (savedGrade) {
      state.grade = savedGrade;
      document.querySelectorAll('[data-grade]').forEach(function(b) { b.classList.toggle('active', b.dataset.grade === savedGrade); });
    }
    if (savedCarat) {
      state.carat = savedCarat;
      var matched = caratOptions.filter(function(o) { return o.key === savedCarat; })[0];
      if (matched) state.caratOption = matched;
      document.querySelectorAll('[data-carat-key]').forEach(function(b) { b.classList.toggle('active', b.dataset.caratKey === savedCarat); });
    }

    sessionStorage.removeItem('orloff_metal');
    sessionStorage.removeItem('orloff_grade');
    sessionStorage.removeItem('orloff_carat');
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) { bar.classList.toggle('visible', !entry.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function initCarouselLimit() {
    var carousel = document.querySelector('.product-images.carousel');
    if (!carousel) return;
    setTimeout(function() {
      var flkty = window.Flickity ? Flickity.data(carousel) : null;
      if (!flkty) return;
      flkty.on('change', function(index) {
        if (index > 2) flkty.select(0);
        if (index < 0) flkty.select(2);
      });
    }, 800);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    var ringSize = sizeEl ? (sizeEl.options[sizeEl.selectedIndex] ? sizeEl.options[sizeEl.selectedIndex].value : '') : '';
    if (!ringSize) { alert('Please select a ring size'); return; }

    btn.disabled = true;
    btn.textContent = 'Adding...';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
        properties: {
          'Metal': state.metal,
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'Diamond Grade': state.grade,
          'Center Stone': state.caratOption ? state.caratOption.center + ' ct' : state.carat + ' ct',
          'Total Carat Weight': state.caratOption ? state.caratOption.total + ' ct' : '',
          'Ring Size': ringSize,
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) {
        alert(data.description || 'Could not add to cart');
        btn.disabled = false;
        btn.textContent = 'Add to cart';
        return;
      }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;

    buildCaratButtons();
    restoreSelections();
    hideDefaultElements();

    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });

    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
      });
    });

    document.querySelectorAll('[data-grade]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-grade]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.grade = this.dataset.grade;
        updatePrice();
      });
    });

    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });

    initStickyBar();
    initCarouselLimit();
    updateInfoBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


/**
 * Orloff Earring Configurator — JS additions
 * Append to ring-configurator.js
 *
 * Three earring types:
 * 1. LUNA (ORLOFF_IS_EARRING_LUNA) — metal only
 * 2. Simple (ORLOFF_IS_EARRING_SIMPLE) — origin + metal
 * 3. Full (ORLOFF_IS_EARRING) — origin + metal + grade + carat (ASTRID, FREYA)
 */

// ─── LUNA — Metal only ──────────────────────────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_EARRING_LUNA) return;

  var state = {
    metal: '14K Yellow Gold'
  };

  function getKey() { return state.metal; }

  function getConfigLabel() { return state.metal; }

  function updatePrice() {
    var combo = (window.ORLOFF_COMBO_DATA || {})[state.metal];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var variantId = variantMap[combo.sku];
    var priceFormatted = '$' + combo.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + combo.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = combo.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = combo.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = combo.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[state.metal];
    if (!srcs) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1, properties: { 'Metal': state.metal, 'SKU': sku } })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    hideDefaultElements();
    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
      });
    });
    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    initStickyBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── SIMPLE EARRINGS — Origin + Metal ──────────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_EARRING_SIMPLE) return;

  var state = {
    origin: window.ORLOFF_CURRENT_ORIGIN || 'lab',
    metal: '14K Yellow Gold'
  };

  function getKey() { return state.metal; }
  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    return state.metal + ' · ' + originLabel;
  }

  function updatePrice() {
    var combo = (window.ORLOFF_COMBO_DATA || {})[state.metal];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo || !combo[state.origin]) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var data = combo[state.origin];
    var variantId = variantMap[data.sku];

    // Origin delta on the non-active button
    var otherOrigin = state.origin === 'natural' ? 'lab' : 'natural';
    var otherOriginData = combo[otherOrigin];
    if (otherOriginData) {
      var originDelta = otherOriginData.price - data.price;
      var originDeltaText = originDelta > 0 ? 'USD +' + originDelta : 'USD ' + originDelta;
      document.querySelectorAll('[data-origin]').forEach(function(ob) {
        var deltaEl = ob.querySelector('.rc-origin-delta');
        if (!deltaEl) {
          deltaEl = document.createElement('small');
          deltaEl.className = 'rc-origin-delta';
          deltaEl.style.cssText = 'display:block;font-size:10px;font-style:italic;font-weight:400;opacity:0.75;margin-top:2px;letter-spacing:0.04em;';
          ob.appendChild(deltaEl);
        }
        deltaEl.textContent = ob.dataset.origin === state.origin ? '' : originDeltaText;
      });
    }

    var priceFormatted = '$' + data.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + data.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = data.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = data.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = data.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[state.metal];
    if (!srcs) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId, quantity: 1,
        properties: {
          'Metal': state.metal,
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    sessionStorage.removeItem('orloff_metal');
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    restoreSelections();
    hideDefaultElements();
    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });
    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
      });
    });
    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    initStickyBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── FULL EARRING — Origin + Metal + Grade + Carat (ASTRID, FREYA) ─────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_EARRING) return;

  var EARRING_CARATS = {
    'astrid': [
      { value: '0.05', key: '0.05' },
      { value: '0.10', key: '0.1'  },
      { value: '0.25', key: '0.25' },
      { value: '0.50', key: '0.5'  },
      { value: '1.00', key: '1'    },
      { value: '2.00', key: '2'    }
    ],
    'freya': [
      { value: '0.05', key: '0.05' },
      { value: '0.10', key: '0.1'  },
      { value: '0.25', key: '0.25' },
      { value: '0.50', key: '0.5'  },
      { value: '1.00', key: '1'    },
      { value: '2.00', key: '2'    }
    ]
  };

  function getEarringName() {
    var handle = (window.ORLOFF_PRODUCT_HANDLE || window.location.pathname.split('/products/')[1] || '').toLowerCase();
    var names = Object.keys(EARRING_CARATS);
    for (var i = 0; i < names.length; i++) {
      if (handle.indexOf(names[i]) !== -1) return names[i];
    }
    return null;
  }

  var earringName = getEarringName();
  var caratOptions = earringName ? EARRING_CARATS[earringName] : [];

  var state = {
    origin: window.ORLOFF_CURRENT_ORIGIN || 'lab',
    metal: '14K Yellow Gold',
    grade: 'Signature - SI1/H',
    carat: caratOptions.length ? caratOptions[0].key : '0.05'
  };

  function getKey() { return state.metal + '|' + state.grade + '|' + state.carat; }

  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    var gradeShort = state.grade === 'Prestige - VS1/F' ? 'Prestige VS1/F' : 'Signature SI1/H';
    return state.metal + ' · ' + gradeShort + ' · ' + state.carat + ' ct · ' + originLabel;
  }

  function updatePrice() {
    var key = getKey();
    var combo = (window.ORLOFF_COMBO_DATA || {})[key];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo || !combo[state.origin]) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var data = combo[state.origin];
    var variantId = variantMap[data.sku];

    // Origin delta on the non-active button
    var otherOrigin = state.origin === 'natural' ? 'lab' : 'natural';
    var otherOriginData = combo[otherOrigin];
    if (otherOriginData) {
      var originDelta = otherOriginData.price - data.price;
      var originDeltaText = originDelta > 0 ? 'USD +' + originDelta : 'USD ' + originDelta;
      document.querySelectorAll('[data-origin]').forEach(function(ob) {
        var deltaEl = ob.querySelector('.rc-origin-delta');
        if (!deltaEl) {
          deltaEl = document.createElement('small');
          deltaEl.className = 'rc-origin-delta';
          deltaEl.style.cssText = 'display:block;font-size:10px;font-style:italic;font-weight:400;opacity:0.75;margin-top:2px;letter-spacing:0.04em;';
          ob.appendChild(deltaEl);
        }
        deltaEl.textContent = ob.dataset.origin === state.origin ? '' : originDeltaText;
      });
    }

    var priceFormatted = '$' + data.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + data.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = data.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = data.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = data.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var metalKey = state.metal === 'Platinum' ? '14K White Gold' : state.metal;
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[metalKey];
    if (!srcs) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function buildCaratButtons() {
    var group = document.getElementById('rc-carat-group');
    if (!group || !caratOptions.length) return;
    group.innerHTML = '';
    caratOptions.forEach(function(opt, idx) {
      var btn = document.createElement('button');
      btn.className = 'rc-btn' + (idx === 0 ? ' active' : '');
      btn.type = 'button';
      btn.dataset.caratKey = opt.key;
      btn.textContent = opt.value + ' ct';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-carat-key]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.carat = opt.key;
        updatePrice();
      });
      group.appendChild(btn);
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    sessionStorage.setItem('orloff_grade', state.grade);
    sessionStorage.setItem('orloff_carat', state.carat);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    var savedGrade = sessionStorage.getItem('orloff_grade');
    var savedCarat = sessionStorage.getItem('orloff_carat');
    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    if (savedGrade) {
      state.grade = savedGrade;
      document.querySelectorAll('[data-grade]').forEach(function(b) { b.classList.toggle('active', b.dataset.grade === savedGrade); });
    }
    if (savedCarat) {
      state.carat = savedCarat;
      document.querySelectorAll('[data-carat-key]').forEach(function(b) { b.classList.toggle('active', b.dataset.caratKey === savedCarat); });
    }
    sessionStorage.removeItem('orloff_metal');
    sessionStorage.removeItem('orloff_grade');
    sessionStorage.removeItem('orloff_carat');
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId, quantity: 1,
        properties: {
          'Metal': state.metal,
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'Diamond Grade': state.grade,
          'Carat Weight': state.carat + ' ct',
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    buildCaratButtons();
    restoreSelections();
    hideDefaultElements();
    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });
    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
      });
    });
    document.querySelectorAll('[data-grade]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-grade]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.grade = this.dataset.grade;
        updatePrice();
      });
    });
    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    initStickyBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── WEDDING BAND PLAIN — Metal + Width ─────────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_WB_PLAIN) return;

  var WB_WIDTHS = {
    'maria':   [3, 4, 5],
    'stina':   [2, 3, 4],
    'vincent': [3, 4, 5, 6, 7, 8],
    'karl':    [3, 4, 5, 6, 7, 8],
    'axel':    [3, 4, 5, 6, 7, 8],
    'simon':   [3, 4, 5, 6, 7, 8],
    'leon':    [3, 4, 5, 6, 7, 8],
    'erik':    [3, 4, 5, 6, 7, 8],
    'markus':  [3, 4, 5, 6, 7, 8],
    'caesar':  [3, 4, 5, 6, 7, 8],
  };

  function getRingName() {
    var handle = (window.ORLOFF_PRODUCT_HANDLE || window.location.pathname.split('/products/')[1] || '').toLowerCase();
    var names = Object.keys(WB_WIDTHS);
    for (var i = 0; i < names.length; i++) {
      if (handle.indexOf(names[i]) !== -1) return names[i];
    }
    return null;
  }

  var ringName = getRingName();
  var widths = ringName ? WB_WIDTHS[ringName] : [];

  var state = {
    metal: '14K Yellow Gold',
    width: widths.length ? widths[0] : 3
  };

  function getKey() { return state.metal + '|' + state.width + 'mm'; }

  function getConfigLabel() { return state.metal + ' · ' + state.width + 'mm'; }

  function updatePrice() {
    var key = getKey();
    var combo = (window.ORLOFF_COMBO_DATA || {})[key];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var variantId = variantMap[combo.sku];
    var priceFormatted = '$' + combo.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + combo.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = combo.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = combo.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = combo.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var metalKey = state.metal === 'Platinum' ? '14K White Gold' : state.metal;
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[metalKey];
    if (!srcs) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function getWidthEntry(w) {
    return (window.ORLOFF_COMBO_DATA || {})[state.metal + '|' + parseInt(w) + 'mm'];
  }

  function renderWidthDeltas() {
    var activeEntry = getWidthEntry(state.width);
    var activePrice = activeEntry ? activeEntry.price : 0;
    widths.forEach(function(w) {
      var btn = document.querySelector('[data-width="' + w + '"]');
      if (!btn) return;
      var deltaEl = btn.querySelector('.wbc-delta');
      if (!deltaEl) return;
      if (w == state.width) {
        deltaEl.innerHTML = '&nbsp;';
        return;
      }
      var entry = getWidthEntry(w);
      var delta = entry ? entry.price - activePrice : 0;
      deltaEl.innerHTML = delta > 0 ? 'USD +' + delta : delta < 0 ? 'USD ' + delta : '&nbsp;';
    });
  }

  function buildWidthButtons() {
    var group = document.getElementById('rc-width-group');
    if (!group || !widths.length) return;
    group.innerHTML = '';
    var FIXED_H = 56;
    var SVG_W = 36;
    widths.forEach(function(w, idx) {
      var btn = document.createElement('button');
      btn.className = 'wbc-btn' + (w === state.width ? ' active' : '');
      btn.type = 'button';
      btn.dataset.width = w;
      var thickness = 4 + w * 3;
      var rx = Math.min(thickness / 2, 5);
      var x = (SVG_W - thickness) / 2;
      btn.innerHTML =
        '<svg width="' + SVG_W + '" height="' + FIXED_H + '" viewBox="0 0 ' + SVG_W + ' ' + FIXED_H + '" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="' + x + '" y="0" width="' + thickness + '" height="' + FIXED_H + '" rx="' + rx + '" ry="' + rx + '" fill="none" stroke="' + (w === state.width ? '#fff' : '#091b36') + '" stroke-width="1.5"/>' +
        '</svg>' +
        '<span class="wbc-mm">' + w + '.0 MM</span>' +
        '<span class="wbc-delta">&nbsp;</span>';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-width]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        group.querySelectorAll('svg rect').forEach(function(r) { r.setAttribute('stroke', '#091b36'); });
        btn.querySelector('svg rect').setAttribute('stroke', '#fff');
        state.width = w;
        updatePrice();
        renderWidthDeltas();
      });
      group.appendChild(btn);
    });
    renderWidthDeltas();
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function getDefaultVariantId() {
    var map = window.ORLOFF_VARIANT_MAP || {};
    var keys = Object.keys(map);
    return keys.length ? map[keys[0]] : null;
  }

  function addToCart(variantId, sku, btn) {
    var vid = variantId || getDefaultVariantId();
    if (!vid) { alert('Please make a selection'); return; }
    var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    var ringSize = sizeEl ? (sizeEl.options[sizeEl.selectedIndex] ? sizeEl.options[sizeEl.selectedIndex].value : '') : '';
    if (!ringSize) { alert('Please select a ring size'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: vid, quantity: 1,
        properties: { 'Metal': state.metal, 'Band Width': state.width + 'mm', 'Ring Size': ringSize, 'SKU': sku }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    buildWidthButtons();
    hideDefaultElements();
    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
        setTimeout(function() { renderWidthDeltas(); }, 0);
      });
    });
    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    initStickyBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── WEDDING BAND DIAMOND — Origin + Metal ───────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_WB_DIAMOND) return;

  var state = {
    origin: window.ORLOFF_CURRENT_ORIGIN || 'lab',
    metal: '14K Yellow Gold'
  };

  function getKey() { return state.metal; }
  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    return state.metal + ' · ' + originLabel;
  }

  function updatePrice() {
    var combo = (window.ORLOFF_COMBO_DATA || {})[state.metal];
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!combo || !combo[state.origin]) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">—</span>';
      return;
    }

    var data = combo[state.origin];
    var variantId = variantMap[data.sku];

    // Origin delta on the non-active button
    var otherOrigin = state.origin === 'natural' ? 'lab' : 'natural';
    var otherData = combo[otherOrigin];
    if (otherData) {
      var delta = otherData.price - data.price;
      var deltaText = delta > 0 ? 'USD +' + delta : 'USD ' + delta;
      document.querySelectorAll('[data-origin]').forEach(function(ob) {
        var deltaEl = ob.querySelector('.rc-origin-delta');
        if (!deltaEl) {
          deltaEl = document.createElement('small');
          deltaEl.className = 'rc-origin-delta';
          deltaEl.style.cssText = 'display:block;font-size:10px;font-style:italic;font-weight:400;opacity:0.75;margin-top:2px;letter-spacing:0.04em;';
          ob.appendChild(deltaEl);
        }
        deltaEl.textContent = ob.dataset.origin === state.origin ? '' : deltaText;
      });
    }

    var priceFormatted = '$' + data.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + data.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = data.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = data.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = data.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var metalKey = state.metal === 'Platinum' ? '14K White Gold' : state.metal;
    var srcs = (window.ORLOFF_METAL_IMAGES || {})[metalKey];
    if (!srcs) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < 3) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < 3 ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < 3 ? '' : 'none';
      if (i < 3) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    sessionStorage.removeItem('orloff_metal');
  }

  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    var vid = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!vid) { alert('Please make a selection'); return; }
    var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    var ringSize = sizeEl ? (sizeEl.options[sizeEl.selectedIndex] ? sizeEl.options[sizeEl.selectedIndex].value : '') : '';
    if (!ringSize) { alert('Please select a ring size'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: vid, quantity: 1,
        properties: {
          'Metal': state.metal,
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'Ring Size': ringSize,
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    restoreSelections();
    hideDefaultElements();
    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });
    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        updateImage();
        updatePrice();
      });
    });
    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    initStickyBar();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── MICRO ETERNITY BAND ────────────────────────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_MICRO) return;

  var MAX_BANDS = 5;
  var BASE_PRICE = 2900;
  var TIER_DISCOUNT = { 1: 0, 2: 200, 3: 400 }; // fixed $ off per band — must match Shopify automatic discounts exactly

  function uid() { return 'b' + Math.random().toString(36).slice(2, 9); }

  var STORAGE_KEY = 'orloff_micro_config';

  function saveState() {
    try {
      var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        bands: state.bands,
        ringSize: sizeEl ? sizeEl.value : ''
      }));
    } catch (e) { /* localStorage unavailable — fail silently, selections just won't persist */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.bands) || !parsed.bands.length) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  var state = {
    bands: [],
    editingId: null,       // null = staging mode (swatch picks don't touch existing bands)
    selectedStone: 'Diamond' // the currently highlighted swatch — used when "+" is pressed
  };

  function getEditingBand() {
    if (!state.editingId) return null;
    return state.bands.filter(function(b) { return b.id === state.editingId; })[0] || null;
  }

  function getTierPrice(qty) {
    var key = Math.min(qty, 3);
    var discount = TIER_DISCOUNT[key] || 0;
    return BASE_PRICE - discount;
  }

  function isMixed() {
    if (!state.bands.length) return false;
    var first = state.bands[0].stone;
    return state.bands.some(function(b) { return b.stone !== first; });
  }

  function updatePrice() {
    var qty = state.bands.length;
    var totalEl = document.getElementById('micro-price-total');
    var perEl = document.getElementById('micro-price-per');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var atcBtn = document.getElementById('rc-add-to-cart');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    // Add to cart stays gated on the real band count — but the price display always
    // shows a normal figure (as if 1 band), never a dash/placeholder.
    if (atcBtn) atcBtn.disabled = (qty === 0);
    if (stickyBtn) stickyBtn.disabled = (qty === 0);

    var displayQty = qty || 1;
    var perBand = getTierPrice(displayQty);
    var total = perBand * displayQty;

    if (totalEl) totalEl.textContent = '$' + total.toLocaleString('en-US') + ' USD';
    if (perEl) {
      if (qty === 0) {
        perEl.textContent = '$' + perBand.toLocaleString('en-US') + ' ea. · Select a band to continue';
      } else {
        var bandWord = qty === 1 ? 'band' : 'bands';
        var mixedNote = qty > 1 && isMixed() ? ' · Mixed' : '';
        perEl.textContent = '$' + perBand.toLocaleString('en-US') + ' ea. · ' + qty + ' ' + bandWord + mixedNote;
      }
    }
    if (stickyPrice) stickyPrice.textContent = '$' + total.toLocaleString('en-US') + ' USD';
    if (stickyConfig) {
      stickyConfig.textContent = qty === 0
        ? 'Select a band to continue'
        : qty + (qty === 1 ? ' band' : ' bands') + ' · 950 Platinum' + (isMixed() ? ' · Mixed' : '');
    }
  }

  function updateImage() {
    var stoneImages = (window.ORLOFF_MICRO_IMAGES || {})[state.selectedStone] || [];
    var allImages = (window.ORLOFF_MICRO_IMAGES || {})['ALL'] || [];
    var images = stoneImages.concat(allImages);
    if (!images.length) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < images.length) { img.src = images[i]; img.srcset = images[i]; var a = img.closest('a'); if (a) a.href = images[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < images.length ? '' : 'none';
      });
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < images.length ? '' : 'none';
      if (i < images.length) {
        var img = thumb.querySelector('img');
        if (img) { img.src = images[i]; img.srcset = images[i]; }
      }
    });
  }

  function updateStoneLabel() {
    var label = document.getElementById('micro-stone-label');
    if (label) label.textContent = '— ' + state.selectedStone;
  }

  function stoneSwatchSrc(stone) {
    var btn = document.querySelector('.micro-swatch[data-stone="' + stone + '"] img');
    return btn ? btn.getAttribute('src') : '';
  }

  function bandSlotImageSrc(stone) {
    var imgSet = (window.ORLOFF_MICRO_IMAGES || {})[stone] || [];
    // "Image 1" = index 0. Falls back to the flat swatch icon if no product images exist.
    if (imgSet.length > 0) return imgSet[0];
    return stoneSwatchSrc(stone);
  }

  function syncSwatchActiveState() {
    document.querySelectorAll('.micro-swatch').forEach(function(b) {
      b.classList.toggle('active', b.dataset.stone === state.selectedStone);
    });
  }

  function renderBandSlots() {
    var wrap = document.getElementById('micro-band-slots');
    var countLabel = document.getElementById('micro-band-count-label');
    if (!wrap) return;
    wrap.innerHTML = '';

    state.bands.forEach(function(band) {
      var slot = document.createElement('div');
      slot.className = 'micro-band-slot' + (band.id === state.editingId ? ' active' : '');
      slot.dataset.bandId = band.id;

      var img = document.createElement('img');
      img.src = bandSlotImageSrc(band.stone);
      img.alt = band.stone;
      slot.appendChild(img);

      // Editing an existing band's color is disabled — too easy to misread as a no-op click for
      // customers. To change a color, remove the band (×) and add a new one via the swatches + button.

      if (state.bands.length > 0) {
        var removeBtn = document.createElement('button');
        removeBtn.className = 'micro-band-slot__remove';
        removeBtn.type = 'button';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          state.bands = state.bands.filter(function(b) { return b.id !== band.id; });
          if (state.editingId === band.id) state.editingId = null;
          renderBandSlots();
          updatePrice();
          saveState();
        });
        slot.appendChild(removeBtn);
      }

      wrap.appendChild(slot);
    });

    if (state.bands.length < MAX_BANDS) {
      var addBtn = document.createElement('button');
      addBtn.className = 'micro-band-slot micro-band-slot--add';
      addBtn.type = 'button';
      addBtn.innerHTML = '+';
      addBtn.title = 'Add band';
      addBtn.addEventListener('click', function() {
        var newBand = { id: uid(), stone: state.selectedStone };
        state.bands.push(newBand);
        state.editingId = null; // back to staging — next swatch pick won't touch this new band
        renderBandSlots();
        updatePrice();
        saveState();
      });
      wrap.appendChild(addBtn);
    }

    if (countLabel) {
      var n = state.bands.length;
      countLabel.textContent = n === 0 ? '— Select a Band' : '— ' + n + (n === 1 ? ' Band' : ' Bands');
    }
  }

  function addToCart(variantId, sku, btn) {
    if (state.bands.length === 0) { alert('Please select at least one band'); return; }
    var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    var ringSize = sizeEl ? (sizeEl.options[sizeEl.selectedIndex] ? sizeEl.options[sizeEl.selectedIndex].value : '') : '';
    if (!ringSize) { alert('Please select a ring size'); return; }

    var STONE_SKU = {
      'Diamond': 'MICRO-DIA',
      'Ruby': 'MICRO-RUB',
      'Dark Blue Sapphire': 'MICRO-BLSAP',
      'Light Blue Sapphire': 'MICRO-LBSAP',
      'Yellow Sapphire': 'MICRO-YSAP',
      'Pink Sapphire': 'MICRO-PISAP',
      'Tsavorite': 'MICRO-TSA'
    };
    var vMap = window.ORLOFF_VARIANT_MAP || {};
    var unresolved = state.bands.filter(function(b) { return !vMap[STONE_SKU[b.stone]]; });
    if (unresolved.length) { alert('One or more selected gemstones are unavailable right now. Please refresh the page and try again.'); return; }

    var qty = state.bands.length;
    var perBand = getTierPrice(qty);

    var items = state.bands.map(function(band) {
      var bandSku = STONE_SKU[band.stone];
      var bandVariantId = vMap[bandSku];
      var imgSet = (window.ORLOFF_MICRO_IMAGES || {})[band.stone] || [];
      var bandImage = imgSet.length ? imgSet[0] : stoneSwatchSrc(band.stone);
      return {
        id: bandVariantId,
        quantity: 1,
        properties: {
          'Gemstone': band.stone,
          'Metal': '950 Platinum',
          'Ring Size': ringSize,
          'Price Per Band': '$' + perBand,
          'Set Size': qty + (qty === 1 ? ' Band' : ' Bands'),
          'SKU': bandSku,
          '_Image': bandImage
        }
      };
    });

    btn.disabled = true;
    btn.textContent = 'Adding...';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }
  function hideDefaultElements() {
    window.ORLOFF.hideDefaultElements();
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);

    var footer = document.querySelector('footer, .footer, #shopify-section-footer');
    if (!footer) return;
    function updateStickyPosition() {
      var footerRect = footer.getBoundingClientRect();
      var overlap = window.innerHeight - footerRect.top;
      var lift = overlap > 0 ? overlap : 0;
      bar.style.setProperty('--rc-footer-lift', lift + 'px');
    }
    window.addEventListener('scroll', updateStickyPosition, { passive: true });
    window.addEventListener('resize', updateStickyPosition);
    updateStickyPosition();
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    hideDefaultElements();

    var saved = loadState();
    if (saved) {
      state.bands = saved.bands;
      state.selectedStone = saved.bands[0].stone;
    }

    renderBandSlots();
    syncSwatchActiveState();

    var sizeEl = document.querySelector('select[name="properties[Ring Size]"]');
    if (sizeEl) {
      if (saved && saved.ringSize) sizeEl.value = saved.ringSize;
      sizeEl.addEventListener('change', saveState);
    }

    document.querySelectorAll('.micro-swatch').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.selectedStone = btn.dataset.stone;
        var editing = getEditingBand();
        if (editing) editing.stone = state.selectedStone;
        syncSwatchActiveState();
        renderBandSlots();
        updateStoneLabel();
        updateImage();
        if (editing) { updatePrice(); saveState(); }
      });
    });

    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });

    updateStoneLabel();
    updatePrice();
    updateImage();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── CHRISTINE BRACELET — Metal + Carat Weight ──────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_BRACELET) return;

  var state = {
    metal: '14K Yellow Gold',
    carat: null,
    origin: window.ORLOFF_CURRENT_ORIGIN || 'natural'
  };

  function getEntry() {
    var combo = window.ORLOFF_COMBO_DATA || {};
    var group = combo[state.metal + '|' + state.carat];
    return group ? group[state.origin] : null;
  }

  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    return state.metal + ' \u00b7 ' + state.carat + ' ct \u00b7 ' + originLabel;
  }

  function getAvailableCarats() {
    var combo = window.ORLOFF_COMBO_DATA || {};
    var carats = [];
    Object.keys(combo).forEach(function(key) {
      var parts = key.split('|');
      if (parts[0] === state.metal && carats.indexOf(parts[1]) === -1) carats.push(parts[1]);
    });
    carats.sort(function(a, b) { return parseFloat(a) - parseFloat(b); });
    return carats;
  }

  function buildCaratButtons() {
    var group = document.getElementById('rc-carat-group');
    if (!group) return;
    var carats = getAvailableCarats();
    if (!state.carat || carats.indexOf(state.carat) === -1) state.carat = carats[0];
    group.innerHTML = '';
    carats.forEach(function(c) {
      var btn = document.createElement('button');
      btn.className = 'rc-btn' + (c === state.carat ? ' active' : '');
      btn.type = 'button';
      btn.dataset.carat = c;
      btn.textContent = c + ' ct';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-carat]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.carat = c;
        updateImage();
        updatePrice();
      });
      group.appendChild(btn);
    });
  }

  function updatePrice() {
    var entry = getEntry();
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!entry) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">\u2014</span>';
      return;
    }

    var variantId = variantMap[entry.sku];
    var priceFormatted = '$' + entry.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + entry.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = entry.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = entry.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = entry.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var metalImgs = (window.ORLOFF_METAL_IMAGES || {})[state.metal] || {};
    var srcs = metalImgs[state.carat];
    if (!srcs || !srcs.length) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < srcs.length) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < srcs.length ? '' : 'none';
      });
      var flkty = window.Flickity ? Flickity.data(carousel) : null;
      if (flkty) flkty.select(0, false, true);
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < srcs.length ? '' : 'none';
      if (i < srcs.length) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    sessionStorage.setItem('orloff_carat', state.carat);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    var savedCarat = sessionStorage.getItem('orloff_carat');
    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    if (savedCarat) state.carat = savedCarat;
    sessionStorage.removeItem('orloff_metal');
    sessionStorage.removeItem('orloff_carat');
  }

  function hideDefaultElements() {
    var sectionId = window.ORLOFF_SECTION_ID;
    var el;
    el = document.querySelector('quantity-selector'); if (el) el.style.display = 'none';
    el = document.getElementById('price-' + sectionId); if (el) el.style.display = 'none';
    el = document.getElementById('variant-selects-' + sectionId); if (el) el.style.display = 'none';
    el = document.querySelector('#product-form-' + sectionId + ' button[name="add"]'); if (el) el.style.display = 'none';
    el = document.querySelector('.shopify-payment-button, .dynamic-checkout'); if (el) el.style.display = 'none';
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId, quantity: 1,
        properties: {
          'Metal': state.metal,
          'Total Carat Weight': state.carat + ' ct',
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    hideDefaultElements();
    restoreSelections();
    buildCaratButtons();

    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.origin === state.origin);
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });

    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        buildCaratButtons();
        updateImage();
        updatePrice();
      });
    });

    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });

    initStickyBar();
    updateImage();
    updatePrice();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

// ─── GLOW PENDANT — Metal + Carat Weight ────────────────────────────────────
(function() {
  'use strict';
  if (!window.ORLOFF_IS_PENDANT) return;

  var state = {
    metal: '14K Yellow Gold',
    carat: null,
    origin: window.ORLOFF_CURRENT_ORIGIN || 'natural'
  };

  function getEntry() {
    var combo = window.ORLOFF_COMBO_DATA || {};
    var group = combo[state.metal + '|' + state.carat];
    return group ? group[state.origin] : null;
  }

  function getConfigLabel() {
    var originLabel = state.origin === 'lab' ? 'Lab Grown' : 'Natural';
    return state.metal + ' \u00b7 ' + state.carat + ' ct \u00b7 ' + originLabel;
  }

  function getAvailableCarats() {
    var combo = window.ORLOFF_COMBO_DATA || {};
    var carats = [];
    Object.keys(combo).forEach(function(key) {
      var parts = key.split('|');
      if (parts[0] === state.metal && carats.indexOf(parts[1]) === -1) carats.push(parts[1]);
    });
    carats.sort(function(a, b) { return parseFloat(a) - parseFloat(b); });
    return carats;
  }

  function buildCaratButtons() {
    var group = document.getElementById('rc-carat-group');
    if (!group) return;
    var carats = getAvailableCarats();
    if (!state.carat || carats.indexOf(state.carat) === -1) state.carat = carats[0];
    group.innerHTML = '';
    carats.forEach(function(c) {
      var btn = document.createElement('button');
      btn.className = 'rc-btn' + (c === state.carat ? ' active' : '');
      btn.type = 'button';
      btn.dataset.carat = c;
      btn.textContent = c + ' ct';
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-carat]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.carat = c;
        updateImage();
        updatePrice();
      });
      group.appendChild(btn);
    });
  }

  function updatePrice() {
    var entry = getEntry();
    var variantMap = window.ORLOFF_VARIANT_MAP || {};
    var priceEl = document.getElementById('rc-price');
    var skuEl = document.getElementById('rc-sku');
    var btn = document.getElementById('rc-add-to-cart');
    var stickyPrice = document.getElementById('rc-sticky-price');
    var stickyConfig = document.getElementById('rc-sticky-config');
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');

    if (!entry) {
      if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">\u2014</span>';
      return;
    }

    var variantId = variantMap[entry.sku];
    var priceFormatted = '$' + entry.price.toLocaleString('en-US') + ' USD';

    if (priceEl) priceEl.innerHTML = '<span class="rc-price-amount">$' + entry.price.toLocaleString('en-US') + '</span><span class="rc-price-currency"> USD</span>';
    if (skuEl) skuEl.textContent = entry.sku;
    if (stickyPrice) stickyPrice.textContent = priceFormatted;
    if (stickyConfig) stickyConfig.textContent = getConfigLabel();

    var vid = variantId || '';
    if (btn) { btn.dataset.variantId = vid; btn.dataset.sku = entry.sku; }
    if (stickyBtn) { stickyBtn.dataset.variantId = vid; stickyBtn.dataset.sku = entry.sku; }

    var variantInput = document.querySelector('.js-product-variant-id-input, input[name="id"]');
    if (variantInput && variantId) variantInput.value = variantId;
  }

  function updateImage() {
    var metalImgs = (window.ORLOFF_METAL_IMAGES || {})[state.metal] || {};
    var srcs = metalImgs[state.carat];
    if (!srcs || !srcs.length) return;
    document.querySelectorAll('.product-image-container .product-single__media img').forEach(function(img, i) {
      if (i < srcs.length) { img.src = srcs[i]; img.srcset = srcs[i]; var a = img.closest('a'); if (a) a.href = srcs[i]; }
    });
    var carousel = document.querySelector('.product-images.carousel');
    if (carousel) {
      carousel.querySelectorAll('.product-single__media').forEach(function(slide, i) {
        slide.style.display = i < srcs.length ? '' : 'none';
      });
      var flkty = window.Flickity ? Flickity.data(carousel) : null;
      if (flkty) flkty.select(0, false, true);
    }
    document.querySelectorAll('.product-thumbnail-container .product-thumbnail').forEach(function(thumb, i) {
      thumb.style.display = i < srcs.length ? '' : 'none';
      if (i < srcs.length) {
        var img = thumb.querySelector('img');
        if (img) { img.src = srcs[i]; img.srcset = srcs[i]; }
      }
    });
  }

  function switchOrigin(newOrigin) {
    if (newOrigin === state.origin) return;
    sessionStorage.setItem('orloff_metal', state.metal);
    sessionStorage.setItem('orloff_carat', state.carat);
    if (window.ORLOFF_SIBLING_HANDLE) window.location.href = '/products/' + window.ORLOFF_SIBLING_HANDLE;
  }

  function restoreSelections() {
    var savedMetal = sessionStorage.getItem('orloff_metal');
    var savedCarat = sessionStorage.getItem('orloff_carat');
    if (savedMetal) {
      state.metal = savedMetal;
      document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.toggle('active', b.dataset.metal === savedMetal); });
      var label = document.getElementById('rc-metal-label');
      if (label) label.textContent = savedMetal;
    }
    if (savedCarat) state.carat = savedCarat;
    sessionStorage.removeItem('orloff_metal');
    sessionStorage.removeItem('orloff_carat');
  }

  function hideDefaultElements() {
    var sectionId = window.ORLOFF_SECTION_ID;
    var el;
    el = document.querySelector('quantity-selector'); if (el) el.style.display = 'none';
    el = document.getElementById('price-' + sectionId); if (el) el.style.display = 'none';
    el = document.getElementById('variant-selects-' + sectionId); if (el) el.style.display = 'none';
    el = document.querySelector('#product-form-' + sectionId + ' button[name="add"]'); if (el) el.style.display = 'none';
    el = document.querySelector('.shopify-payment-button, .dynamic-checkout'); if (el) el.style.display = 'none';
  }

  function initStickyBar() {
    var bar = document.getElementById('rc-sticky-bar');
    if (!bar) return;
    var title = document.querySelector('.product_title');
    if (!title) { bar.classList.add('visible'); return; }
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { bar.classList.toggle('visible', !e.isIntersecting); });
    }, { threshold: 0 }).observe(title);
  }

  function addToCart(variantId, sku, btn) {
    variantId = variantId || (function(){ var m=window.ORLOFF_VARIANT_MAP||{}; var k=Object.keys(m); return k.length?m[k[0]]:null; })();
    if (!variantId) { alert('Please make a selection'); return; }
    btn.disabled = true; btn.textContent = 'Adding...';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: variantId, quantity: 1,
        properties: {
          'Metal': state.metal,
          'Carat Weight': state.carat + ' ct',
          'Diamond Origin': state.origin === 'lab' ? 'Lab Grown' : 'Natural',
          'SKU': sku
        }
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.status) { alert(data.description || 'Could not add to cart'); btn.disabled = false; btn.textContent = 'Add to cart'; return; }
      btn.textContent = 'Added!';
      fetch('/cart.js').then(function(r) { return r.json(); }).then(function(cart) {
        document.querySelectorAll('[data-cart-count], .cart-count, .thb-cart-count').forEach(function(el) { el.textContent = cart.item_count; });
        document.dispatchEvent(new CustomEvent('dispatch:cart-drawer:open'));
        document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      });
      setTimeout(function() { btn.disabled = false; btn.textContent = 'Add to cart'; }, 2000);
    })
    .catch(function() { btn.disabled = false; btn.textContent = 'Add to cart'; });
  }

  function init() {
    if (!document.querySelector('.rc-wrap')) return;
    hideDefaultElements();
    restoreSelections();
    buildCaratButtons();

    document.querySelectorAll('[data-origin]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.origin === state.origin);
      btn.addEventListener('click', function() { switchOrigin(this.dataset.origin); });
    });

    document.querySelectorAll('[data-metal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('[data-metal]').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        state.metal = this.dataset.metal;
        var label = document.getElementById('rc-metal-label');
        if (label) label.textContent = state.metal;
        buildCaratButtons();
        updateImage();
        updatePrice();
      });
    });

    var atcBtn = document.getElementById('rc-add-to-cart');
    if (atcBtn) atcBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });
    var stickyBtn = document.getElementById('rc-sticky-add-to-cart');
    if (stickyBtn) stickyBtn.addEventListener('click', function() { addToCart(parseInt(this.dataset.variantId), this.dataset.sku, this); });

    initStickyBar();
    updateImage();
    updatePrice();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();