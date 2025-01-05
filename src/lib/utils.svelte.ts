import type { History } from "@/types";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);

export class EventDate {
  lastOccurence = $state('')
  averageOccurence = $state(0)
  nextDate = $state(dayjs(new Date))
  nextRelative = $state("")

  constructor(historyList: History[]) {
    this.lastOccurence = this.getLastOccurence(historyList) ?? ''
    this.averageOccurence = this.getAverageOccurence(historyList)
    this.nextDate = this.getNextDate(historyList)
    this.nextRelative = this.getNextRelative(historyList)
  }

  reset(historyList: History[]) {
    this.lastOccurence = this.getLastOccurence(historyList) ?? ''
    this.averageOccurence = this.getAverageOccurence(historyList)
    this.nextDate = this.getNextDate(historyList)
    this.nextRelative = this.getNextRelative(historyList)
  }

  getLastOccurence(historyList: History[]) {
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
    if (historyList.length == 0) {
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
      return dayjs(new Date);
    }
    const nextDate = dayjs(historyList[0].historyDate).add(this.averageOccurence, 'day');
    return nextDate
  }

  getNextRelative(historyList: History[]) {
    if (historyList.length == 0) {
      return "";
    }
    this.getAverageOccurence(historyList);
    this.getNextDate(historyList);
    const nextOccurence = this.nextDate.fromNow();
    return nextOccurence
  }
}
