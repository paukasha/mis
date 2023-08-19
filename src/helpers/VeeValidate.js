import Vue from "vue";
import moment from "moment";
import  {
  extend,
  localize,
  ValidationObserver,
  ValidationProvider,
} from "../libs/vee-validate.js";
import ru from "../libs/ru.js";


Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);


// localize("en", ru);
let locale = localStorage.getItem('locale')
if (locale == 'ru') {
  localize("en", ru);
}

extend("time", {
  message: "Неверный формат времени",
  validate: (value) => {
    let time = value.split(":").join(""),
    hour = String(time).substring(0,2),
    minutes = String(time).substring(2, 4);

    if ((+hour < 24 && +minutes < 60) && String(time).length == 4) {
      return true
    }
  },
});

extend("min_time", {
  validate: (value, { min }) => {
    let time = value.split(":").join(""),
      minTime = min.split(":").join("");
      
    return time >= minTime;
  },
  params: ["min"],
  message: (fieldName, placeholders) => {
    return `Поле ${fieldName} - мин. значение ${placeholders.min || ''}`;
  },
});


extend("min_start", {
  validate: (value, { min }) => {
    let time = moment(value, "HH:mm"),
      minTime = moment(min, "HH:mm");
     return moment(minTime).isSameOrBefore(moment(time), 'hour')
  },
  params: ["min"],
  message: (fieldName, placeholders) => {
    return `Запись не может быть раньше ${placeholders.min}`;
  },
});


extend("max_end", {
  validate: (value, { max }) => {
    let time = moment(value, "HH:mm"),
      maxTime = moment(max, "HH:mm");
     return moment(time).isSameOrBefore(moment(maxTime))
  },
  params: ["max"],
  message: (fieldName, placeholders) => {
    return `Запись не может быть позже ${placeholders.max}`;
  },
});



extend("integer_or_decimal", {
  validate: (value) => {
     return typeof value === 'number'
  },
  message: (fieldName) => {
    return `Поле ${fieldName} должно быть целым или десятичным числом`;
  },
});

extend("date_time_format", {
  message: "Неверный формат даты",
  validate: (value, ) => {
    return  moment(value, 'DD.MM.YYYY', true).isValid() && moment(value, 'HH:mm', true).isValid()
  },
});




