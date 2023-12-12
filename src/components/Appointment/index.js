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

  const onSave = function (student, interviewer) {
    console.log(student, interviewer);

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
          onSave={onSave} // Add onSave prop to save the form when submitted
        />
      )}
    </article>
  );
}