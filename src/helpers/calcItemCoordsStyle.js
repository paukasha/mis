import moment from "moment";
export const calcItemCoordsStyle = (
  dateTime,
  duration,
  workDayTimeContinue
) => {
  // возвращает местоположение графика и записи

  // высота первой строки грида
  let firstGridRow = 64;

  // начало дня
  let parsedDate = workDayTimeContinue.start.split(':');
  let dayStart = moment(dateTime)
    .set({ hour: +parsedDate[0], minutes: +parsedDate[1] })
    .format();

  //  сколько минут прошло с начала рабочего дня до начала записи
  let diffTime = Math.abs(moment(dateTime).diff(dayStart, 'minutes'));

  return {
    top: `${firstGridRow + diffTime}px`,
    height: `${duration}px`,
  };
};

export const calcGridStyle = (columns, workDayContinue, colWidth) => {
  // 32 - паддинги по бокам класса 'container', 40 - первая колонка грида
  let content = document.querySelector('.content');
  let gridContainerWidth = content.clientWidth - 32 - 40,
    // сколько колонок влезет в ширину контейнера
    columnsInWidth = !colWidth
      ? 'auto'
      : Math.floor(gridContainerWidth / colWidth),
    gridWidth = 0;

  if (columns.length < columnsInWidth) {
    //2 - 2px бордер
    gridWidth = columns.length * colWidth + 40 + 2;
  } else {
    gridWidth = columnsInWidth * colWidth + 40 + 2;
  }

  if (!colWidth) gridWidth = gridContainerWidth;

  return {
    grid: {
      maxWidth: `${gridWidth}px`,
    },
    columnsGrid: {
      gridTemplateColumns: !colWidth
        ? `repeat(${columns.length},  1fr)`
        : `repeat(${columns.length},  ${colWidth}px)`,
      gridTemplateRows: `64px repeat(${+workDayContinue}, 60px)`,
      gridRow: `span ${+workDayContinue + 1}`,
    },
    rowsGridLength: +workDayContinue,
    gridWidth: gridWidth,
    columnsInWidth: columnsInWidth,
  };
};

export const calcGridItemCoords = (dateTime, workDayTimeContinue) => {
  // возвращает местоположение группы в гриде реабилитации

  let firstGridRow = 20;
  // начало дня
  let parsedDate = workDayTimeContinue.start.split(':');
  let dayStart = moment(dateTime)
    .set({ hour: +parsedDate[0], minutes: +parsedDate[1] })
    .format();

  //  сколько минут прошло с начала рабочего дня до начала записи
  let diffTime = Math.abs(moment(dateTime).diff(dayStart, 'minutes'));

  return {
    top: `${firstGridRow + diffTime}px`,
  };
};
