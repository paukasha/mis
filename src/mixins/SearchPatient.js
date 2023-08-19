import axios from "axios";

export const searchPatient = {
  data() {
    return {
      patients: [],
      patientNotFound: '',
      patientsRu: [
        {
          gender: 'M',
          full_name_ab_bd: 'Иванов И. И',
          first_name: 'Иван',
          surname: 'Иванов',
          patronymic: 'Иванович',
          phone_number: '78787',
          birthday: '2000-12-04'
        },
        {
          gender: 'M',
          full_name_ab_bd: 'Сидоров А. Ф',
          first_name: 'Антон',
          surname: 'Сидоров',
          patronymic: 'Федорович',
          phone_number: '9995555',
          birthday: '1995-07-05'
        },
        {
          gender: 'Ж',
          full_name_ab_bd: 'Соловьева И. П.',
          first_name: 'Ирина',
          surname: 'Соловьева',
          patronymic: 'Павловна',
          phone_number: '987456',
          birthday: '1990-08-21'
        }
      ]
    }
  },
  methods: {
     searchPatient(search, loading) {
      let request = ''
      clearTimeout(this.timer)
      if (!search) loading(false)
      if (search.length) {
        loading(true)
        this.timer = setTimeout(() => {
          request =  axios.get('https://jsonplaceholder.typicode.com/users/',)
            .then(res => {
            clearTimeout(this.timer)
            if (!res.data.length) {
              this.patientNotFound = search
            }
            this.patients = this.patientsRu.filter(el => el.surname.toLowerCase().includes(search.toLowerCase()))
            loading(false)
          }).catch(loading(false))
        }, 1500)

      }

      return new Promise((resolve) => {
        resolve(request)
      })
    },
  }
}