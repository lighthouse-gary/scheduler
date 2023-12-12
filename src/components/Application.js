// Application.js

import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import "components/Application.scss";


export default function Application() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState({
          ...state,
          appointments
        });
      })
      .catch(error => {
        // Error handling code
        console.error("Error canceling the appointment:", error);
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        // Update the local state after successful deletion
        const appointment = {
          ...state.appointments[id],
          interview: null
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState(prev => ({
          ...prev,
          appointments
        }));
      })
      .catch(error => {
        // Handle any errors here
        console.error("Error canceling the appointment:", error);
      });
  }



  useEffect(() => {
    // Make requests to /api/days and /api/appointments using Promise.all
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }));
      // console.log('days.data: ', days, 'appointment.data: ', appointments.data, 'interviewers.data: ', interviewers.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);


  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  // Transform interview data before passing it to Appointment component
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />      </section>
      <section className="schedule">
        {schedule}
        <Appointment time="5pm" />
      </section>
    </main>
  );
};
