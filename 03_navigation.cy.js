// Test case 3: TC-03 Validación de navegación en la página principal
describe('TC-03 | Navegación', () => {

  // beforeEach bloque para limpiar el overlay de Cookiebot y visitar la página principal antes de cada test
  beforeEach(() => {
    cy.intercept('GET', '**/cookiebot.com/**', { statusCode: 204, body: '' })
    cy.intercept('GET', '**/consentcdn.cookiebot.com/**', { statusCode: 204, body: '' })

    cy.visit('/')

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

  // Nav bar o menú de navegación, esta parte prueba el logo, los botones de acciones y los ítems del menú de navegación.
  context('Ítems del menú de navegación', () => {

    it('clic en "Success stories" redirige a /success-stories', () => {
      cy.contains('a', /success stories/i).first().click({ force: true })
      cy.url().should('include', '/success-stories')
      cy.get('h1, h2').should('exist')
    })

    it('clic en "About us" redirige a /about-us', () => {
      cy.contains('a', /about us/i).first().click({ force: true })
      cy.url().should('include', '/about-us')
    })

    it('clic en "Knowledge hub" redirige a /knowledge-hub', () => {
      cy.contains('a', /knowledge hub/i).first().click({ force: true })
      cy.url().should('include', '/knowledge-hub')
    })

    it('clic en "Contact" del navbar redirige a /contact', () => {
      cy.get('a[href="/contact"]').first().click({ force: true })
      cy.url().should('include', '/contact')
    })

  })

  // Los links de servicios dirigen correctamente a la sección de servicios, aunque estén en un dropdown del nav.
  context('Links de servicios', () => {

    it('link de servicios apunta a una URL de /services/', () => {
      // Los links de servicios viven en el dropdown del nav (display:none).
      // Validamos que el href existe en el DOM aunque no sea visible.
      cy.get('a[href*="/services/"]')
        .first()
        .should('have.attr', 'href')
        .and('include', '/services/')
    })

  })

  // Aqui probamos el switcher de idioma, que puede ser un link o un botón que redirige a la versión en español del sitio.
  context('Botón de cambio de idioma', () => {

    it('existe al menos un link que apunta a /es-mx', () => {
      // El switcher puede ser un <a> o un elemento con href a /es-mx
      cy.get('a[href*="/es-mx"], a[href*="es-mx"]')
        .should('exist')
    })

    it('al hacer clic en el link /es-mx la URL cambia al español', () => {
      cy.get('a[href*="/es-mx"]')
        .first()
        .click({ force: true })
      cy.url().should('include', '/es-mx')
    })

  })

  // Validamos el footer, que el link de linkedin exista y que el link de Privacy Notice esté presente.
  context('Footer — links de empresa', () => {

    it('existe al menos un link a redes sociales en el footer', () => {
      // LinkedIn puede usar lnkd.in o linkedin.com dependiendo del sitio
      cy.get('footer a, [class*="footer"] a')
        .filter('[href*="linkedin"], [href*="lnkd"], [href*="instagram"], [href*="twitter"]')
        .should('have.length.at.least', 1)
    })

    it('existe el link de Privacy Notice en el footer', () => {
      cy.contains('a', /privacy/i)
        .should('exist')
        .and('have.attr', 'href')
    })

  })

  // Finalmente validamos que los links de "Success Stories" cards redirigen correctamente a la sección de casos de éxito.
  context('Navegación desde Success Stories cards', () => {

    it('existen links que apuntan a /success-stories/', () => {
      // "Read more" puede tener texto diferente; buscamos por href
      cy.get('a[href*="/success-stories/"]')
        .should('have.length.at.least', 1)
    })

  })

})