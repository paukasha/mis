<template>
  <div>
    <v-select :options='patients'
              :clearable='false'
              label='full_name_ab_bd'
              :filterable='false'
              @search='searchPatient'
              v-model='patient'
    >
      <template #selected-option>
        <span v-if='fullName'>{patient.full_name_ab_bd}</span>
        <span v-else>{{patient.surname}}</span>
      </template>
      <template #option="{ full_name_ab_bd, first_name, patronymic, surname, birthday, phone_number }">
            <span :title='showMoreInfo(first_name, patronymic, surname, birthday, phone_number)'
            >{{full_name_ab_bd}}</span>
      </template>
      <template #no-options>
        {{ $t("Поиск пациента")}}
      </template>
    </v-select>
    <span v-if='errorMessage'
          class='form__error'>
            {{errorMessage}}
      </span>
  </div>
</template>

<script>
import { searchPatient } from '../../mixins/SearchPatient.js';
export default {
  props: ['patientData', 'errorMessage', 'fullName'],
  mixins: [searchPatient],
  delimiters: ['#{', '}'],
  data() {
    return {
      patients: [],
      patient: '',
    };
  },
  mounted() {
    this.patient = this.patientData;
  },
  watch: {
    patient: {
      handler(val) {
        this.$nextTick(() => {
          this.$emit('update:patientData', val);
        });
      },
      deep: true,
    },
  },

  methods: {
    showMoreInfo(first_name, patronymic, surname, birthday, phone_number) {
      return `${surname} ${first_name} ${patronymic}, ${birthday}, ${
          phone_number || ''
      }`;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

