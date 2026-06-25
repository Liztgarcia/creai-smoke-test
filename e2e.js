Cypress.on('uncaughtException', (err, runnable) => {
    const externalOrigins = [
        'googletagmanager',
        'google-analytics',
        'cdn.prod.website-files',
        'gtm',
        'cookiebot',
    ]
    const isExternal = externalOrigins.some((origin) => 
        err.message?.toLowerCase().includes(origin) || 
        err.stack?.toLowerCase().includes(origin)
    )

    if (isExternal) return false 
    throw err 
})

// Después de diferentes pruebas se detecto que se necesita cerrar el banner de cookies automaticamente para que no interfiera con los tests.

Cypress.Commands.add('dismissCookies', () => {
    cy.document().then((doc) => {
        const overlay = doc.getElementById('CybotCookiebotDialogBodyUnderlay')
        const dialog = doc.getElementById('CybotCookiebotDialogBody')
        if (overlay) overlay.remove()
        if (dialog) dialog.remove() 
    })
})

// Este comando valida si la imahen se ha cargado correctamente en la página.

Cypress.Commands.add('assertImageLoaded', (selector) => {
    cy.get(selector).should('be.visible').and(($img) => {
        expect($img[0].naturalWidth, `${selector} - naturalWidth`).to.be.greaterThan(0)
        expect($img[0].complete, `${selector} - complete`).to.be.true
    })
})

// Este comando verifica que un enlace tiene href real, no vacío ni nulo, y que no contiene 'javascript:void(0)'.

Cypress.Commands.add('assertRealHref', (selector) => {
    cy.get(selector)
    .should('have.attr', 'href')
    .and(($a) => {
        const href = $a.attr('href')
        expect(href).to.not.be.empty
        expect(href).to.not.be.null
        expect(href).to.not.contain('javascript:void(0)')
    })
})

// Este comando navega al homepage y espera a que cargue el nav.

Cypress.Commands.add('visitHomepage', () => {
    cy.visit('/')
    cy.get('nav, [class*="nav"], header').should('exist').and('be.visible')
})
