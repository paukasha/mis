<template>
  <div >
    <div v-if="error">{{error}}</div>

    <div v-else class="patient">
      <span><b>Пациент:</b> {{patient.name}}</span>
      <span><b>Телефон:</b> {{patient.phone}}</span>
      <span><b>Email:</b> {{patient.email}}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export  default {
  name: 'PatientPage',
  data() {
    return {
      patient: '',
      error: ''
    }
  },
  mounted() {
  },
  watch: {
    '$route.params.id': {
       handler(val) {
         this.getById()
      }, immediate: true,

    }
  },
  methods: {
    async getById(d) {

       let id = this.$route.params.id

      try {
       let {data} = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
        this.patient = data
      } catch(e)  {
        this.error = 'Пациент не найден'
      }
    }
  }
}
</script>

<style>
.patient {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 20px;
}
</style>
