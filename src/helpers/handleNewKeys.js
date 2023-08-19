//  функции помогающие преобразовать данные к одному формату

const newKeys = {
  duration: 'dur',
  date_time_start: 'd_t_s',
  cabinet: 'cab',
  resource: 'rsr',
  comment: 'cmt'
};

const res = {
  res: 'rsr'
}

const patientForUpdateAppoint = {
  p_p: 'phone_number',
  p_f_n: 'first_name',
  p_s_n: 'surname',
  p_p_n: 'patronymic',
  p_b_d: 'birthday',
  p_g: 'gender'
}

const waitListNewKeys = {
  desired_date_time: 'd_t_s',
  patient_phone: 'p_p',
  resource: 'rsr',
  patient: 'pat',
  comment: 'cmt'
}

export const handleNewKeys = (oldObj, newObj) => {

  if (newObj === 'newKeys') newObj = newKeys;
  if (newObj === 'resToRsr') newObj = res;
  if (newObj === 'patientForUpdateAppoint')  newObj = patientForUpdateAppoint;
  if (newObj === 'waitListNewKeys')  newObj = waitListNewKeys;
  return Object.fromEntries(
  Object.entries(oldObj).map(
    ([key, val]) => [
      newObj[key] || key,
      typeof val === 'object' && val !== null ? handleNewKeys(val) : val
    ]
  )
)};

export const handleNewKeysRevert = (oldObj, newObj,) => {
  if (newObj === 'newKeys') newObj = newKeys;
  if (newObj === 'resToRsr') newObj = res;
  if (newObj === 'patientForUpdateAppoint')  newObj = patientForUpdateAppoint;
  if (newObj === 'waitListNewKeys')  newObj = waitListNewKeys;
  return Object.fromEntries(
  Object.entries(oldObj).map(
    ([key, val]) => {
      let keyByValue = Object.keys(newObj).find(k => newObj[k] === key)
      return [
      keyByValue || key,
      typeof val === 'object' && val !== null ? handleNewKeysRevert(val) : val
    ]}
  )
)};

export const handleArrayToNewKeys = (array) => {
  return array.map(el => handleNewKeys(el, newKeys))
}

export const handleArrayToNewKeysRevert = (array) => {
  return array.map(el => handleNewKeysRevert(el, newKeys))
}

export const resToSrs = (array) => {
  return array.map(el => handleNewKeys(el, res))
}
