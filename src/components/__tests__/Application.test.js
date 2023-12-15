// Application.test.js

import React from "react";
import { render, cleanup, waitForElement, getByText, getAllByTestId, fireEvent, getByAltText, getByPlaceholderText, prettyDOM } from "@testing-library/react";
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

    // Wait for the "Archie Cohen" text to appear in the document
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Use getAllByTestId to find all appointment elements
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    console.log(prettyDOM(appointment));
    // Test implementation here
    // This test will involve:
    // - Rendering the Application component
    // - Waiting for the data to load
    // - Simulating booking an interview
    // - Checking if the spots remaining for the first day have reduced by 1
  });
});