// appointments.spec.js

describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an appointment", () => {
    cy.get("[alt=Add]")
      .first()
      .click();
    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer'")
      .click();
    cy.contains("Save")
      .click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // 1. Click the edit button for the existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });

    // 2. Clear and type the new student name
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Jason Siebert");

    // 3. Select the new interviewer
    cy.get("[alt='Tori Malcolm']")
      .click();

    // 4. Save the interview
    cy.contains("Save")
      .click();

    // 5. Check that the student and interviewer names are updated
    cy.contains(".appointment__card--show", "Jason Siebert");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    // 1. Click the delete button for the existing appointment
    cy.get("[alt=Delete]")
      .first()
      .click({ force: true });

    // 2. Confirm the deletion
    cy.contains("Confirm")
      .click();

    // 3. Check that the deleting message appears
    cy.contains("Deleting").should('be.visible');

    // 4. Wait for the deleting indicator to disappear
    cy.contains("Deleting").should('not.exist');

    // 5. Check that the element with the appointment information is not present
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should('not.exist');
  });
});