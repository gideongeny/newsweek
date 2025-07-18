// Moved from index.html
// Weather functionality
function updateWeather() {
  const weatherDisplay = document.getElementById('weather-display');
  const now = new Date();
  const hour = now.getHours();
  
  // Simulate different weather conditions based on time of day
  let temp, icon;
  if (hour >= 6 && hour < 12) {
    // Morning: 22-26°C
    temp = Math.floor(Math.random() * 5) + 22;
    icon = 'fa-sun';
  } else if (hour >= 12 && hour < 18) {
    // Afternoon: 26-30°C
    temp = Math.floor(Math.random() * 5) + 26;
    icon = 'fa-cloud-sun';
  } else if (hour >= 18 && hour < 22) {
    // Evening: 20-24°C
    temp = Math.floor(Math.random() * 5) + 20;
    icon = 'fa-cloud-moon';
  } else {
    // Night: 16-20°C
    temp = Math.floor(Math.random() * 5) + 16;
    icon = 'fa-moon';
  }
  
  // Random chance of rain (20%)
  if (Math.random() < 0.2) {
    temp -= 2; // Slightly cooler when raining
    icon = 'fa-cloud-rain';
  }
  
  // Update weather widget
  const weatherIcon = document.querySelector('.weather-widget i');
  weatherIcon.className = `fas ${icon}`;
  weatherDisplay.textContent = `Nairobi: ${temp}°C`;
  
  // Update again in 5 minutes
  setTimeout(updateWeather, 5 * 60 * 1000);
}

// Initialize weather
updateWeather();

// Subscription modal functionality
const subscribeBtn = document.getElementById('subscribeBtn');
const subscribeModal = document.getElementById('subscribeModal');
const closeModal = document.querySelector('.close-modal');

// Accessibility: Focus trap and ESC key for modals
function trapFocus(modal) {
  const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
  const focusableEls = modal.querySelectorAll(focusableSelectors);
  if (!focusableEls.length) return;
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  function handleTab(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      closeModalFunc(modal);
    }
  }

  modal.addEventListener('keydown', handleTab);
  // Remove event on close
  modal._removeTrap = () => modal.removeEventListener('keydown', handleTab);
}

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();
  trapFocus(modal);
}

function closeModalFunc(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  if (modal._removeTrap) modal._removeTrap();
}

// Subscription modal accessibility
if (subscribeBtn) {
  subscribeBtn.addEventListener('click', () => {
    openModal(subscribeModal);
  });
}
if (closeModal) {
  closeModal.addEventListener('click', () => {
    closeModalFunc(subscribeModal);
  });
}
window.addEventListener('click', (e) => {
  if (e.target === subscribeModal) {
    closeModalFunc(subscribeModal);
  }
});
const subscriptionForm = document.querySelector('.subscription-form');
if (subscriptionForm) {
  subscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    closeModalFunc(subscribeModal);
  });
}

// Slideshow functionality
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Wrap around if at beginning or end
  if (index >= slides.length) currentSlide = 0;
  if (index < 0) currentSlide = slides.length - 1;
  
  // Show current slide
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  showSlide(currentSlide);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000);
}

// Initialize slideshow
showSlide(currentSlide);
startSlideshow();

// Navigation buttons
nextBtn.addEventListener('click', () => {
  clearInterval(slideInterval);
  nextSlide();
  startSlideshow();
});

prevBtn.addEventListener('click', () => {
  clearInterval(slideInterval);
  prevSlide();
  startSlideshow();
});

// Pause on hover
const slideshow = document.querySelector('.slideshow-container');
slideshow.addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

slideshow.addEventListener('mouseleave', startSlideshow);

// Live Ticker Animation
const tickerContent = document.querySelector('.ticker-content');
if (tickerContent) {
  const clone = tickerContent.cloneNode(true);
  tickerContent.appendChild(clone);
}

// Update time in ticker
function updateTickerTime() {
  const now = new Date();
  const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');
  
  // Update all ticker times (original and duplicates)
  document.querySelectorAll('.ticker-time').forEach(time => {
    time.textContent = timeString;
  });
}
setInterval(updateTickerTime, 60000);
updateTickerTime();

// Article Modal functionality
const articleModal = document.getElementById('articleModal');
const modalClose = document.querySelector('#articleModal .modal-close');

// === The Guardian API Integration ===
// Use backend proxy for NewsAPI
const NEWSAPI_KEY = 'f0c7f9cbed7347dc888cee85220af58a';
const NEWSAPI_BASE = 'http://localhost:3001/newsapi';

// Use backend proxy for Guardian API
const GUARDIAN_BASE = 'http://localhost:3001/guardian';

