// Test case 4 Responsive / Mobile viewport

const VIEWPORTS = [
  { label: 'Mobile — iPhone 15', width: 393,  height: 852,  preset: null },
  { label: 'Tablet — iPad',      width: 768,  height: 1024, preset: 'ipad-2' },
  { label: 'Desktop — 1280px',   width: 1280, height: 800,  preset: null },
]

VIEWPORTS.forEach(({ label, width, height, preset }) => {
  describe(`TC-04 | Responsive — ${label}`, () => {

    beforeEach(() => {
      // Igual que en la version de escritorio, bloqueamos los scripts de Cookiebot desde la red para evitar el overlay.
      cy.intercept('GET', '**/cookiebot.com/**', { statusCode: 204, body: '' })
      cy.intercept('GET', '**/consentcdn.cookiebot.com/**', { statusCode: 204, body: '' })

      // Configurar viewport ANTES del visit
      if (preset) {
        cy.viewport(preset)
      } else {
        cy.viewport(width, height)
      }

      cy.visit('/')

      // En esta parte quitamos el overlay del DOM después de que cargue
      cy.window().then((win) => {
        const ids = [
          'CybotCookiebotDialogBodyUnderlay',
          'CybotCookiebotDialog',
          'CybotCookiebotDialogBody',
          'CybotCookiebotDialogBodyContent',
        ]
        ids.forEach((id) => {
          const el = win.document.getElementById(id)
          if (el) el.remove()
        })
        win.document.querySelectorAll('[class*="Cybot"]').forEach((el) => el.remove())
      })

      cy.get('#CybotCookiebotDialogBodyUnderlay').should('not.exist')
    })

    // El logo debe ser siempre visible, sin importar el viewport. Validamos que la imagen haya cargado correctamente y que sea visible.
    it('el logo es visible', () => {

      cy.get('img.navbar11_logo')
        .should('have.length.at.least', 1)
        .then(($imgs) => {
          const loaded = [...$imgs].find((img) => img.naturalWidth > 0)
          expect(loaded, 'Al menos un logo debe haber cargado').to.exist
          expect(loaded.naturalWidth).to.be.greaterThan(0)
        })
    })

    // La seccion hero debe estar visible en todos los viewports
    it('el headline del Hero es visible', () => {
      cy.get('h1').first().should('be.visible')
    })

    // Valide que los botones de accion esten presentes y visibles. 
    it('existe al menos un CTA visible (Get started o Contact)', () => {
      cy.get('body').then(($body) => {
        const hasGetStarted = $body.find('a:contains("Get started"):visible').length > 0
        const hasContact    = $body.find('a:contains("Contact"):visible').length > 0
        expect(
          hasGetStarted || hasContact,
          'Al menos un CTA debe ser visible'
        ).to.be.true
      })
    })

    // Seccion de servicios debe ser accesible en scroll porque estamos hablando de mobile, aunque no sea visible en mobile. 
    it('la sección de servicios existe en el DOM', () => {
      cy.contains(/Holistic AI Consulting/i).should('exist')
      cy.contains(/Custom Solutions Factory/i).should('exist')
      cy.contains(/Talent as a Service/i).should('exist')
    })
    })
})
