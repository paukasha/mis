export const groupMessages = (messages) => {

  /* Группировка сообщений в диалоги. На выходе получаем список:
  *  [{grouper: number, patient: ...}], где
  *  grouper - уникальный идентификатор диалога (например p_45556 -> пациент с идом 45556 и т.д,
  *   есть разные вариации составных частей группера например whatsapp_79963896563)
  * */

  // каждый элемент имеет следующий вид: {number1: [array], number2: [array} где array:
  // array = [{grouper: number, patient: ...}]
  // поэтому для чтения элемента нужно обратиться array[0].grouper, array[0].patient и т.д

  if (!messages.length) return {}

  return messages.reduce((groups, item) => {
    const group = (groups[item.grouper] || []);
    group.push(item);
    groups[item.grouper] = group;
    return groups;
  }, {});
}

