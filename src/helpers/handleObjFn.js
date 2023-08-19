export const filterObjKeysByList = (list, obj) => {
  return Object.entries(obj)
    .reduce((acc, elm) => {
      const [k, v] = elm
      if (list.includes(k)) {
        acc[k] = v
      }
      return acc
    }, {})
}

export const sortObjKeys = (object) => {
  return Object
    .keys(object)
    .sort()
    .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
      },
      {}
    );
}