export const CalendarMixin = {
  delimiters: ['#{', '}'],
  data() {
    return {
      masks: {
        input: 'DD.MM.YYYY HH:mm',
      },
      isDateTimeValid: true,
    };
  },
  watch: {
    date_time(val) {
      let date = moment(val).format('DD-MM-YYYY-HH-mm').split('-').join(''),
        day = date.substr(0, 2),
        month = date.substring(2, 4),
        year = date.substring(4, 8),
        hour = date.substring(8, 10),
        minutes = date.substring(10, 12);

      let dateFormatted = `${year}-${month}-${day} ${hour}:${minutes}`;
      if (!moment(dateFormatted, 'YYYY-MM-DD HH:mm', true).isValid()) {
        this.isDateTimeValid = false;
      } else {
        this.isDateTimeValid = true;
      }
    },
  },
  methods: {
    selectText(e) {
      e.target.select();
    },
    openPopover() {
      this.$refs.calendarVue.showPopover();
    },
    closeDatePicker(e) {
      this.$refs.calendarVue.hidePopover();
      this.$refs.calendarVue.$el.querySelector('input').blur();

      let date = e.target.value,
        day = date.substr(0, 2),
        month = date.substring(3, 5),
        year = date.substring(6, 10),
        hour = date.substring(11, 13),
        minutes = date.substring(14, 16);

      let dateFormatted = `${day}-${month}-${year} ${hour}:${minutes}`;

      if (!moment(dateFormatted, 'DD-MM-YYYY HH:mm', true).isValid()) {
        this.isDateTimeValid = false;
      } else {
        this.isDateTimeValid = true;
      }
    },
  },
};
