// index.js

import React from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';


export default function Appointment(props) {
  // Define mode constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  // Determine the initial mode based on the presence of an interview
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(error => {
        // Handle errors, perhaps transition to an error mode
      });
  };


  return (
    <article className="appointment">
      <Header time={props.time} />

      {/* Conditional rendering based on the mode */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers} // Set interviewers prop to an empty array for now
          onCancel={back} // Add onCancel prop to go back when canceled
          onSave={save} // Add onSave prop to save the form when submitted
        />
      )}
    </article>
  );
}