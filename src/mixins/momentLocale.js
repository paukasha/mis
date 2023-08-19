// import  'moment/min/moment-with-locales.min.js'
import moment from 'moment'
import Vue from "vue";
import {mapState} from "vuex";
import en from "moment/dist/locale/en-gb.js"
import ru from "moment/dist/locale/ru.js"

export const momentLocale = {
  computed: {
    ...mapState({
      locale: ({locale}) => locale
    })
  },
  watch: {
    locale: {
       handler(val) {
        if (val === 'ru') {
          moment.locale('ru')
          return
        }

        if (val === 'en') {
          moment.locale('en')
          this.$forceUpdate()
        }
      }, immediate: true,
    },
  }
}