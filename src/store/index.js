import {appoint} from '@/views/AppointPage/appointStore.js';
import {panels} from './panels.js';
import {modal} from './modal.js';
import {
  createDatesList,
  createTimesList,
} from '../helpers/createDateAndTime.js';

import {baseFilters} from '../helpers/dicts.js';
import moment from 'moment/min/moment-with-locales';
import {uniqueArray} from '../helpers/handleAppointFilter.js';

import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router/index.js";

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    appoint,
    panels,
    modal,

  },
  state() {
    return {
      cabinets: [
        {
          "id": 86,
          "color": "#FFAA55",
          "name": "86",
        },
        {
          "id": 105,
          "color": "#00FF00",
          "name": "105",
        },
        {
          "id": 14,
          "color": "#8000FF",
          "name": "14",
        }, {
          "id": 217,
          "color": "#AA00AA",
          "name": "217",
        },
        {
          "id": 81,
          "color": "#D4EABF",
          "name": "81",
        }, {
          "id": 356,
          "color": "#AAFF55",
          "name": "356",
        }],
      specs: [
        {
          "id": 1,
          "first_name": "Алексей",
          "surname": "Иванов",
          "patronymic": "Петрович",
          "name": "Иванов А. П.",
          "base_duration": 120,
          "color": "",
        },
        {
          "id": 2,
          "first_name": "Анастасия",
          "surname": "Сидорова",
          "patronymic": "Борисовна",
          "name": "Сидорова А. Б.",
          "base_duration": 30,
          "color": "#0080FF",
        },
        {
          "id": 3,
          "first_name": "Артур",
          "surname": "Ивановский",
          "patronymic": "Сергеевич",
          "name": "Ивановский А.С.",
          "color": "#D5AA80",
          "base_duration": 10,
        },
      ],

      currentFilter:  {
        id: 1,
        name: 'По датам',
        sysName: 'date',
        filterName: 'Выберите специалистов',
        icon: 'calendar',
      },
      selectedFilterOptionsVuex: [
        {
          "id": 1,
          "first_name": "Алексей",
          "surname": "Иванов",
          "patronymic": "Петрович",
          "name": "Иванов А. П.",
          "base_duration": 120,
          "color": "",
        },
        {
          "id": 2,
          "first_name": "Анастасия",
          "surname": "Сидорова",
          "patronymic": "Борисовна",
          "name": "Сидорова А. Б.",
          "base_duration": 30,
          "color": "#0080FF",
        },
        {
          "id": 3,
          "first_name": "Артур",
          "surname": "Ивановский",
          "patronymic": "Сергеевич",
          "name": "Ивановский А.С.",
          "color": "#D5AA80",
          "base_duration": 10,
        },
      ],
      selectedCheckboxes: ['renderComment'],

      // календарь
      datesTimes: {
        start: moment().format(),
        end: moment().add(1, 'week').format(),
      },
      workDateTimeContinue: {start: "07:00", dayContinue: 13, end: "20:00"},
      times: [],

      anotherDate: '',
      anotherDates: [],

      waitList: [],
      affiliates: [
        {
          "id": 14,
          "name": "Медицинский центр №1",
        },
        {
          "id": 15,
          "name": "Второй филиал",
        }
      ],

      // isContextMenuOpened: false,
      legendsSettings: '',
      legends: [],

      departments: [{
        "id": 48,
        "address": "1",
        "phone_number": "1123456",
        "short_label": "1",
        "color": "#e932c2",
        "name": "Ленина"
      }, {
        "id": 49,
        "address": "Хабаровск1",
        "phone_number": "222",
        "short_label": "xdfhfdh",
        "color": "#3240e9",
        "name": "Истомина"
      }],

      serviceGroups: [
        {
          id: 235,
          name: "Гастроэнтерология детская",
          code: 1454,
        },
        {
          id: 240,
          name: "Кардиология",
          code: 1454,
        },
        {
          id: 243,
          name: "Гормоны",
          code: 1454,
        },
        {
          id: 247,
          name: "Медицинский массаж",
          code: 1454,
        }
      ],
      openedElements: [],

      snackbars: [],

      servicesTotalPayment: 0,
      materialsTotalPayment: 0,

      locale: '',
      theme: '',
      auth: ''
    };
  },
  actions: {
    async scrollToAnotherGrid(
      {commit, dispatch, rootGetters, state},
      parsedDate
    ) {
      let start,
        end = parsedDate,
        {gridList, anotherGridList} = state.appoint
        start = end;


      let grid = gridList.find(({id}) => id === start);

      if (!grid) {
        grid = anotherGridList.find(({id}) => id === start);
      }

      if (grid) {
        grid = document.querySelector(`#grid-${grid.id}`);
      } else {
        commit('createAnotherDates', {start, end});


           dispatch('appoint/getData', {start, end}).then(() => {
          });


        grid = document.querySelector(`#grid-${start}`);
        if (grid) {
          grid.scrollIntoView({behavior: 'smooth'});
        }
      }

      if (grid) {
        grid.scrollIntoView({behavior: 'smooth'});
      }

    },
    async getMountData({commit, state, dispatch}) {
      commit('updateTimes');
    },
  },

  mutations: {
    auth(state) {
      let auth = localStorage.getItem('auth')
      if (auth === null) {
        localStorage.setItem('auth', 'true')
      }
      auth = localStorage.getItem('auth')
      state.auth = auth === 'true' ? true : false

      if (!!auth) {
        router.push({name: 'auth'}).catch(e => console.log(e))
      }
    },
    updateTheme(state, payload) {
      let theme = ''
      if (!payload) {
        theme = localStorage.getItem('theme')
        if (!theme) {
          localStorage.setItem('theme', 'custom-light-theme')
        }
      }

      if (payload === 'light') {
        localStorage.setItem('theme', 'custom-light-theme')
      }

      if (payload === 'dark') {
        localStorage.setItem('theme', 'custom-dark-theme')
      }

      theme = localStorage.getItem('theme')
      state.theme = theme
      document.body.classList = []
      document.body.classList.add(theme)

    },
    updateTimes(state) {
      state.times = createTimesList(state.workDateTimeContinue);
    },
    openModal(state, modal) {
      state[modal] = true;
    },
    closeModal(state, modal) {
      state[modal] = true;
    },
    updateOpenedElements(state, modalName) {
      let zIndex = 250;
      let newList = [...state.openedElements];

      let element = newList.find((el) => el.modalName == modalName);
      const maxZIndex = Math.max(
        ...state.openedElements.map((obj) => obj.zIndex)
      );

      if (element) {
        state.openedElements = state.openedElements.map((el) => {
          if (el.modalName == element.modalName) {
            return {
              ...el,
              zIndex: maxZIndex + 1,
            };
          }
          return el;
        });
      } else {
        state.openedElements.push({
          modalName,
          zIndex: state.openedElements.length ? maxZIndex + 1 : zIndex,
        });
        state.openedElements = uniqueArray(state.openedElements, 'modalName');
      }
    },
    deleteLastOpenedElement(state, elName) {
      state.openedElements = state.openedElements.filter(
        (el) => el.modalName !== elName
      );
    },
    // обновить какие-то данные в стэйте
    updatePayload(state, {option, payload}) {
      state[option] = payload;
    },
    createDates(state, {option, start, end}) {
      state[option] = createDatesList(start, end);
    },
    createAnotherDates(state, {start, end}) {
      state.anotherDates = [
        ...state.anotherDates,
        ...createDatesList(start, end),
      ];
    },

    filterWaitList(state, id) {
      state.waitList = state.waitList.filter((el) => el.id !== id);
    },

    addSnackBar(state, payload) {
      state.snackbars.push(payload);
    },

  },
  getters: {

    dates(state) {
      let {start, end} = state.datesTimes;
      return createDatesList(start, end);
    },
    lastOpenedElement(state) {
      const maxZIndex = Math.max(
        ...state.openedElements.map((obj) => obj.zIndex)
      );

      return state.openedElements.length
        ? state.openedElements.find((obj) => obj.zIndex === maxZIndex)
        : '';
    },
    dropDownZIndex(state, getters) {
      let {lastOpenedElement} = getters;
      return {
        zIndex: lastOpenedElement ? lastOpenedElement.zIndex + 1 : 80,
      };
    },

    serviceMaterialsTotalSum(state) {
      return state.servicesTotalPayment + state.materialsTotalPayment;
    },
  },
});
