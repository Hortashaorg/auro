type events = {
  "dialog-close": {
    value: boolean;
  };
  "form-clear": {
    value: boolean;
  };
  "form-error": {
    [field: string]: string;
  };
  "toast-show": {
    message: string;
    variant: "info" | "warning" | "success" | "danger";
    title: string;
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
