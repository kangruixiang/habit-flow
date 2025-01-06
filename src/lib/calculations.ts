import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

import { desc, eq } from "drizzle-orm"

import { db } from "$lib/server/db"
import * as schema from "$lib/server/db/schema"
import type { History } from "@/types";

dayjs.extend(relativeTime);

export class EventDate {
  lastDate = ''
  lastRelative = ''
  averageOccurence = 0
  nextDate = ""
  nextRelative = ""

  constructor(historyList: History[]) {
    this.lastDate = historyList[0].historyDate
    this.lastRelative = this.getLastRelative(historyList) ?? ''
    this.averageOccurence = this.getAverageOccurence(historyList) ?? 0
    this.nextDate = this.getNextDate(historyList)
    this.nextRelative = this.getNextRelative(historyList)
  }

  reset(historyList: History[]) {
    this.lastDate = historyList[0].historyDate
    this.lastRelative = this.getLastRelative(historyList) ?? ''
    this.averageOccurence = this.getAverageOccurence(historyList) ?? 0
    this.nextDate = this.getNextDate(historyList)
    this.nextRelative = this.getNextRelative(historyList)
  }

  getLastRelative(historyList: History[]) {
    if (historyList.length == 0) {
      return;
    }
    if (historyList[0].historyDate == dayjs(new Date()).format('YYYY-MM-DD')) {
      const resultDate = 'today';
      return resultDate
    }
    const resultDate = dayjs().to(historyList[0].historyDate);
    return resultDate
  }

  getAverageOccurence(historyList: History[]) {
    if (historyList.length < 2) {
      return 0;
    }
    const differences: number[] = [];
    for (let i = 1; i < historyList.length; i++) {
      const day1 = dayjs(historyList[i].historyDate);
      const day2 = dayjs(historyList[i - 1].historyDate);
      const diff = Math.abs(day1.diff(day2, 'days'));
      differences.push(diff);
    }
    const totalDiff = differences.reduce((sum, diff) => sum + diff, 0);
    const averageDiff = Math.round(totalDiff / differences.length);
    return averageDiff;
  }

  getNextDate(historyList: History[]) {
    if (historyList.length == 0) {
      return "";
    }
    if (this.averageOccurence == 0) {
      return ""
    }
    const nextDate = dayjs(historyList[0].historyDate).add(this.averageOccurence, 'day').format("YYYY-MM-DD");
    return nextDate
  }

  getNextRelative(historyList: History[]) {
    if (historyList.length == 0) {
      return "";
    }
    this.getAverageOccurence(historyList);
    this.getNextDate(historyList);
    const nextOccurence = dayjs(this.nextDate).fromNow();
    return nextOccurence
  }
}

export async function updateEventColumns(eventID: number) {
  const histories = await db.select().from(schema.history).where(eq(schema.history.eventID, eventID)).orderBy(desc(schema.history.historyDate))

  if (histories.length == 0) {
    console.log('no history')
    return
  }

  const newEvent = new EventDate(histories)

  await db.update(schema.events).set({
    eventLastDate: newEvent.lastDate,
    eventLastRelativeDate: newEvent.lastRelative,
    eventPredictionDate: newEvent.nextDate,
    eventPredictionRelativeDate: newEvent.nextRelative,
    eventAverageOccurence: newEvent.averageOccurence
  }).where(eq(schema.events.id, eventID))
}
