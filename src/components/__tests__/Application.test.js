// Application.test.js

import React from "react";
import axios from "axios";
import { findByText, render, cleanup, waitForElement, getByText, getAllByTestId, fireEvent, getByAltText, getByPlaceholderText, queryByText, queryByAltText, waitForElementToBeRemoved, prettyDOM } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
  
    // Ensure the initial data has loaded
    await findByText(container, "Archie Cohen");
  
    // Book a new appointment
    const firstAppointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(firstAppointment, "Add"));
    fireEvent.change(getByPlaceholderText(firstAppointment, /enter student name/i), { target: { value: "Siebs12" } });
    fireEvent.click(getByAltText(firstAppointment, "Sylvia Palmer"));
    fireEvent.click(getByText(firstAppointment, "Save"));
  
    // Wait for the saving process to complete
    await waitForElementToBeRemoved(() => getByText(firstAppointment, "Saving"));
  
    // Check that the new student name is displayed
    expect(getByText(firstAppointment, "Siebs12")).toBeInTheDocument();
  
    // Verify the spots remaining are updated correctly
    const mondayNode = getAllByTestId(container, "day").find(node => queryByText(node, "Monday"));
    expect(getByText(mondayNode, "no spots remaining")).toBeInTheDocument();
  });
  

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Find an existing interview with the text "Archie Cohen".
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 4. Click the "Delete" button on the appointment with "Archie Cohen".
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 5. Check that the confirmation message is displayed.
    expect(getByText(appointment, "Are you sure you want to delete the appointment?")).toBeInTheDocument();

    // 6. Click the "Confirm" button on the confirmation message.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 8. Wait until the "Add" button is displayed again in the spot previously occupied by "Archie Cohen's" appointment.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 9. Check that the DayListItem with the text "Monday" now has the text "1 spot remaining".

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // Render the Application
    const { container } = render(<Application />);

    // Wait for Data to Load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Find an Existing Interview
    const appointments = getAllByTestId(container, "appointment");
    const appointmentToEdit = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    // Initiate Edit: Click the "Edit" button
    fireEvent.click(getByAltText(appointmentToEdit, "Edit"));

    // Make Changes to the Interview
    fireEvent.change(getByPlaceholderText(appointmentToEdit, /enter student name/i), {
      target: { value: "Jason Siebert" }
    });
    fireEvent.click(getByAltText(appointmentToEdit, 'Sylvia Palmer'));

    // Save the Edited Interview
    fireEvent.click(getByText(appointmentToEdit, "Save"));

    // Wait for the Edit to Process
    await waitForElementToBeRemoved(() => getByText(appointmentToEdit, "Saving"));

    // Check that the Interview Has Been Updated
    expect(getByText(appointmentToEdit, "Jason Siebert")).toBeInTheDocument();

    // Verify Spots Remaining
    const mondayNode = getAllByTestId(container, "day").find(node => queryByText(node, "Monday"));
    expect(getByText(mondayNode, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {

    // 1. Render the Application and Load Data
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 2. Initiate Adding or Editing an Appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 3. Enter Appointment Details
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 4. Mock a Save Error
    axios.put.mockRejectedValueOnce();

    // 5. Attempt to Save the Appointment
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Verify Error Message Display
    await waitForElement(() => getByText(appointment, "Could not save the appointment."));
    expect(getByText(appointment, "Could not save the appointment.")).toBeInTheDocument();

    // 7. Close the Error Message (Optional)
    // If you want to test closing the error message
    fireEvent.click(getByAltText(appointment, "Close"));
    fireEvent.click(getByText(appointment, "Cancel"));
    await waitForElement(() => getByAltText(appointment, "Add"));
  });

  it("shows the delete error when failing to delete an appointment", async () => {

    // 1. Render the Application and Load Data
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 2. Find an Existing Appointment to Delete
    const appointments = getAllByTestId(container, "appointment");
    const appointmentToDelete = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    // 3. Initiate Deletion
    fireEvent.click(queryByAltText(appointmentToDelete, "Delete"));

    // 4. Mock a Delete Error
    axios.delete.mockRejectedValueOnce();

    // 5. Attempt to Confirm Deletion
    fireEvent.click(queryByText(appointmentToDelete, "Confirm"));

    // 6. Verify Error Message Display
    await waitForElement(() => getByText(appointmentToDelete, "Could not delete the appointment."));
    expect(getByText(appointmentToDelete, "Could not delete the appointment.")).toBeInTheDocument();

    // 7. Close the Error Message (Optional)
    // If you want to test closing the error message
    fireEvent.click(queryByAltText(appointmentToDelete, "Close"));
  });
});