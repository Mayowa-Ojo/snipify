describe("Home Page - snips", () => {
   beforeEach(() => {
      localStorage.setItem("user", JSON.stringify({
         id: "2cf2785f-3814-42f1-826d-709c6a9da4ff",
         token: Cypress.env("ACCESS_TOKEN")
      }))

      cy.visit("/snips")
   })

   context("Location", () => {
      it("cy.url() - should get the current URL", () => {
         cy.url().should("eq", "http://localhost:8080/snips")
      })

      it("cy.location() - get window.location", () => {
         cy.location().should((location) => {
            expect(location.href).to.equal("http://localhost:8080/snips")
            expect(location.pathname).to.equal("/snips")
         })
      })
   })

   context("Actions", () => {
      it(".focus() - should focus on search input", () => {
         cy.get("input[type='text']")
           .should("have.attr", "placeholder", "Search by collection, description, or title...")
           .focus()
           .should("have.css", "background-color", "rgb(243, 244, 246)")
           .parent()
           .next()
           .should("have.class", "search-box__overlay")
      })

      it(".blur() - should clear input field and blur on keypress [esc]", () => {
         cy.get("input[type='text']")
           .type("optional chaining")
           .should("have.value", "optional chaining")
           .clear()
           .should("have.value", "")
           .type("{esc}")
           .should("have.css", "background-color", "rgb(255, 255, 255)")
      })

      it(".type() - should type into the input field", () => {
         cy.get("input[type='text']")
           .type("optional chaining")
           .should("have.value", "optional chaining")
      })
   })

   context("Modals", () => {
      it("cy.click() - should open modal when button is clicked", () => {
         cy.get("#app > main > div > div > header > span")
           .click()
           .get("#modal-target .wrapper")
           .should("be.visible")
      })
   })

   context("Local Storage", () => {
      it("cy.clearLocalStorage - should clear data in local storage", () => {
         cy.clearLocalStorage()
           .should(ls => {
              expect(ls.getItem("user")).to.be.null
           })
      })
   })
})