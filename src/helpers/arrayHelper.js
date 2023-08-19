export const changeItemOnIdInList = (list, item) => {
  return list.map(el => {
    return el.id == item.id ? {...item} : {...el}
  })
}