const newsSections = [
  { id: 'breaking', title: 'Breaking News', params: { q: 'Kenya breaking news OR latest news OR top stories', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 12 }, keywords: ['breaking', 'alert', 'urgent', 'update', 'news'] },
  { id: 'kenya', title: 'Kenya', params: { q: 'Kenya AND (politics OR economy OR society OR news OR Nairobi OR government OR parliament OR president OR election)', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 12 }, keywords: ['kenya'] },
  { id: 'live', title: 'Live News', params: { q: 'Kenya live news OR breaking news OR live updates', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 12 }, keywords: ['live', 'breaking', 'update', 'now', 'news'] },
  { id: 'technology', title: 'Technology', params: { section: 'technology', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 10 }, keywords: ['technology'] },
  { id: 'world', title: 'World News', params: { section: 'world', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 10 }, keywords: ['world'] },
  { id: 'entertainment', title: 'Entertainment', params: { section: 'culture', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 10 }, keywords: ['entertainment', 'culture', 'music', 'film', 'movie', 'show', 'celebrity', 'art'] },
  { id: 'science', title: 'Science', params: { section: 'science', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 10 }, keywords: ['science'] },
  { id: 'africa', title: 'Africa', params: { q: 'Africa OR Nigeria OR Kenya OR South Africa OR Ghana OR Ethiopia OR Egypt OR Rwanda OR Uganda OR Tanzania OR Algeria OR Morocco OR Senegal OR Sudan OR Angola OR Mozambique OR Cameroon OR Botswana OR Zimbabwe OR Ivory Coast OR Democratic Republic of Congo OR Somalia OR Libya OR Malawi OR Zambia OR Tunisia OR Gabon OR Namibia OR Burkina Faso OR Mali OR Niger OR Benin OR Sierra Leone OR Togo OR Central African Republic OR Eritrea OR Liberia OR Mauritania OR Gambia OR Lesotho OR Guinea OR Burundi OR Swaziland OR Djibouti OR Comoros OR Cape Verde OR Sao Tome OR Seychelles', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 20 }, keywords: ['africa', 'nigeria', 'kenya', 'south africa', 'ghana', 'ethiopia', 'egypt', 'rwanda', 'uganda', 'tanzania', 'algeria', 'morocco', 'senegal', 'sudan', 'angola', 'mozambique', 'cameroon', 'botswana', 'zimbabwe', 'ivory coast', 'democratic republic of congo', 'somalia', 'libya', 'malawi', 'zambia', 'tunisia', 'gabon', 'namibia', 'burkina faso', 'mali', 'niger', 'benin', 'sierra leone', 'togo', 'central african republic', 'eritrea', 'liberia', 'mauritania', 'gambia', 'lesotho', 'guinea', 'burundi', 'swaziland', 'djibouti', 'comoros', 'cape verde', 'sao tome', 'seychelles'] },
  { id: 'sport', title: 'Sport', params: { section: 'sport', 'show-fields': 'thumbnail,trailText,body', 'order-by': 'newest', 'page-size': 10 }, keywords: ['sport'] }
];

function buildNewsCard(article, labelOverride) {
  const img = article.fields && article.fields.thumbnail ? `<img src="${article.fields.thumbnail}" alt="${article.webTitle}" loading="lazy">` : '';
  const label = labelOverride || article.sectionName || 'News';
  const title = article.webTitle || article.title;
  const summary = article.fields?.trailText || article.description || '';
  const date = article.webPublicationDate ? new Date(article.webPublicationDate).toLocaleDateString() : '';
  const readMore = article.webUrl ? `<p><a href="${article.webUrl}" target="_blank" rel="noopener" style="color:#cc0000;font-weight:500;">Read full article &rarr;</a></p>` : '';
  return `<article class="news-card">
    ${img}
    <div class="news-card-content">
      <span class="category">${label}</span>
      <h3>${title}</h3>
      <p>${summary}</p>
      <div class="article-meta">
        <span class="date">${date}</span>
      </div>
      ${readMore}
    </div>
  </article>`;
}

// Helper: fetch extra news from NewsAPI for any section if Guardian returns too few
async function fetchExtraNewsFromNewsAPI(section, existingUrls = [], needed = 10) {
  const NEWSAPI_KEY = 'f0c7f9cbed7347dc888cee85220af58a';
  const NEWSAPI_BASE = 'http://localhost:3001/newsapi';
  // Use section's keywords or title for NewsAPI query
  let q = (section.keywords && section.keywords.length) ? section.keywords.join(' OR ') : section.title;
  // Special case for Africa: use 'Africa' and all countries
  if (section.id === 'africa') {
    q = 'Africa OR Nigeria OR Kenya OR South Africa OR Ghana OR Ethiopia OR Egypt OR Rwanda OR Uganda OR Tanzania OR Algeria OR Morocco OR Senegal OR Sudan OR Angola OR Mozambique OR Cameroon OR Botswana OR Zimbabwe OR Ivory Coast OR Democratic Republic of Congo OR Somalia OR Libya OR Malawi OR Zambia OR Tunisia OR Gabon OR Namibia OR Burkina Faso OR Mali OR Niger OR Benin OR Sierra Leone OR Togo OR Central African Republic OR Eritrea OR Liberia OR Mauritania OR Gambia OR Lesotho OR Guinea OR Burundi OR Swaziland OR Djibouti OR Comoros OR Cape Verde OR Sao Tome OR Seychelles';
  }
  const url = `${NEWSAPI_BASE}?apiKey=${NEWSAPI_KEY}&q=${encodeURIComponent(q)}&language=en&pageSize=50`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.articles && data.articles.length) {
      // Filter out duplicates by url
      return data.articles.filter(a => !existingUrls.includes(a.url)).slice(0, needed).map(a => ({
        webTitle: a.title,
        fields: {
          trailText: a.description || '',
          thumbnail: a.urlToImage || '',
          body: ''
        },
        webPublicationDate: a.publishedAt,
        sectionName: section.title,
        webUrl: a.url
      }));
    }
  } catch (e) {}
  return [];
}

