import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useApplicationData() {
  // Initial state setup
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Function to update number of spots
  function updateSpots(dayName, days, appointments) {
    const day = days.find(d => d.name === dayName);
    let spots = 0;

    for (const id of day.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }

    const updatedDay = { ...day, spots };
    const updatedDays = days.map(d => d.name === dayName ? updatedDay : d);

    return updatedDays;
  }

  // Function to set the current day
  const setDay = day => setState({ ...state, day });

  // Fetching data from the API
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  // Function to book an interview
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        const updatedAppointments = {
          ...state.appointments,
          [id]: appointment
        };
        const updatedDays = updateSpots(state.day, state.days, updatedAppointments);

        setState(prev => ({
          ...prev,
          appointments: updatedAppointments,
          days: updatedDays
        }));
      });
  };

  // Function to cancel an interview
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const updatedAppointments = {
          ...state.appointments,
          [id]: { ...state.appointments[id], interview: null }
        };
        const updatedDays = updateSpots(state.day, state.days, updatedAppointments);

        setState(prev => ({
          ...prev,
          appointments: updatedAppointments,
          days: updatedDays
        }));
      });
  };

  // Return the state and action functions
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
