<template>
  <div class='base-btn date-btn'>
    <span>{{ day }}</span>
    <span class='date-delimiter'>{{ weekday }}</span>
    <span>{{ hour }}{{ colon }}{{ minutes }}</span>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      colon: ':',
      day: moment().format('D MMMM'),
      weekday: moment(this.date).format('dddd'),
      hour: '',
      minutes: '',
    }
  },
  mounted() {
    setInterval(() => {
      this.timerClock();
    }, 1000);
  },
  methods: {
    timerClock() {
      let date = moment().local();
      this.hour = moment(date).format('HH')
      this.minutes = moment(date).format('mm')
      this.seconds = moment(date).format('ss')
      this.colon === ':' ? this.colon = ' ' : this.colon = ':';
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

