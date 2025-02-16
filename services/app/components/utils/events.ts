type events = {
  "close-dialog": {
    value: boolean;
  };
  "clear-form": {
    value: boolean;
  };
  "form-error": {
    [field: string]: string;
  };
};

export const createEvents = <T extends keyof events>(
  events: {
    name: T;
    values: events[T];
  }[],
) => {
  const parsedEvents: Record<string, unknown> = {};
  for (const event of events) {
    parsedEvents[event.name] = event.values;
  }

  return JSON.stringify(parsedEvents);
};