async function fetchAndRenderNews(section) {
  const sectionEl = document.getElementById(section.id);
  if (!sectionEl) return;
  const grid = sectionEl.querySelector('.news-grid') || sectionEl.querySelector('.featured-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-spinner"></div>';
  let url = GUARDIAN_BASE + '?';
  Object.entries(section.params).forEach(([k, v]) => url += `&${k}=${encodeURIComponent(v)}`);
  let articles = [];
  let apiError = '';
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.response && data.response.results && data.response.results.length) {
      let originalArticles = data.response.results;
      let filtered = originalArticles;
      // Post-fetch keyword filter for topical relevance
      if (section.keywords && section.keywords.length) {
        filtered = originalArticles.filter(a => {
          const text = ((a.webTitle || '') + ' ' + (a.fields?.trailText || '') + ' ' + (a.sectionName || '')).toLowerCase();
          return section.keywords.some(kw => text.includes(kw));
        });
        // If filter removes all, fall back to original (but only if original is not empty)
        if (filtered.length === 0 && originalArticles.length > 0) {
          filtered = originalArticles;
        }
      }
      // For all sections, if fewer than 10, fetch more from NewsAPI
      if (filtered.length < 10) {
        const existingUrls = filtered.map(a => a.webUrl);
        const extra = await fetchExtraNewsFromNewsAPI(section, existingUrls, 10 - filtered.length);
        filtered = filtered.concat(extra);
      }
      // If still empty, add fallback articles for these sections
      if (filtered.length === 0) {
        if (section.id === 'breaking') {
          filtered = [
            { webTitle: "Kenya Parliament passes urgent security bill", fields: { trailText: "Breaking: Parliament passes controversial bill amid protests.", thumbnail: "images/Kenya Parliament.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:30:00Z", sectionName: "Breaking" },
            { webTitle: "Live: Demonstrations intensify in Nairobi CBD", fields: { trailText: "Police deploy tear gas as protests escalate.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:15:00Z", sectionName: "Breaking" }
          ];
        } else if (section.id === 'live') {
          filtered = [
            { webTitle: "Live: Kenya's Gen Z rallies for change", fields: { trailText: "Youth-led protests broadcast live from Nairobi.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:00:00Z", sectionName: "Live" },
            { webTitle: "Live: Athletics - Olunga sets national record in 100m", fields: { trailText: "Kenyan sprinter Olunga breaks national record in thrilling final.", thumbnail: "images/Olunga sets national record in 100 m.jpg", body: "..." }, webPublicationDate: "2025-06-27T13:30:00Z", sectionName: "Live" },
            { webTitle: "Live: Finance committee rejects KRA data clause", fields: { trailText: "Parliamentary committee votes down controversial tax data proposal.", thumbnail: "images/Finance committee rejects KRA data clause.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Live" },
            { webTitle: "Live: Fans mourn Kelvin Kiptum", fields: { trailText: "Athletics fans gather to pay tribute to late marathon champion.", thumbnail: "images/Fans mourn Kelvin Kiptum.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:30:00Z", sectionName: "Live" },
            { webTitle: "Live: FIFA ban lifted on Kenyan football", fields: { trailText: "Kenya rejoins international football after FIFA lifts ban.", thumbnail: "images/FIFA ban lifted on Kenyan football.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Live" },
            { webTitle: "Live: Economic indicators show growth", fields: { trailText: "Kenya's economy posts positive growth in Q2.", thumbnail: "images/Economic indicators.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:30:00Z", sectionName: "Live" },
            { webTitle: "Live: Nyayo Stadium ready for CHAN and AFCON", fields: { trailText: "Stadium upgrades complete ahead of major tournaments.", thumbnail: "images/Nyayo Stadium ready for CHAN and AFCON.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Live" }
          ];
        } else if (section.id === 'entertainment') {
          filtered = [
            { webTitle: "Bomas of Kenya promotes heritage", fields: { trailText: "Cultural shows and music events draw crowds.", thumbnail: "images/Bomas of Kenya promotes heritage.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Entertainment" }
          ];
        } else if (section.id === 'africa') {
          filtered = [
            { webTitle: "Specialty coffee boosts Kenyan output", fields: { trailText: "Kenya's coffee industry sees record growth.", thumbnail: "images/Specialty coffee boosts Kenyan output.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Africa" },
            { webTitle: "World Bank supports African economies", fields: { trailText: "Major funding for infrastructure and health.", thumbnail: "images/World Bank.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Africa" },
            { webTitle: "Maasai Olympics empower women", fields: { trailText: "Sports event drives gender equality in Maasai communities.", thumbnail: "images/Maasai Olympics empower women.webp", body: "..." }, webPublicationDate: "2025-06-27T10:30:00Z", sectionName: "Africa" },
            { webTitle: "Business growth in Africa accelerates", fields: { trailText: "Entrepreneurship and investment on the rise across the continent.", thumbnail: "images/Business growth.jpg", body: "..." }, webPublicationDate: "2025-06-27T10:00:00Z", sectionName: "Africa" }
          ];
        }
      }
      articles = filtered;
      showDebug(sectionEl, ''); // clear debug
    } else {
      apiError = 'Guardian API returned no articles.';
      showDebug(sectionEl, apiError);
      // Remove old fallback articles
      if (section.id === 'breaking') {
        articles = [
          { webTitle: "Kenya Parliament passes urgent security bill", fields: { trailText: "Breaking: Parliament passes controversial bill amid protests.", thumbnail: "images/Kenya Parliament.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:30:00Z", sectionName: "Breaking" },
          { webTitle: "Live: Demonstrations intensify in Nairobi CBD", fields: { trailText: "Police deploy tear gas as protests escalate.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:15:00Z", sectionName: "Breaking" }
        ];
      } else if (section.id === 'live') {
        articles = [
          { webTitle: "Live: Kenya's Gen Z rallies for change", fields: { trailText: "Youth-led protests broadcast live from Nairobi.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:00:00Z", sectionName: "Live" },
          { webTitle: "Live: Athletics - Olunga sets national record in 100m", fields: { trailText: "Kenyan sprinter Olunga breaks national record in thrilling final.", thumbnail: "images/Olunga sets national record in 100 m.jpg", body: "..." }, webPublicationDate: "2025-06-27T13:30:00Z", sectionName: "Live" },
          { webTitle: "Live: Finance committee rejects KRA data clause", fields: { trailText: "Parliamentary committee votes down controversial tax data proposal.", thumbnail: "images/Finance committee rejects KRA data clause.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Live" },
          { webTitle: "Live: Fans mourn Kelvin Kiptum", fields: { trailText: "Athletics fans gather to pay tribute to late marathon champion.", thumbnail: "images/Fans mourn Kelvin Kiptum.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:30:00Z", sectionName: "Live" },
          { webTitle: "Live: FIFA ban lifted on Kenyan football", fields: { trailText: "Kenya rejoins international football after FIFA lifts ban.", thumbnail: "images/FIFA ban lifted on Kenyan football.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Live" },
          { webTitle: "Live: Economic indicators show growth", fields: { trailText: "Kenya's economy posts positive growth in Q2.", thumbnail: "images/Economic indicators.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:30:00Z", sectionName: "Live" },
          { webTitle: "Live: Nyayo Stadium ready for CHAN and AFCON", fields: { trailText: "Stadium upgrades complete ahead of major tournaments.", thumbnail: "images/Nyayo Stadium ready for CHAN and AFCON.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Live" }
        ];
      } else if (section.id === 'entertainment') {
        articles = [
          { webTitle: "Bomas of Kenya promotes heritage", fields: { trailText: "Cultural shows and music events draw crowds.", thumbnail: "images/Bomas of Kenya promotes heritage.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Entertainment" }
        ];
      } else if (section.id === 'africa') {
        articles = [
          { webTitle: "Specialty coffee boosts Kenyan output", fields: { trailText: "Kenya's coffee industry sees record growth.", thumbnail: "images/Specialty coffee boosts Kenyan output.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Africa" },
          { webTitle: "World Bank supports African economies", fields: { trailText: "Major funding for infrastructure and health.", thumbnail: "images/World Bank.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Africa" },
          { webTitle: "Maasai Olympics empower women", fields: { trailText: "Sports event drives gender equality in Maasai communities.", thumbnail: "images/Maasai Olympics empower women.webp", body: "..." }, webPublicationDate: "2025-06-27T10:30:00Z", sectionName: "Africa" },
          { webTitle: "Business growth in Africa accelerates", fields: { trailText: "Entrepreneurship and investment on the rise across the continent.", thumbnail: "images/Business growth.jpg", body: "..." }, webPublicationDate: "2025-06-27T10:00:00Z", sectionName: "Africa" }
        ];
      }
      grid.innerHTML = `<div class='api-error-message' style='color:red; font-weight:bold; margin:1em 0;'>${apiError}<br>Showing fallback news.</div>` + articles.map(buildNewsCard).join('');
      return;
    }
  } catch (e) {
    apiError = `Guardian API error: ${e.message || e}`;
    showDebug(sectionEl, apiError);
    // Remove old fallback articles
    if (section.id === 'breaking') {
      articles = [
        { webTitle: "Kenya Parliament passes urgent security bill", fields: { trailText: "Breaking: Parliament passes controversial bill amid protests.", thumbnail: "images/Kenya Parliament.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:30:00Z", sectionName: "Breaking" },
        { webTitle: "Live: Demonstrations intensify in Nairobi CBD", fields: { trailText: "Police deploy tear gas as protests escalate.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:15:00Z", sectionName: "Breaking" }
      ];
    } else if (section.id === 'live') {
      articles = [
        { webTitle: "Live: Kenya's Gen Z rallies for change", fields: { trailText: "Youth-led protests broadcast live from Nairobi.", thumbnail: "images/Gen‑Z rallies after blogger's death.jpg", body: "..." }, webPublicationDate: "2025-06-27T14:00:00Z", sectionName: "Live" },
        { webTitle: "Live: Athletics - Olunga sets national record in 100m", fields: { trailText: "Kenyan sprinter Olunga breaks national record in thrilling final.", thumbnail: "images/Olunga sets national record in 100 m.jpg", body: "..." }, webPublicationDate: "2025-06-27T13:30:00Z", sectionName: "Live" },
        { webTitle: "Live: Finance committee rejects KRA data clause", fields: { trailText: "Parliamentary committee votes down controversial tax data proposal.", thumbnail: "images/Finance committee rejects KRA data clause.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Live" },
        { webTitle: "Live: Fans mourn Kelvin Kiptum", fields: { trailText: "Athletics fans gather to pay tribute to late marathon champion.", thumbnail: "images/Fans mourn Kelvin Kiptum.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:30:00Z", sectionName: "Live" },
        { webTitle: "Live: FIFA ban lifted on Kenyan football", fields: { trailText: "Kenya rejoins international football after FIFA lifts ban.", thumbnail: "images/FIFA ban lifted on Kenyan football.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Live" },
        { webTitle: "Live: Economic indicators show growth", fields: { trailText: "Kenya's economy posts positive growth in Q2.", thumbnail: "images/Economic indicators.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:30:00Z", sectionName: "Live" },
        { webTitle: "Live: Nyayo Stadium ready for CHAN and AFCON", fields: { trailText: "Stadium upgrades complete ahead of major tournaments.", thumbnail: "images/Nyayo Stadium ready for CHAN and AFCON.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Live" }
      ];
    } else if (section.id === 'entertainment') {
      articles = [
        { webTitle: "Bomas of Kenya promotes heritage", fields: { trailText: "Cultural shows and music events draw crowds.", thumbnail: "images/Bomas of Kenya promotes heritage.jpeg", body: "..." }, webPublicationDate: "2025-06-27T13:00:00Z", sectionName: "Entertainment" }
      ];
    } else if (section.id === 'africa') {
      articles = [
        { webTitle: "Specialty coffee boosts Kenyan output", fields: { trailText: "Kenya's coffee industry sees record growth.", thumbnail: "images/Specialty coffee boosts Kenyan output.jpg", body: "..." }, webPublicationDate: "2025-06-27T12:00:00Z", sectionName: "Africa" },
        { webTitle: "World Bank supports African economies", fields: { trailText: "Major funding for infrastructure and health.", thumbnail: "images/World Bank.jpg", body: "..." }, webPublicationDate: "2025-06-27T11:00:00Z", sectionName: "Africa" },
        { webTitle: "Maasai Olympics empower women", fields: { trailText: "Sports event drives gender equality in Maasai communities.", thumbnail: "images/Maasai Olympics empower women.webp", body: "..." }, webPublicationDate: "2025-06-27T10:30:00Z", sectionName: "Africa" },
        { webTitle: "Business growth in Africa accelerates", fields: { trailText: "Entrepreneurship and investment on the rise across the continent.", thumbnail: "images/Business growth.jpg", body: "..." }, webPublicationDate: "2025-06-27T10:00:00Z", sectionName: "Africa" }
      ];
    }
    grid.innerHTML = `<div class='api-error-message' style='color:red; font-weight:bold; margin:1em 0;'>${apiError}<br>Showing fallback news.</div>` + articles.map(buildNewsCard).join('');
    return;
  }
  // Load More logic
  let shownCount = 0;
  const BATCH_SIZE = 10;
  function renderBatch() {
    const toShow = articles.slice(0, shownCount + BATCH_SIZE);
    grid.innerHTML = toShow.map(buildNewsCard).join('');
    shownCount = toShow.length;
    // Attach click to open modal
    grid.querySelectorAll('.news-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        const article = toShow[i];
        document.getElementById('modalTitle').textContent = article.webTitle;
        document.getElementById('modalCategory').textContent = article.sectionName || '';
        document.getElementById('modalImage').src = article.fields?.thumbnail || '';
        document.getElementById('modalImage').alt = article.webTitle;
        let contentHtml = '';
        if (article.fields?.body) {
          contentHtml += `<div>${article.fields.body}</div>`;
        } else if (article.fields?.trailText) {
          contentHtml += `<p>${article.fields.trailText}</p>`;
          contentHtml += `<p style='color:#888;font-size:0.95rem;'>Full article is available on The Guardian.</p>`;
        } else {
          contentHtml += `<p style='color:#888;font-size:0.95rem;'>Only a brief summary is available. Please read the full article on The Guardian.</p>`;
        }
        contentHtml += `<p><a href="${article.webUrl}" target="_blank" rel="noopener" style="color:#cc0000;font-weight:500;">Read full article on The Guardian &rarr;</a></p>`;
        document.getElementById('modalContent').innerHTML = contentHtml;
        document.getElementById('modalVideo').innerHTML = '';
        openModal(articleModal);
      });
    });
    // Load More button
    let loadMoreBtn = sectionEl.querySelector('.load-more-btn');
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement('button');
      loadMoreBtn.className = 'load-more-btn';
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.style.margin = '2rem auto 1rem auto';
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.style.background = '#cc0000';
      loadMoreBtn.style.color = '#fff';
      loadMoreBtn.style.border = 'none';
      loadMoreBtn.style.padding = '0.75rem 2rem';
      loadMoreBtn.style.borderRadius = '4px';
      loadMoreBtn.style.fontWeight = '500';
      loadMoreBtn.style.cursor = 'pointer';
      loadMoreBtn.style.fontSize = '1.1rem';
      sectionEl.appendChild(loadMoreBtn);
    }
    if (shownCount >= articles.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.onclick = renderBatch;
    }
  }
  renderBatch();
  attachModalAndSearchLogic();
}

// Add Africa section if not present
if (!document.getElementById('africa')) {
  const main = document.querySelector('main');
  const africaSection = document.createElement('section');
  africaSection.id = 'africa';
  africaSection.className = 'news-section';
  africaSection.innerHTML = `<h2>Africa</h2><div class="news-grid"></div>`;
  main.appendChild(africaSection);
}

// Fetch news for all sections on page load (only once)
newsSections.forEach(fetchAndRenderNews);

// Attach refresh button logic for each section
newsSections.forEach(section => {
  const sectionEl = document.getElementById(section.id);
  if (sectionEl) {
    const refreshBtn = sectionEl.querySelector('.refresh-btn');
    if (refreshBtn) {
      refreshBtn.onclick = () => {
        fetchAndRenderNews(section).then(() => {
          attachModalAndSearchLogic();
        });
      };
    }
  }
});

// Attach modal and search logic after initial news load
function attachModalAndSearchLogic() {
  // Re-attach news-card click for modal
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', function() {
      const title = this.querySelector('h3').textContent;
      const category = this.querySelector('.category')?.textContent || '';
      const content = this.querySelector('p').textContent;
      const img = this.querySelector('img');
      const video = this.querySelector('.video-container');
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalCategory').textContent = category;
      document.getElementById('modalContent').innerHTML = `<p>${content}</p>`;
      if (img) {
        document.getElementById('modalImage').src = img.src;
        document.getElementById('modalImage').alt = img.alt;
      }
      if (video) {
        document.getElementById('modalVideo').innerHTML = video.innerHTML;
      } else {
        document.getElementById('modalVideo').innerHTML = '';
      }
      openModal(articleModal);
    });
  });
  // Re-attach search
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const query = e.target.value.trim();
      filterNewsCards(query);
      if (!query) {
        allNewsCards.forEach(card => card.style.display = '');
        allNewsSections.forEach(section => section.style.display = '');
        const noResults = document.getElementById('noResultsMsg');
        if (noResults) noResults.remove();
      }
    });
  }
}
// Attach after initial load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(attachModalAndSearchLogic, 1000);
});

modalClose.addEventListener('click', () => {
  closeModalFunc(articleModal);
});

window.addEventListener('click', (e) => {
  if (e.target === articleModal) {
    closeModalFunc(articleModal);
  }
});

// Social sharing functionality for article modal
function getCurrentArticleTitle() {
  return document.getElementById('modalTitle').textContent;
}
function getCurrentArticleUrl() {
  return window.location.href.split('#')[0];
}
function getCurrentArticleSummary() {
  return document.getElementById('modalContent').textContent;
}
function shareArticle(platform) {
  const title = getCurrentArticleTitle();
  const url = getCurrentArticleUrl();
  const summary = getCurrentArticleSummary();
  let shareUrl = '';
  if (platform === 'facebook') {
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  } else if (platform === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  } else if (platform === 'whatsapp') {
    shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
  } else if (platform === 'email') {
    shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n' + url)}`;
  }
  window.open(shareUrl, '_blank', 'noopener');
}
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');
const shareWhatsApp = document.getElementById('shareWhatsApp');
const shareEmail = document.getElementById('shareEmail');
if (shareFacebook) shareFacebook.onclick = () => shareArticle('facebook');
if (shareTwitter) shareTwitter.onclick = () => shareArticle('twitter');
if (shareWhatsApp) shareWhatsApp.onclick = () => shareArticle('whatsapp');
if (shareEmail) shareEmail.onclick = () => shareArticle('email');

// Comments functionality for article modal
function getCommentsKey() {
  return 'comments_' + getCurrentArticleTitle();
}
function loadComments() {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = '';
  const key = getCommentsKey();
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.forEach(comment => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${comment.name}</strong><br>${comment.text}`;
    commentsList.appendChild(li);
  });
}
function saveComment(name, text) {
  const key = getCommentsKey();
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  comments.push({ name, text });
  localStorage.setItem(key, JSON.stringify(comments));
}
const commentForm = document.getElementById('commentForm');
if (commentForm) {
  commentForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (!name || !text) return;
    saveComment(name, text);
    loadComments();
    commentForm.reset();
  };
}
// Load comments when article modal opens
const originalOpenModal = openModal;
openModal = function(modal) {
  originalOpenModal(modal);
  if (modal.id === 'articleModal') {
    loadComments();
  }
};

// Real-time search functionality
const allNewsCards = Array.from(document.querySelectorAll('.news-card'));
const allNewsSections = Array.from(document.querySelectorAll('.news-section'));

function filterNewsCards(query) {
  let anyVisible = false;
  // Always get the current list of news cards and sections
  const allNewsCards = Array.from(document.querySelectorAll('.news-card'));
  const allNewsSections = Array.from(document.querySelectorAll('.news-section'));
  allNewsCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent || '';
    const summary = card.querySelector('p')?.textContent || '';
    const match = (title + ' ' + summary).toLowerCase().includes(query.toLowerCase());
    card.style.display = match ? '' : 'none';
    if (match) anyVisible = true;
  });
  // Show/hide section if it has visible cards
  allNewsSections.forEach(section => {
    const cards = Array.from(section.querySelectorAll('.news-card'));
    const visible = cards.some(card => card.style.display !== 'none');
    section.style.display = visible ? '' : 'none';
  });
  // Show no results message if nothing is visible
  let noResults = document.getElementById('noResultsMsg');
  if (!anyVisible) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.id = 'noResultsMsg';
      noResults.textContent = 'No news articles found.';
      noResults.style.textAlign = 'center';
      noResults.style.margin = '2rem';
      document.querySelector('main').appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Refresh button functionality
document.querySelectorAll('.refresh-btn').forEach(button => {
  button.addEventListener('click', function() {
    this.classList.add('rotating');
    setTimeout(() => {
      this.classList.remove('rotating');
    }, 1000);
  });
});

// Lazy loading for images
const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  images.forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight + 500) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  });
};

window.addEventListener('scroll', lazyLoadImages);
window.addEventListener('resize', lazyLoadImages);
window.addEventListener('orientationchange', lazyLoadImages);
lazyLoadImages(); 

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle.querySelector('i');

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    darkModeIcon.classList.remove('fa-sun');
    darkModeIcon.classList.add('fa-moon');
    darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
    localStorage.setItem('darkMode', 'false');
  }
}

darkModeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});

// On page load, set theme from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  setDarkMode(true);
} else {
  setDarkMode(false);
} 

// Cookie consent functionality
const cookieConsent = document.getElementById('cookieConsent');
const acceptCookies = document.getElementById('acceptCookies');
if (cookieConsent && acceptCookies) {
  if (localStorage.getItem('cookiesAccepted') !== 'true') {
    cookieConsent.style.display = 'flex';
    cookieConsent.focus();
  }
  acceptCookies.onclick = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.style.display = 'none';
  };
}
// Privacy policy modal (simple)
const privacyPolicyLink = document.getElementById('privacyPolicyLink');
const cookiePrivacyLink = document.getElementById('cookiePrivacyLink');
if (privacyPolicyLink && cookiePrivacyLink) {
  function showPrivacyModal() {
    alert('Privacy Policy: We respect your privacy. We do not share your data with third parties. Comments and newsletter emails are stored locally and not shared.');
  }
  privacyPolicyLink.onclick = cookiePrivacyLink.onclick = function(e) {
    e.preventDefault();
    showPrivacyModal();
  };
}
// Input sanitization for comments/newsletter
function sanitizeInput(str) {
  return str.replace(/</g, '').replace(/>/g, '');
}
// Update comment form to sanitize input
if (commentForm) {
  commentForm.onsubmit = function(e) {
    e.preventDefault();
    const name = sanitizeInput(document.getElementById('commentName').value.trim());
    const text = sanitizeInput(document.getElementById('commentText').value.trim());
    if (!name || !text) return;
    saveComment(name, text);
    loadComments();
    commentForm.reset();
  };
}
// Update newsletter form to sanitize input
const newsletterForm = document.querySelector('.subscription-form');
if (newsletterForm) {
  newsletterForm.onsubmit = function(e) {
    e.preventDefault();
    const name = sanitizeInput(newsletterForm.querySelector('input[type="text"]').value.trim());
    const email = sanitizeInput(newsletterForm.querySelector('input[type="email"]').value.trim());
    alert('Thank you for subscribing, ' + name + '!');
    subscribeModal.classList.remove('active');
  };
} 

// === Live Ticker: Show Real Headlines (Guardian) ===
async function updateLiveTicker() {
  const tickerContent = document.querySelector('.ticker-content');
  if (!tickerContent) return;
  tickerContent.innerHTML = '<span style="color:#fff">Loading headlines...</span>';
  let headlines = [];
  let debugMsg = '';
  try {
    // Fetch top 5 relevant headlines from Guardian API (Kenya, breaking, live, top stories)
    const url = `${GUARDIAN_BASE}?q=Kenya OR breaking OR live OR top stories&show-fields=trailText&order-by=newest&page-size=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.response && data.response.results && data.response.results.length) {
      headlines = data.response.results.map(a => ({
        time: a.webPublicationDate ? new Date(a.webPublicationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        text: a.webTitle
      }));
      debugMsg = '';
    } else {
      debugMsg = 'Guardian API returned no headlines.';
      throw new Error('No news found');
    }
  } catch (e) {
    debugMsg = `Guardian API error: ${e.message || e}`;
    headlines = [];
  }
  tickerContent.innerHTML = headlines.map(h =>
    `<div class="ticker-item"><span class="ticker-time">${h.time}</span><span class="ticker-text">${h.text}</span></div>`
  ).join('');
  if (debugMsg) {
    let debugDiv = document.getElementById('tickerDebug');
    if (!debugDiv) {
      debugDiv = document.createElement('div');
      debugDiv.id = 'tickerDebug';
      debugDiv.style.color = 'red';
      debugDiv.style.fontSize = '0.95rem';
      debugDiv.style.margin = '0.5rem 0';
      tickerContent.parentElement.insertBefore(debugDiv, tickerContent);
    }
    debugDiv.textContent = debugMsg;
  }
}
updateLiveTicker();
setInterval(updateLiveTicker, 5 * 60 * 1000); 

// === Dynamic Slideshow from Guardian API (Kenya + Africa + World) ===
async function updateSlideshow() {
  const slidesContainer = document.querySelector('.slideshow-container .slides');
  if (!slidesContainer) return;
  let debugDiv = document.getElementById('slideshowDebug');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.id = 'slideshowDebug';
    debugDiv.style.color = 'red';
    debugDiv.style.fontSize = '0.95rem';
    debugDiv.style.margin = '0.5rem 0';
    slidesContainer.parentElement.insertBefore(debugDiv, slidesContainer);
  }
  slidesContainer.innerHTML = '<div class="loading-spinner"></div>';
  let slides = [];
  let debugMsg = '';
  try {
    // Fetch Kenya, Africa, and World news in parallel from Guardian API
    const urls = [
      `${GUARDIAN_BASE}?q=Kenya&show-fields=thumbnail,trailText,body&order-by=newest&page-size=4`,
      `${GUARDIAN_BASE}?q=Africa OR Nigeria OR Kenya OR South Africa OR Ghana OR Ethiopia OR Egypt OR Rwanda OR Uganda&show-fields=thumbnail,trailText,body&order-by=newest&page-size=3`,
      `${GUARDIAN_BASE}?section=world&show-fields=thumbnail,trailText,body&order-by=newest&page-size=3`
    ];
    const results = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
    slides = results.flatMap(data =>
      (data.response && data.response.results) ? data.response.results : []
    );
    // Remove duplicates by webUrl
    const seen = new Set();
    slides = slides.filter(a => {
      if (!a.webUrl || seen.has(a.webUrl)) return false;
      seen.add(a.webUrl);
      return true;
    });
    debugMsg = `Fetched ${slides.length} unique articles for slideshow.`;
    // If fewer than 3, show a message
    if (slides.length < 3) {
      debugMsg += ' (Few news available)';
    }
    slides = slides.slice(0, 10);
  } catch (e) {
    debugMsg = `Slideshow error: ${e.message || e}`;
    slides = [];
  }
  debugDiv.textContent = debugMsg;
  slidesContainer.innerHTML = slides.map((article, i) => {
    const img = article.fields && article.fields.thumbnail ? `<img src="${article.fields.thumbnail}" alt="${article.webTitle}" loading="lazy">` : '';
    return `<div class="slide${i === 0 ? ' active' : ''}" data-slide-index="${i}">
      ${img}
      <div class="slide-content">
        <h2>${article.webTitle}</h2>
        <p>${article.fields?.trailText || ''}</p>
      </div>
    </div>`;
  }).join('');
  // Attach click to open modal with full details
  document.querySelectorAll('.slide').forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const article = slides[i];
      document.getElementById('modalTitle').textContent = article.webTitle;
      document.getElementById('modalCategory').textContent = article.sectionName || '';
      document.getElementById('modalImage').src = article.fields?.thumbnail || '';
      document.getElementById('modalImage').alt = article.webTitle;
      let contentHtml = '';
      if (article.fields?.body) {
        contentHtml += `<div>${article.fields.body}</div>`;
      } else if (article.fields?.trailText) {
        contentHtml += `<p>${article.fields.trailText}</p>`;
        contentHtml += `<p style='color:#888;font-size:0.95rem;'>Full article is available on The Guardian.</p>`;
      } else {
        contentHtml += `<p style='color:#888;font-size:0.95rem;'>Only a brief summary is available. Please read the full article on The Guardian.</p>`;
      }
      contentHtml += `<p><a href="${article.webUrl}" target="_blank" rel="noopener" style="color:#cc0000;font-weight:500;">Read full article on The Guardian &rarr;</a></p>`;
      document.getElementById('modalContent').innerHTML = contentHtml;
      document.getElementById('modalVideo').innerHTML = '';
      openModal(articleModal);
    });
  });
  // Re-initialize slideshow navigation and auto-advance
  initSlideshow();
}
updateSlideshow();

// === Multi-Channel YouTube Video Section ===
async function updateVideoSection() {
  const videoSection = document.getElementById('video');
  if (!videoSection) return;
  const grid = videoSection.querySelector('.news-grid');
  let debugDiv = videoSection.querySelector('.news-debug');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.className = 'news-debug';
    debugDiv.style.color = 'red';
    debugDiv.style.fontSize = '0.95rem';
    debugDiv.style.margin = '0.5rem 0';
    videoSection.insertBefore(debugDiv, grid);
  }
  grid.innerHTML = '<div class="loading-spinner"></div>';
  let videos = [];
  let debugMsg = '';
  const channels = [
    { name: 'BBC News', id: 'UC16niRr50-MSBwiO3YDb3RA' },
    { name: 'CNN', id: 'UCupvZG-5ko_eiXAupbDfxWw' },
    { name: 'Al Jazeera English', id: 'UCNye-wNBqNL5ZzHSJj3l8Bg' },
    { name: 'Citizen TV Kenya', id: 'UCKVsdeoHExltrWMuK0hOWmg' },
    { name: 'NTV Kenya', id: 'UCpbBhK4gF2p2g8gd6cS6G4w' },
    { name: 'KTN News', id: 'UCm7E9FIcCf6Awi2ZXT5d2SQ' },
    { name: 'DW News', id: 'UCknLrEdhRCp1aegoMqRaCZg' },
    { name: 'CGTN', id: 'UCgrNz-aDmcrHWT87b4u3A2w' }
  ];
  try {
    // Fetch all channels in parallel
    const results = await Promise.all(channels.map(async ch => {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.items && data.items.length) {
        return data.items.map(v => ({ ...v, channel: ch.name }));
      }
      return [];
    }));
    // Flatten, sort by publish date, and take top 16
    videos = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 16);
    debugMsg = `Fetched ${videos.length} videos from ${channels.length} channels.`;
  } catch (e) {
    debugMsg = `YouTube video error: ${e.message || e}`;
    videos = [
      { title: 'BBC News Demo Video', thumbnail: 'https://i.ytimg.com/vi/9Auq9mYxFEE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=9Auq9mYxFEE', description: 'Demo BBC News video.', channel: 'BBC News' },
      { title: 'CNN Demo Video', thumbnail: 'https://i.ytimg.com/vi/1q0g4wFbcBg/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=1q0g4wFbcBg', description: 'Demo CNN video.', channel: 'CNN' },
      { title: 'Al Jazeera Demo Video', thumbnail: 'https://i.ytimg.com/vi/2v2JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=2v2JQe6b6tE', description: 'Demo Al Jazeera video.', channel: 'Al Jazeera English' },
      { title: 'Citizen TV Kenya Demo Video', thumbnail: 'https://i.ytimg.com/vi/3v3JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=3v3JQe6b6tE', description: 'Demo Citizen TV Kenya video.', channel: 'Citizen TV Kenya' },
      { title: 'NTV Kenya Demo Video', thumbnail: 'https://i.ytimg.com/vi/4v4JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=4v4JQe6b6tE', description: 'Demo NTV Kenya video.', channel: 'NTV Kenya' },
      { title: 'KTN News Demo Video', thumbnail: 'https://i.ytimg.com/vi/5v5JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=5v5JQe6b6tE', description: 'Demo KTN News video.', channel: 'KTN News' },
      { title: 'DW News Demo Video', thumbnail: 'https://i.ytimg.com/vi/6v6JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=6v6JQe6b6tE', description: 'Demo DW News video.', channel: 'DW News' },
      { title: 'CGTN Demo Video', thumbnail: 'https://i.ytimg.com/vi/7v7JQe6b6tE/hqdefault.jpg', link: 'https://www.youtube.com/watch?v=7v7JQe6b6tE', description: 'Demo CGTN video.', channel: 'CGTN' }
    ];
  }
  debugDiv.textContent = debugMsg;
  grid.innerHTML = videos.map(video => {
    // Robustly extract YouTube video ID
    let videoId = '';
    if (video.link.includes('v=')) {
      videoId = video.link.split('v=')[1].split('&')[0];
    } else if (video.link.includes('youtu.be/')) {
      videoId = video.link.split('youtu.be/')[1].split('?')[0];
    } else if (video.link.includes('/embed/')) {
      videoId = video.link.split('/embed/')[1].split('?')[0];
    }
    return `<article class="news-card video-card" data-video-id="${videoId}">
      <div class="video-thumb-container">
        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
        <span class="play-icon"><i class="fas fa-play-circle"></i></span>
      </div>
      <div class="news-card-content">
        <span class="category">${video.channel || 'Video'}</span>
        <h3>${video.title}</h3>
        <p>${video.description || ''}</p>
      </div>
    </article>`;
  }).join('');
  // Always re-attach click handler for .video-card after rendering
  setTimeout(() => {
    grid.querySelectorAll('.video-card').forEach((card, i) => {
      card.onclick = () => {
        const videoId = card.getAttribute('data-video-id');
        // Only show the modal and YouTube iframe, hide image and content
        articleModal.classList.add('active');
        articleModal.setAttribute('aria-hidden', 'false');
        document.getElementById('modalTitle').textContent = videos[i].title;
        document.getElementById('modalCategory').textContent = videos[i].channel || 'Video';
        document.getElementById('modalImage').style.display = 'none';
        document.getElementById('modalContent').style.display = 'none';
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.style.display = 'block';
        modalVideo.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      };
    });
    // For news cards, restore modalImage and modalContent, hide modalVideo
    grid.querySelectorAll('.news-card:not(.video-card)').forEach((card, i) => {
      card.onclick = () => {
        articleModal.classList.add('active');
        articleModal.setAttribute('aria-hidden', 'false');
        document.getElementById('modalImage').style.display = 'block';
        document.getElementById('modalContent').style.display = 'block';
        document.getElementById('modalVideo').style.display = 'none';
        document.getElementById('modalVideo').innerHTML = '';
      };
    });
  }, 0);
}
updateVideoSection(); 

const subscribeBtnMobile = document.getElementById('subscribeBtnMobile');
if (subscribeBtnMobile) {
  subscribeBtnMobile.addEventListener('click', function() {
    openModal(subscribeModal);
  });
} 

// Helper to show debug info
function showDebug(sectionEl, message) {
  let debugDiv = sectionEl.querySelector('.news-debug');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.className = 'news-debug';
    debugDiv.style.color = 'red';
    debugDiv.style.fontSize = '0.95rem';
    debugDiv.style.margin = '0.5rem 0';
    sectionEl.insertBefore(debugDiv, sectionEl.firstChild);
  }
  debugDiv.textContent = message;
} 

function initSlideshow() {
  let slides = document.querySelectorAll('.slideshow-container .slide');
  let currentSlide = 0;
  let slideInterval;
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
  }
  function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
  }
  function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
  }
  function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }
  // Remove previous listeners
  const prevBtn = document.querySelector('.slideshow-container .prev');
  const nextBtn = document.querySelector('.slideshow-container .next');
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => { prevSlide(); startSlideshow(); };
    nextBtn.onclick = () => { nextSlide(); startSlideshow(); };
  }
  const slideshow = document.querySelector('.slideshow-container');
  if (slideshow) {
    slideshow.onmouseenter = () => clearInterval(slideInterval);
    slideshow.onmouseleave = startSlideshow;
  }
  showSlide(currentSlide);
  startSlideshow();
} 

// Hamburger menu logic (restore if missing)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = document.getElementById('closeMobileMenu');
let lastFocusedElement = null;
function openMobileMenu() {
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  lastFocusedElement = document.activeElement;
  mobileMenu.focus();
  document.body.style.overflow = 'hidden';
}
function closeMobileMenuFunc() {
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}
if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu.getAttribute('aria-hidden') === 'true') {
      openMobileMenu();
    } else {
      closeMobileMenuFunc();
    }
  });
  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenuFunc();
    });
  }
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu.getAttribute('aria-hidden') === 'false' && !mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
      closeMobileMenuFunc();
    }
  });
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
      closeMobileMenuFunc();
    }
  });
  // Trap focus in menu
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableEls = mobileMenu.querySelectorAll('a,button');
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
} 