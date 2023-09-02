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
          birthday: '04.10.2000'
        },
        {
          gender: 'M',
          full_name_ab_bd: 'Петров А. Ф',
          first_name: 'Антон',
          surname: 'Петров',
          patronymic: 'Федорович',
          phone_number: '9995555',
          birthday: '05.07.1995'
        },
        {
          gender: 'Ж',
          full_name_ab_bd: 'Сидоров И. П.',
          first_name: 'Андрей',
          surname: 'Сидоров',
          patronymic: 'Павлович',
          phone_number: '987456',
          birthday: '21.12.1990'
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