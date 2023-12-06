// src/helpers/selectors.js

export function getAppointmentsForDay(state, day) {
  const found = state.days.find(d => day === d.name);

  if (state.days.length === 0 || found === undefined) return [];

  return found.appointments.map(id => state.appointments[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const { student, interviewer } = interview;
  const interviewerData = state.interviewers[interviewer];

  return {
    student,
    interviewer: interviewerData
  };
}

export function getInterviewersForDay(state, day) {
  const found = state.days.find(d => day === d.name);

  if (state.days.length === 0 || found === undefined) return [];

  const interviewersForDay = found.appointments
    .map(id => state.appointments[id])
    .filter(appointment => appointment.interview && appointment.interview.interviewer);

  return interviewersForDay.map(appointment => state.interviewers[appointment.interview.interviewer]);
}