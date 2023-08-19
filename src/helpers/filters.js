export const isGridEmpty = (grid, selectedCheckboxes) => {
  // Показывать или нет данный грид. Например, если проставлена галочка "не отображать пустые", то не показываем данный грид
  let result = false;

  // Количество записей во всех колонках грида
  let gridAppointsLength = grid.columns
    .map((el) => {
      return el.appoints;
    })
    .filter((el) => el)
    .flat();

  let gridGraphLength = grid.columns
    .map((el) => {
      return el.graphs;
    })
    .filter((el) => el)
    .flat();

  if (
    // Если в гриде нет ни одной записи и проставлен чек "Не отображать пустые", то проставляем признак "не рисовать грид"
    !gridAppointsLength.length &&
    selectedCheckboxes.includes('notRenderEmpty') &&
    !gridGraphLength.length &&
    selectedCheckboxes.includes('notRenderEmpty')
  ) {
    result = true;
  }
  return result;
};
