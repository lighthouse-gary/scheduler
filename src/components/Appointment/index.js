// index.js
import React from 'react';
import { useState } from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';
import Confirm from './Confirm';
import Status from './Status';
import Error from './Error';


export default function Appointment(props) {
  // Define mode constants
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const STATUS = "STATUS";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const [statusMessage, setStatusMessage] = useState("");


  // Determine the initial mode based on the presence of an interview
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    setStatusMessage("Saving");
    transition(STATUS);

    props.bookInterview(props.id, interview)
      .then(() => {
        setStatusMessage("");
        transition(SHOW);
      })
      .catch(error => {
        transition(ERROR_SAVE, true);
        console.error("Error saving the appointment:", error);
      });
  };

  const deleteInterview = () => {
    transition(CONFIRM);
  };

  const confirmDeletion = () => {
    setStatusMessage("Deleting");
    transition(STATUS, true);

    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
        setStatusMessage("");
      })
      .catch(error => {
        transition(ERROR_DELETE, true);
        console.error("Error deleting the appointment:", error);
      });
  };


  return (
    <article data-testid="appointment" className="appointment" >
      <Header time={props.time} />

      {/* Conditional rendering based on the mode */}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          deleteInterview={deleteInterview}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete the appointment?"
          onConfirm={confirmDeletion}
          onCancel={back}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === STATUS && (
        <Status message={statusMessage}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save the appointment."
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete the appointment."
          onClose={back}
        />
      )}
    </article>
  );
}