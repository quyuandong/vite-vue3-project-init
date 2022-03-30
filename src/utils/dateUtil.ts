/**
 * 独立的时间操作工具，方便后续切换到dayjs
 */
import moment, { MomentInput } from 'moment'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(date: MomentInput = undefined, format = DATE_TIME_FORMAT): string {
  return moment(date).format(format)
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format)
}

export const dateUtil = moment
