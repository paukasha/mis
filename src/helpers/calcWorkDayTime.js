export const calcWorkDayTime = (start, dayContinue) => {
  let startToNumber = +start.value.split(":")[0],
    // целых рабочих часов может быть только 23
    hoursInDay = 23,
    possibleHours = 0,
    // сутки не могут превышать начало раб дня + количество раб часов
    totalContinueValidate = hoursInDay - (startToNumber + +dayContinue.value);

  if (totalContinueValidate < 0) {
    possibleHours = hoursInDay - startToNumber;
  } else {
    possibleHours = +dayContinue.value;
  }

  return {
    possibleHours,
  };
};
