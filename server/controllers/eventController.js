export let events = [];

export function createEvent(eventData) {
  events.push(eventData);
  return eventData;
}

export function resetEvents() {
  events = [];
}