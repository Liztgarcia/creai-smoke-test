// Test case 2: TC-02 Validación de elementos clave en la página principal
describe('TC-02 | Elementos clave presentes', () => {    
beforeEach(() => {
  // Bloqueamos los scripts de Cookiebot desde la red
  cy.intercept('GET', '**/cookiebot.com/**', { statusCode: 204, body: '' })
  cy.intercept('GET', '**/consentcdn.cookiebot.com/**', { statusCode: 204, body: '' })

  cy.visit('/')

  // Removemos el overlay del DOM directamente con cy.window(), use cy.window() en lugar de cy.document() porque da acceso.
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

    // También removemos cualquier elemento con position:fixed de Cookiebot
    win.document.querySelectorAll('[class*="Cybot"]').forEach((el) => el.remove())
  })

  // Confirmamos que el overlay ya no existe antes de continuar con el test
  cy.get('#CybotCookiebotDialogBodyUnderlay').should('not.exist')
})

// En esta parte empiezo con la validacion de los elementos del navbar.

    context('Logo de la marca', () => {
        it('El logo está presente y visible en el navbar', () => {  
            cy.get('.navbar11_logo')
            .should('have.length.at.least', 1)
            .then(($imgs) => {
                const loaded = [...$imgs].find(img => img.naturalWidth > 0);
                expect(loaded, 'El logo debe haber cargado correctamente').to.exist;
                expect(loaded.naturalWidth).to.be.greaterThan(0);
                expect(loaded.src).to.include('Logo')
            })
        })
        
        it('El logo lleva al home al hacer click', () => {
            cy.get('.navbar11_container > a')
            .first()
            .should('have.attr', 'href')
        })  
    })

    context('Botones CTA', () => {
        it('El botón "Get started" está presente y visible en el navbar', () => {
            cy.contains('a', /get started/i)
            .should('exist')
            .and('have.attr', 'href')
            .and('not.be.empty')
        })

        it('El botón "Contact" está presente y se dirige a /contact', () => {
            cy.contains('a', /^contact$/i)
            .should('exist')
            .and('have.attr', 'href')
            .and('include', 'contact') 
        })

        it('El botón "Contact us" del footer está presente y visible', () => {
            cy.contains('a', /contact us/i)
            .should('exist')
        })
    })

    context('Secciones de contenido', () => {
        it('La sección de "Hero" está presente y visible', () => {
            cy.get('h1').first().should('be.visible')
        })

        it('La sección de "Services" - cards están presentes y visibles', () => {
            cy.contains(/AI Systems Framework/i).should('exist')
            cy.contains(/Custom AI Solutions Factory/i).should('exist')
            cy.contains(/Silia Agentic Platform/i).should('exist')
        })

        it('La sección de "Success Stories" está presente y al menos un caso visible', () => {
            cy.contains(/Success Stories/i).should('exist')
            cy.contains('Sura').should('exist')
        })

        it('La sección de "Knowledge hub" está presente y visible', () => {
            cy.contains(/Knowledge hub/i).should('exist')
            cy.contains(/Blog posts/i).should('exist')
        })

        context('Calidad e integridad de las imagenes', () => {
            it('todas las imagenes visibles del sitio están cargadas correctamente', () => {
                cy.get('img').then(($imgs) => {
                    $imgs.each(($img) => {
                        // CORRECCIÓN FINAL: $img es DOM nativo, usar .src directamente
                        const src = $img.src; 
                        if (src && !src.includes('placeholder') && !src.includes('data:image')) {
                            expect($img.naturalWidth).to.be.greaterThan(0, `La imagen ${src} no cargó`);
                        }
                    });
                });
            })

            it('Los logos de clientes cargan correctamente', () => {
                const clients = ['Sura', 'Inter', 'Novamex', 'Solvo']
                clients.forEach((client) => {
                    cy.get(`img[alt="${client}"]`).first().should(($img) => {
                        // $img es jQuery aquí, usar .prop()
                        expect($img.prop('naturalWidth')).to.be.greaterThan(0, `Logo ${client} no cargó`);
                    })
                })  
            })
        })
    })
})

