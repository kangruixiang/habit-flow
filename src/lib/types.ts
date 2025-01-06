type Event = {
  id: number;
  eventName: string;
  eventLastDate: string;
  eventLastRelativeDate: string;
  eventPredictionDate: string;
  eventPredictionRelativeDate: string;
  averageOccurence: number;
};
export type History = {
  id: number;
  eventID: number;
  historyDate: string;
};
export type Props = {
  data: {
    events: Event[];
    histories: History[];
  },
  form?: {
    duplicate: boolean
  }
};

