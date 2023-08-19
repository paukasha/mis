import moment from "moment";
export const calcTimeOfCoords = (date, topPx, baseDuration, workDayStart, topPaddng) => {
  //  64px - это верхняя строка грида, отнимаем чтобы рассчитать время с начала рабочего дня
  topPaddng = topPaddng || 64
  let actualTopPx = topPx - topPaddng,
    // интервал для округления времени начала приема
    interval = baseDuration * 60 * 1000,
    dayStart = moment(date).format(`YYYY-MM-DDT${workDayStart.start}`),
    // время по которому кликнули
    dateTime = moment(dayStart).add(actualTopPx, "minutes");
  //  округленное значение времени записи
  let date_time = moment(Math.floor(moment(dateTime) / interval) * interval);

  if (moment(date_time).isBefore(moment(dayStart))) {
    return dayStart
  }

  return date_time;
};