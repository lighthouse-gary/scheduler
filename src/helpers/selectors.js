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
  const dayObj = state.days.find(d => d.name === day);
  if (!dayObj) return [];

  // Directly use the interviewer IDs from the day object
  const interviewerIds = dayObj.interviewers;

  // Map these IDs to interviewer objects, filtering out any undefined values
  const interviewersForDay = interviewerIds
    .map(interviewerId => state.interviewers[interviewerId])
    .filter(interviewer => interviewer);

  return interviewersForDay;
}

