describe("App", () => {
   beforeEach(() => {
      cy.visit("/")
   })

   context("Window", () => {
      it("cy.window() - should get the global window object", () => {
         cy.window().should("have.property", "top")
      })

      it("cy.document() - should get the document object", () => {
         cy.document().should("have.property", "charset").and("eq", "UTF-8")
      })

      it("cy.title() - should get the page title", () => {
         cy.title().should("include", "snipify")
      })
   })
})