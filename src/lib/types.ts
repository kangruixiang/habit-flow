type Event = {
  id: number;
  eventName: string;
  eventLastDate: string;
};
export type History = {
  id: number;
  eventID: number;
  historyDate: string;
};
export type BaseProp = {
  data: {
    events: Event[];
    histories: History[];
  };
};

