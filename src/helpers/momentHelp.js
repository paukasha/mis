import moment from "moment";
export const dateFormat = (date) => {
 return moment(date).format('DD.MM.YYYY')
}

export const  timeFormat = (date) =>{
  return moment(date).format('HH:mm')
}

export const dateTimeFormat = (date) => {
  return moment(date).format('DD.MM.YYYY HH:mm')
}

export const dateTimeBackFormat = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm')
}

export const dateTimeFormatBack = (date) => {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss')
}

export const birthFormat = (date) => {
  return moment(date).format('MM-DD')
}

export const calendarDateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD')
}

export const compareDateOnDay = (firstDate, secondDate) => {
  return moment(firstDate).isSame(moment(secondDate), 'day')
}