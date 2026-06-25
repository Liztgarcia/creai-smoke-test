// Test case 1: TC-01 Validación de carga de la página principal
describe('TC-01 | Carga de la página principal', () => {
    const consoleErrors = []
    
    beforeEach(() => {
        cy.on('window:before:load', (win) => {
            cy.stub(win.console, 'error').callsFake((...args) => {
                const msg = args.join(' ')
                const isThirdParty = 
                    msg.includes('googletagmanager') || 
                    msg.includes('google-analytics') || 
                    msg.includes('website-files') || 
                    msg.includes('gtm')
                if (!isThirdParty) {
                    consoleErrors.push(msg)
                }
            })
        })
    })

    it('Regresa HTTP 200 al hacer el request a la homepage', () => {
        cy.request({
            method: 'GET',
            url: 'https://www.creai.mx',
            failOnStatusCode: true,  
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    })

    it('Carga la página principal y verifica que el nav esté visible', () => {
        cy.visitHomepage()
    })

    it('La página carga y el DOM está disponible', () => {
        cy.visit('/')
        cy.dismissCookies()
        cy.title().should('include', 'Creai')
    })

    it(('El meta title y description están presentes y no vacíos'), () => {
        cy.visit('/')
        cy.dismissCookies()
        cy.document().then((doc) => {
            const title = doc.title
            expect(title).to.exist.and.to.not.be.empty
            expect(title).to.include('Creai')

            const metaDescription = doc.querySelector('meta[name="description"]')
            expect(metaDescription).to.exist
            expect(metaDescription.getAttribute('content')).to.exist.and.to.not.be.empty
        })
    })

    it('No hay errores de consola en la página principal', () => {
        cy.visit('/')
        cy.dismissCookies() 
        cy.wait(3000) // Dar tiempo a que los scripts carguen y no aparezcan errores
        cy.wrap(consoleErrors).should('be.empty')
    })

    it('Tiempo de carga de la página principal es menor a 5 segundos', () => {
        const start = Date.now()
        cy.visit('/').then(() => {
            const elapsed = Date.now() - start
            expect(elapsed).to.be.lessThan(5000)
        })
    })
})