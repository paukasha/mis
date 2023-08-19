import { calendarDateFormat, compareDateOnDay } from "./momentHelp.js";

export const handleAppointFilter = (
  array,
  filterSysName,
  gridId,
  colDate,
  colId,
) => {
  return array.filter((item) => {
    if (filterSysName === "date") {
      return item.rsr == gridId && compareDateOnDay(item.d_t_s, colDate);
    }

    if (filterSysName === "spec") {
      return item.rsr == colId && compareDateOnDay(item.d_t_s, colDate);
    }

    if (filterSysName === "cabinet") {
      return item.cab == colId && compareDateOnDay(item.d_t_s, colDate);
    }
  });
};

export const calcGridIdAndColumnId = (payload, currentFilter) => {
  let gridId;
  let columnId;

  let { rsr, d_t_s, cab } = payload,
    formatD_t_s = calendarDateFormat(d_t_s);

  if (currentFilter === "date") {
    gridId = rsr;
    columnId = formatD_t_s;
  }

  if (currentFilter === "spec") {
    gridId = formatD_t_s;
    columnId = rsr;
  }

  if (currentFilter === "cabinet") {
    gridId = formatD_t_s;
    columnId = cab;
  }

  return {
    gridId,
    columnId,
  };
};

export const uniqueArray = (array, prop) => {
  return [...new Map([...array].map((v) => [v[prop], v])).values()];
};
