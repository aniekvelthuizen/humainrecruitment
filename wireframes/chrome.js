/* ============================================================
   HumAIn Recruitment — SHARED CHROME (nav + footer)
   Injects the briefing §2 navigation (topbar + centered-logo
   main header with mega-menus) and the global footer into any
   page that contains:
     <div data-chrome="header"></div>
     <div data-chrome="footer"></div>
   …then wires sticky shadow, dropdowns, language switch and the
   mobile drawer. One source of truth for every page.

   Link targets: existing files point to real pages; pages that
   are not built yet point to "#" (wireframe stage).
   ============================================================ */
(function () {

  /* ---- HEADER ---------------------------------------------- */
  const headerHTML = `
  <header class="site" id="siteHeader">

    <!-- Topbar (secondary) -->
    <div class="topbar">
      <div class="wrap topbar-inner">
        <div class="lang" role="group" aria-label="Language">
          <button class="active" type="button">EN</button>
          <button type="button">NL</button>
        </div>
        <nav class="topbar-links" aria-label="Utility">
          <a href="platform.html">Platform</a>
          <a href="https://portal.humain-recruitment.com" target="_blank" rel="noopener">Customer Portal</a>
          <a href="contact.html">Contact</a>
          <a href="careers.html">Careers</a>
        </nav>
      </div>
    </div>

    <!-- Main header (primary) -->
    <div class="wrap nav nav--center">

      <!-- Left -->
      <ul class="nav-links nav-left" id="navLinks">
        <li><a href="hire-an-expert.html">Hire an Expert</a></li>
        <li>
          <button class="has-drop" aria-expanded="false" data-drop>For Business <span class="caret"></span></button>
          <div class="dropdown mega biz-mega3">
            <div class="mega-grid">
              <div class="mega-col">
                <h4>Hiring</h4>
                <a href="project-delivery-experts.html">Hire Project Delivery Experts from the Top 5%</a>
              </div>
              <div class="mega-col">
                <h4>Services</h4>
                <a href="consulting-services.html">Consulting &amp; Services</a>
                <a href="project-controls.html">Project Controls</a>
              </div>
              <div class="mega-col">
                <h4>Platform</h4>
                <a href="https://portal.humain-recruitment.com" target="_blank" rel="noopener">Customer Portal</a>
                <a href="talent-insights.html">Talent Insights</a>
              </div>
            </div>
          </div>
        </li>
        <li>
          <button class="has-drop" aria-expanded="false" data-drop>About Us <span class="caret"></span></button>
          <div class="dropdown mega about-mega">
            <div class="mega-grid">
              <div class="mega-col">
                <h4>About</h4>
                <a href="about.html">Vision &amp; Team</a>
              </div>
              <div class="mega-col">
                <h4>Clients</h4>
                <a href="clients.html">Cases &amp; references</a>
              </div>
              <div class="mega-col">
                <h4>How does it work</h4>
                <a href="how-it-works.html">From requirement to placement in a matter of days</a>
              </div>
              <div class="mega-col">
                <h4>Pricing</h4>
                <a href="pricing.html">Transparent rates</a>
              </div>
              <div class="mega-col">
                <h4>Talent Insights</h4>
                <a href="talent-insights.html">The Next Specialized Talent Platform</a>
              </div>
              <div class="mega-col">
                <h4>Contact</h4>
                <a href="contact.html">Get in Touch</a>
              </div>
            </div>
          </div>
        </li>

        <!-- Drawer-only extras (mobile): topbar links + lang + CTA -->
        <li class="drawer-extra" aria-hidden="false">
          <div class="drawer-lang">
            <div class="lang" role="group" aria-label="Language">
              <button class="active" type="button">EN</button>
              <button type="button">NL</button>
            </div>
          </div>
          <div class="drawer-top-links">
            <a href="platform.html">Platform</a>
            <a href="https://portal.humain-recruitment.com" target="_blank" rel="noopener">Customer Portal</a>
            <a href="contact.html">Contact</a>
            <a href="careers.html">Careers</a>
          </div>
          <div class="drawer-cta">
            <a href="submit-resume.html" class="btn">Analyse my Resume <span class="arr">→</span></a>
          </div>
        </li>
      </ul>

      <!-- Center -->
      <a href="index.html" class="logo">HumAIn <span class="logo-sub">Recruitment</span></a>

      <!-- Right -->
      <div class="nav-right">
        <a href="opportunities.html" class="nav-text-link">Opportunities</a>
        <a href="submit-resume.html" class="btn btn--sm nav-cta">Analyse my Resume <span class="arr">→</span></a>
        <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  /* ---- FOOTER ---------------------------------------------- */
  const footerHTML = `
  <footer class="site">
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a href="index.html" class="logo">HumAIn <span class="logo-sub">Recruitment</span></a>
          <p>Your extended network in international project recruitment. Human core, AI engine.</p>
          <div class="socials">
            <a href="#" aria-label="HumAIn on LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.76.79 1.76 1.75-.79 1.76-1.76 1.76zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.76c1.4-2.58 7-2.77 7 2.47V19z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4>For Business</h4>
          <a href="hire-an-expert.html">Hire an Expert</a>
          <a href="project-delivery-experts.html">Project Delivery Experts</a>
          <a href="consulting-services.html">Consulting &amp; Services</a>
          <a href="project-controls.html">Project Controls</a>
          <a href="talent-insights.html">Talent Insights</a>
        </div>

        <div>
          <h4>Company</h4>
          <a href="about.html">About</a>
          <a href="clients.html">Clients</a>
          <a href="how-it-works.html">How It Works</a>
          <a href="pricing.html">Pricing</a>
          <a href="contact.html">Contact</a>
        </div>

        <div>
          <h4>For Talent</h4>
          <a href="opportunities.html">Opportunities</a>
          <a href="submit-resume.html">Analyse my Resume</a>
          <a href="careers.html">Careers</a>
        </div>

        <div>
          <h4>Portal</h4>
          <a href="https://portal.humain-recruitment.com" target="_blank" rel="noopener">Customer Portal <span class="bh-note" style="margin-left:6px; padding:1px 7px; font-size:.58rem;">External</span></a>
        </div>
      </div>

      <div class="foot-bottom">
        <div class="legal">
          <a href="privacy-cookies.html">Privacy &amp; Cookies</a>
          <a href="#">Terms &amp; conditions</a>
          <span>© 2026 HumAIn Recruitment</span>
        </div>
        <div class="certs">
          <span style="font-size:.78rem;">Powered by</span>
          <div class="bullhorn-logo">Bullhorn</div>
        </div>
      </div>
    </div>
  </footer>`;

  /* ---- INJECT ---------------------------------------------- */
  const headerSlot = document.querySelector('[data-chrome="header"]');
  const footerSlot = document.querySelector('[data-chrome="footer"]');
  if (headerSlot) headerSlot.outerHTML = headerHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  /* ---- WIRE INTERACTIONS ----------------------------------- */

  // Sticky header shadow
  const header = document.getElementById('siteHeader');
  if (header) {
    addEventListener('scroll', () =>
      header.classList.toggle('scrolled', scrollY > 8));
  }

  // Mobile drawer
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Dropdowns (mega-menus)
  document.querySelectorAll('[data-drop]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const drop = btn.nextElementSibling;
      const open = drop.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('[data-drop]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!open) { drop.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('[data-drop]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });

  // Language switch (visual) — scoped per group so topbar + drawer stay independent
  document.querySelectorAll('.lang').forEach(group => {
    group.querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      }));
  });

})();
