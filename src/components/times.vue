<template>
  <ValidationObserver ref='time' v-slot="{invalid, handleSubmit, errors}">
    <div class='form__content-spec-time'>
      <ValidationProvider name='Начало'
                          :rules='validationFn'
                          v-slot='{errors, name, validate}'>
        <input class="form-input form-input__time"
               v-maska
               data-maska="##:##"
               type='text'
               placeholder='__:__'
               v-model="timeStart"
               @keydown.esc.self='emitChange'
               @blur='changeEnd($event)'
               :readonly='readonly'
               :style='readonlyStyle'

        >
      </ValidationProvider>

      <span>-</span>

      <ValidationProvider name='Окончание'
                          :rules='!readonly ? {time: true, min_time:minValueForTimeEnd, required: true, } : {}'
                          v-slot='{errors, name, validate}'>
        <input class="form-input form-input__time"
               v-maska
               data-maska="##:##"
               placeholder='__:__'
               v-model="timeEnd"
               :readonly='readonly'
               @blur='changeDur($event)'
               :style='readonlyStyle'
        >
      </ValidationProvider>

      <ValidationProvider name='Длительность'
                          :rules='!readonly ? {min_value:5} : {}'
                          v-slot='{errors, dirty,}'>
        <input type='text'
               class='form-input form-input__time'
               v-model="duration"
               :readonly='readonly'
               @blur='changeEndTime($event)'
               :style='readonlyStyle'
        >
      </ValidationProvider>

      <span v-if='errors["Начало"] || errors["Окончание"]'
            class='form__error'
      >
                      {{errors["Начало"][0] ? errors["Начало"][0] : errors["Окончание"][0]? errors["Окончание"][0] : ''}}
                  </span>

      <span v-else-if='errors["Длительность"] '
            class='form__error'
            style='grid-column: 1/5'>
                        {{ errors["Длительность"][0] }}
                  </span>
    </div>
  </ValidationObserver>
</template>

<script>
import { timeFormat } from '../helpers/momentHelp.js';
import { mapState } from 'vuex';
import moment from 'moment'
// moment.locale(localStorage.getItem('locale'));
export default {
  name: 'Times',
  props: ['start', 'dur', 'readonly'],
  data() {
    return {
      duration: '',
      timeEnd: '',
      timeStart: '',
    };
  },
  mounted() {
    if (this.dur && this.start) {
      this.duration = this.dur;
      this.timeStart = moment(this.start).format('HH:mm');
      if (timeFormat(this.timeStart) === '00:00') {
        this.timeStart = '';
      }
      this.timeEnd = moment(this.start)
          .add(+this.duration, 'minutes')
          .format('HH:mm');
    }
  },
  computed: {
    minValueForTimeEnd() {
      return moment(this.start).add(5, 'minutes').format('HH:mm');
    },
    ...mapState({
      workDateTimeContinue: (state) => state.workDateTimeContinue,
    }),
    readonlyStyle() {
      if (this.readonly) {
        return {
          pointerEvents: 'none',
        };
      }

      return {};
    },
    validationFn() {
      return !this.readonly
          ? {
            time: true,
            required: true,
            min_start: this.workDateTimeContinue.start,
            max_end: this.workDateTimeContinue.end,
          }
          : {};
    },
  },
  methods: {
    changeDur(e) {
      let val = e.target.value.split(':');
      let timeEnd = moment(this.start).set({ hour: +val[0], minutes: +val[1] });
      let difference = moment(timeEnd).diff(moment(this.start), 'minutes');
      this.duration = Math.abs(difference);
      this.$emit('update:dur', this.duration);
    },
    changeEnd(e) {
      let val = e.target.value.split(':');
      let newTime = moment(this.start).set({ hour: +val[0], minutes: +val[1] });
      this.timeEnd = moment(newTime)
          .add(this.duration, 'minutes')
          .format('HH:mm');
      this.$emit('update:start', moment(newTime).format());
    },
    changeEndTime(e) {
      let val = +e.target.value;
      this.timeEnd = moment(this.start).add(val, 'minutes').format('HH:mm');
      this.duration = val;
      this.$emit('update:dur', val);
    },
    emitChange(e) {
      e.preventDefault();
      e.stopPropagation();
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

