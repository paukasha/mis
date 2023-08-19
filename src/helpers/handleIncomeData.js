 export const handleIncomeAppoints = (appoint) => {
  let { p_p, p_f_n, p_s_n, p_p_n, p_b_d, p_g, pat, p_c } = appoint;

  let keysList = Object.keys({ p_p, p_f_n, p_s_n, p_p_n, p_b_d, p_g, pat, p_c })

  let newGoodObj ={
    ...appoint,
    patient: {
      id: appoint.pat,
      p_p,
      p_f_n,
      p_s_n,
      p_p_n,
      p_b_d,
      p_g,
      p_c,
    },
  };

  for (let key in newGoodObj) {
    if (keysList.includes(key)) {
      delete newGoodObj[key]
    }
  }

  return newGoodObj
};