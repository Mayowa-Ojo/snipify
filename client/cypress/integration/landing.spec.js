describe("Landing Page", () => {
   beforeEach(() => {
      cy.visit("/")
   })
   
   context("Location", () => {
      it("cy.url() - should get the current URL", () => {
         cy.url().should("eq", "http://localhost:8080/")
      })

      it("cy.hash() - get the current URL hash", () => {
         cy.hash().should("be.empty")
      })

      it("cy.location() - get window.location", () => {
         cy.location().should((location) => {
            expect(location.hash).to.be.empty
            expect(location.href).to.equal("http://localhost:8080/")
            expect(location.origin).to.equal("http://localhost:8080")
            expect(location.host).to.equal("localhost:8080")
            expect(location.hostname).to.equal("localhost")
            expect(location.port).to.equal("8080")
            expect(location.pathname).to.equal("/")
            expect(location.protocol).to.equal("http:")
         })
      })
   })

   context("Querying", () => {
      it("cy.root() - should query the root DOM element", () => {
         cy.root().should("match", "html")
      })

      it("cy.get() - query DOM elements", () => {
         cy.get("#app > main > div > section > div > a > button").should("be.visible")

         cy.get("#app > main > div > section > div > a")
           .should("have.attr", "href", "https://github.com/login/oauth/authorize?client_id=27ed0aef00574812f205")

         cy.get("#app > main > div > section > div > div")
           .should("have.class", "hero")
           .and("have.css", "background-image", "url(\"http://localhost:8080/img/feed.90ca0621.png\")")
      })
   })
})