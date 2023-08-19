<template>
  <div class="content content-container">
    <h2 class="py-4">Список пациентов</h2>
    <v-data-table
        :headers="headers"
        :items="patients"

        hide-default-footer
        class="elevation-1"
    ></v-data-table>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Patients',
  data() {
    return {
      patients: [],
      headers: [{
        text: 'ФИО',
        align: 'start',
        sortable: false,
        value: 'fio',
      },
        {text: 'Адрес', value: 'address'},
        {text: 'Телефон', value: 'tel'}
      ]
    }
  },
  mounted() {
    axios.get('https://jsonplaceholder.typicode.com/users').then(res => {
      this.patients = res.data

      this.patients = this.patients.map(el => {
        return {
          address: `г. ${el.address.city}, ул. ${el.address.street}`,
          fio: el.name,
          tel: el.phone
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>

</style>