import moment from "moment";

export const createDatesList = (startDate, endDate) => {
  // возвращает массив выбранного диапазона дат
  let now = moment(startDate),
    later = moment(endDate),
    dates = [];

  while (now.isSameOrBefore(later)) {
    dates.push({
      id: moment(now).format('YYYY-MM-DD'),
      day: now.format('dddd,'),
      name: now.format('DD MMMM'),
      weekdayContent:
        now.format('dddd').charAt(0).toUpperCase() +
        now.format('dddd').slice(1),
    });

    now.add(1, 'days');
  }
  return dates;
};

export const createTimesList = ({ start, dayContinue }) => {
  // возвращаем массив выбранного диапазона времени
  let startTimeHours = +start.split(':')[0],
    endTimeHours = startTimeHours + +dayContinue - 1,
    times = [];
  for (let i = startTimeHours; i <= endTimeHours; i++) {
    let hour = i;
    times.push({ id: `${hour}:00`, hour: `${hour}:00` });
  }
  return times;
};
