import {createTimesList} from '../../helpers/createDateAndTime.js';
// import {
//   appointApi,
//   appointTaskApi,
//   legendApi,
// } from '../../api/appointVue.js';
import {calendarDateFormat, dateFormat, dateTimeFormatBack} from '@/helpers/momentHelp.js';
import {
  handleArrayToNewKeys,
  handleNewKeys,
  resToSrs,
} from '@/helpers/handleNewKeys.js';
import {
  handleAppointFilter,
  uniqueArray,
} from '@/helpers/handleAppointFilter.js';
import {isGridEmpty} from '@/helpers/filters.js';
import {handleIncomeAppoints} from '@/helpers/handleIncomeData.js';
import {router} from '@/router/index.js';
import {calcTimeOfCoords} from '@/helpers/calcTimeOfCoords.js';
import {changeItemOnIdInList} from '@/helpers/arrayHelper.js';
import {calcWorkDayTime} from '../../helpers/calcWorkDayTime.js';

import moment from'moment'
import {appointsList} from "@/helpers/Appoints.js";

export const appoint = {
  namespaced: true,
  state() {
    return {
      appointTypes: [
        {
          "id": 8,
          "name": "Триполяр",
          "sys_name": "tripolyar",
          "color": "#CC9933",
        },
        {
          "id": 9,
          "name": "Сургидрон",
          "sys_name": "surgidron",
          "color": "#CCCCFF",
        },
        {
          "id": 10,
          "name": "LPG",
          "sys_name": "LGP",
          "color": "#00FFFF",
        },
        {
          "id": 11,
          "name": "Плазма",
          "sys_name": "plasma",
          "color": "#99CC33",
        },
        {
          "id": 12,
          "name": "Татуаж",
          "sys_name": "tatu",
          "color": "#336666",
        },
        {
          "id": 13,
          "name": "Микротоки",
          "sys_name": "microtok",
          "color": "#339966",
        },
        {
          "id": 14,
          "name": "МДО",
          "sys_name": "mdo",
          "color": "#9900CC",
        },
        {
          "id": 15,
          "name": "ОМС",
          "sys_name": "oms",
          "color": "#339966",
        }
      ],
      appointStatus: [
        {
          "id": 1,
          "name": "Новая",
          "sys_name": "new"
        },
        {
          "id": 2,
          "name": "Удалена",
          "sys_name": "rejected"
        },
        {
          "id": 3,
          "name": "Подтверждена",
          "sys_name": "approved"
        },
        {
          "id": 4,
          "name": "Явился",
          "sys_name": "came"
        },
        {
          "id": 5,
          "name": "Отказался",
          "sys_name": "cancel"
        },
        {
          "id": 6,
          "name": "Не явился",
          "sys_name": "patient_doesnt_come"
        },
        {
          "id": 7,
          "name": "Приглашен",
          "sys_name": "invited"
        },
        {
          "id": 8,
          "name": "Прием окончен",
          "sys_name": "done"
        }
      ],
      receptionTypes: [
        {
          "id": 1,
          "sys_name": "Платный",
          "name": "Платный"
        },
        {
          "id": 2,
          "sys_name": "telemed",
          "name": "Онлайн-прием"
        },
        {
          "id": 3,
          "sys_name": "out",
          "name": "Выезд"
        },
        {
          "id": 4,
          "sys_name": "фыв",
          "name": "Новый"
        }
      ],
      appointSources: [
        {
          "id": 38,
          "name": "Регистратура",
        },
        {
          "id": 39,
          "name": "Врач",
        },
        {
          "id": 40,
          "name": "Интернет-сайт",
        }
      ],
      patientCategories: [
        {
          "id": 43,
          "name": "Супер вип",
          "color": "#55AA00",
        },
        {
          "id": 44,
          "name": "Еще один вип",
          "color": "#AA55FF",
        },
        {
          "id": 45,
          "name": "456",
          "color": "red",
        }
      ],
      rejectionReasons: [
        {
          "id": 1,
          "name": "Прочее",
        },
        {
          "id": 2,
          "name": "Отказ пациента",
        },
        {
          "id": 3,
          "name": "Пациент не явился",
          "sys_name": "patient_doesnt_come"
        },
      ],
      advertOffers: [
        {
          "id": 1,
          "name": "скидка 30% на первый гипс",
        },
        {
          "id": 2,
          "name": "Новая акция",
        }
      ],
      // graphAppointTypes: [],
      presets: [
        {
          "id": 18,
          "view_name": "byCabinets",
          "name": "Важные кабинеты",
          "items": [
            "86",
            "105",
          ]
        },
        {
          "id": 21,
          "view_name": "byResource",
          "name": "Глав врач",
          "items": [
            "1"
          ]
        },
        {
          "id": 21,
          "view_name": "byDates",
          "name": "Терапевты",
          "items": [
            "2"
          ]
        }
      ],

      legends: [],
      legendsSettings: "appointment_type",

      gridList: [],
      anotherGridList: [],

      // workDateTimeContinue: {},

      appoints: [],
      graphs: [],
      tasks: [{
        "id": 3221,
        "creation_date": "2023-08-19T16:43:24",
        "d_t_s": '2023-08-20T14:30:20',
        "dur": 20,
        "cmt": "v v v vvvvv",
        "deleted": false,
        "hospital": 14,
        "affiliate": 14,
        "rsr": 2,
        "cab": 86,
        "owner": 241
      }, {
        "id": 12,
        "creation_date": "2023-08-19T16:43:24",
        "d_t_s": '2023-08-22T14:30:20',
        "dur": 25,
        "cmt": "Задача для мед сестры",
        "deleted": false,
        "hospital": 14,
        "affiliate": 14,
        "rsr": 1,
        "cab": 105,
        "owner": 241
      }],

      operations: [],
      isGetDataLoading: false,

      appointError: '',

      ctxMenu: {
        isVisible: false,
        top: '',
        left: 0,
        copyMethod: '',
      },

      isAppointModalDataChanged: false,
    };
  },
  actions: {
    updateGridList(
      {state, commit, rootState, getters, rootGetters},
      anotherDate
    ) {
      let {currentFilter, selectedCheckboxes, anotherDates, specs, dates} =
          rootState,
        {columns, gridCollection} = getters;

      if (anotherDate) {
        dates = anotherDates;
        currentFilter = {sysName: 'spec'};
      }


      gridCollection = gridCollection.map((grid) => {
        let gridEl = {
          ...grid,
          columns: columns.map((col) => {
            let date = currentFilter.sysName === 'date' ? col.id : grid.id;
            let gridId = grid.id;
            let baseDuration =
                currentFilter.sysName === 'cabinet'
                  ? 30
                  : currentFilter.sysName === 'date'
                    ? grid.base_duration
                    : col.base_duration,
              rsr =
                currentFilter.sysName === 'date'
                  ? grid.id
                  : currentFilter.sysName === 'spec'
                    ? col.id
                    : '',
              cab = currentFilter.sysName === 'cabinet' ? col.id : '';

            return {
              ...col,
              rsr,
              cab,
              date,
              gridId,
              baseDuration,
              day: col?.weekdayContent,
            };
          }),
        };

        return {
          ...gridEl,
          // isEmpty: !anotherDate && isGridEmpty(gridEl, selectedCheckboxes),
        };
      });

      if (anotherDate) {
        // console.log('update if', gridCollection)
        state.anotherGridList = gridCollection.sort(
          (a, b) => moment(a.id).valueOf() - moment(b.id).valueOf()
        );
      } else {
        state.gridList = gridCollection;
      }
    },

    async getMountData({commit, state, rootState}) {
      if (state.legendsSettings === 'appointment_type') {
        state.legends = rootState.specs.map((el) => ({
          ...el,
          shortName: (el.name[0] + el.name[1]).toUpperCase(),
        }));
      }
    },

    async getData({commit, state, dispatch, rootState}, anotherDates) {
      let {
        datesTimes,
        selectedFilterOptionsVuex,
        currentFilter,
        selectedCheckboxes,

        specs,
        legendsSettings,
        legends,
      } = rootState;

      let anotherDate = anotherDates?.start;

      if (!anotherDate) {
        state.isGetDataLoading = true;
      }

      let params = {
        params: {
          date_time_start: anotherDates
            ? dateFormat(anotherDate)
            : moment(datesTimes.start).format('DD.MM.YYYY'),
          date_time_end: anotherDates
            ? dateFormat(anotherDate)
            : moment(datesTimes.end).format('DD.MM.YYYY'),
        },
      };

      let resourceParamsString = `${
        selectedFilterOptionsVuex.length
          ? selectedFilterOptionsVuex.map((el) => `resource=${el.id}`).join('&')
          : ''
      }`;

      if (currentFilter.sysName === 'cabinet') {
        resourceParamsString = '';
      }



        let graphs = [
          {
            "id": 500,
            "a_t_s_n": "pay",
            "a_t_w": "pay",
            "a_t": "Платный",
            "cab": 86,
            "d_t_s": moment().set({hour: '10', minute: '00'}).format(),
            "dep": 49,
            "dur": 30,
            "res": 1
          },
          {
            "id": 501,
            "a_t_s_n": "pay",
            "a_t_w": "pay",
            "a_t": "Платный",
            "a_on_s": true,
            "cab": 86,
            "d_t_s": moment().set({hour: '10', minute: '30'}).format(),
            "dep": 49,
            "dur": 30,
            "res": 1
          },
          {
            "id": 502,
            "a_t_s_n": "pay",
            "a_t_w": "pay",
            "a_t": "Платный",
            "a_on_s": true,
            "cab": 86,
            "d_t_s":  moment().set({hour: '11', minute: '00'}).format(),
            "dep": 49,
            "dur": 30,
            "res": 1
          },
        ];
        graphs = resToSrs(graphs)
          .map((el) => {
            let spec = specs.find((spec) => spec.id == el.rsr);
            let color = '';
            if (legendsSettings == 'cabinet') {
              color = legends.find((leg) => leg.id == el.cab)?.color;
            }

            if (legendsSettings == 'appointment_type') {
              color = legends.find((leg) => leg.name == el.a_t)?.color;
            }

            if (legendsSettings == 'department') {
              color = legends.find((leg) => leg.id == el.dep)?.color;
            }

            if (legendsSettings == 'resource') {
              color = legends.find((leg) => leg.id == el.rsr)?.color;
            }

            return {
              ...el,
              color: color,
              specName: `${spec?.surname} ${spec?.first_name[0]}. ${spec?.patronymic[0]}.`,
            };
          })
          .filter((el) => el.a_t_s_n != 'vocation');

        state.graphs = uniqueArray([...state.graphs, ...graphs], 'id');

        let appoints = appointsList;
        appoints = appoints.map((appoint) => handleIncomeAppoints(appoint));
        state.appoints = uniqueArray([...state.appoints, ...appoints], 'id');




      commit(
        'updatePayload',
        {option: 'selectedCheckboxes', payload: selectedCheckboxes},
        {root: true}
      );

      if (anotherDates) {
        state.anotherGridList = [];
        dispatch('updateGridList', anotherDates.start);
        return;
      } else {
        commit(
          'updatePayload',
          {option: 'anotherDates', payload: []},
          {root: true}
        );
        commit(
          'updatePayload',
          {option: 'anotherDate', payload: ''},
          {root: true}
        );
        state.anotherGridList = [];
      }

      state.isGetDataLoading = false;
      return dispatch('updateGridList');
    },
    async createAppointTask({dispatch, state}, payload) {
      // let {data} = await appointTaskApi.createAppointTask(payload);
      state.tasks.push(handleNewKeys({...payload, }, 'newKeys'));
    },

    async updateAppointTask({state}, payload) {
      state.tasks = changeItemOnIdInList(
        state.tasks,
        handleNewKeys({...payload}, 'newKeys')
      );
    },
    async deleteAppointTask({commit}, payload) {

      commit('filterGridList', {
        grid: 'gridList',
        arrayName: 'tasks',
        id: payload,
      });

      commit('filterGridList', {
        grid: 'anotherGridList',
        arrayName: 'tasks',
        id: payload,
      });
      commit('modal/closeModal', 'isAppointModalTabsOpened', {root: true});
    },

    async createAppoint({commit, state}, payload) {
      let error = '';
      try {

          state.appointError = '';
          state.appoints.push(payload);
          commit('modal/closeModal', 'isAppointModalTabsOpened', {
            root: true,
          });

      } catch (e) {
        error = {...e.toJSON()};
        if (e.response?.data?.code == 1) {
          state.appointError = 'Запись на указанное время уже существует';
        } else if (
          error.status == 404 ||
          error.status == 500 ||
          e?.code == 'ERR_NETWORK' ||
          error
        ) {
          state.appointError = 'Ошибка при создании записи';
        }

        commit(
          'addSnackBar',
          {
            type: 'error',
            descr: 'Ошибка создания записи',
          },
          {root: true}
        );

        throw e;
      }
    },
    async getMoreAppointInfo({state, commit, rootState}, id) {
      return await instance
        .get(`appoint/${id}`)
        .then(({data}) => {
          let moreAppointData = handleIncomeAppoints({...data});
          let {f_n, p_n, s_n, p} = data.l_r;
          commit(
            'modal/updateAppointModalData',
            {
              ...moreAppointData,
              ...rootState.modal.modalData,
              l_r: `${s_n} ${f_n} ${p_n} ${p}`,
            },
            {root: true}
          );
        })
        .catch((e) => {
          return e;
        });
    },
    async updateAppointVuex({state}, payload) {
      state.appoints = changeItemOnIdInList(
        state.appoints,
        payload
      );
    },
    async deleteAppoint({commit, state}, {id, r_r}) {
      commit('filterGridList', {
        arrayName: 'appoints',
        id,
      });
    },

    openModalFromCtx({state, rootState, commit}) {
      let {appointModalData} = rootState.modal,
        {currentFilter, workDateTimeContinue} = rootState,
        {ctxMenu} = state;
      let dateTimeData = ctxMenu.date,
        specData =
          currentFilter.sysName === 'cabinet'
            ? appointModalData.rsr
            : currentFilter.sysName === 'date'
              ? ctxMenu.gridId
              : ctxMenu.columnId,
        cabinetData =
          currentFilter.sysName === 'cabinet'
            ? ctxMenu.columnId
            : appointModalData.cab,
        {id, p_p, p_f_n, p_s_n, p_p_n, p_b_d, p_g, p_c} = appointModalData.patient;


      let modalData = {
        ...appointModalData,
        rsr: specData,
        cab: cabinetData || '',
        d_t_s: dateTimeFormatBack(calcTimeOfCoords(
          dateTimeData,
          ctxMenu.y,
          appointModalData.dur,
          workDateTimeContinue
        )),
        tab: 'appoint',
        copyMethod: ctxMenu.copyMethod,
        patient: handleNewKeys(
          {
            id,
            p_c,
            p_p,
            p_f_n,
            p_s_n,
            p_p_n,
            p_b_d: dateFormat(p_b_d),
            p_g,
          },
          'patientForUpdateAppoint'
        ),

        isAppointEdit: ctxMenu.copyMethod === 'cut',
        oldData: appointModalData,
      };

      if (ctxMenu.copyMethod === 'cut') {
        commit('modal/updatePayload', {
          option: 'isAppointEdit',
          payload: true,
        }, { root: true });
      } else {
        commit('modal/updatePayload', {
          option: 'isAppointEdit',
          payload: false,
        }, { root: true });
      }
      commit('modal/updateAppointModalData', modalData, {root: true});
      commit('modal/openModal', 'isAppointModalTabsOpened', {root: true});
    },
  },

  mutations: {
    filterPreset(state, id) {
      state.presets = state.presets.filter((el) => el.id !== id);
    },
    addPreset(state, payload) {
      state.presets.push(payload);
    },
    filterGridList(state, payload) {
      let {arrayName, id} = payload;

      state[arrayName] = state[arrayName].filter((el) => el.id !== id);
    },

    updatePayload(state, {option, payload}) {
      state[option] = payload;
    },

    addToNewGridList(state, payload) {
      state.appoints.push(payload);
    },
  },

  getters: {
    newGridList(state, getters, rootState) {
      moment.locale(rootState.locale)
      let {currentFilter, selectedCheckboxes, anotherDate} = rootState;
      let grids = state.gridList.map((grid) => {
        let gridItem = {
          ...grid,
          // isEmpty: !anotherDate && isGridEmpty(grid, selectedCheckboxes),
          columns: grid.columns
            .map((col) => {

              return {
                ...col,
                appoints: handleAppointFilter(
                  state.appoints,
                  currentFilter.sysName,
                  grid.id,
                  col.date,
                  col.id
                ),
                graphs: handleAppointFilter(
                  state.graphs,
                  currentFilter.sysName,
                  grid.id,
                  col.date,
                  col.id
                ),
                tasks: handleAppointFilter(
                  state.tasks,
                  currentFilter.sysName,
                  grid.id,
                  col.date,
                  col.id
                ),
              };
            })
            .filter((item) => {
              if (
                selectedCheckboxes.includes('notRenderEmpty') &&
                !anotherDate &&
                !item.appoints.length &&
                !item.graphs.length
              ) {
                return false;
              }
              return true;
            }),
        };

        return {
          ...gridItem,
          isEmpty: !anotherDate && isGridEmpty(gridItem, selectedCheckboxes),
        };
      });
      return grids;
    },

    newAnotherGridList(state, getters, rootState) {
      let {currentFilter} = rootState;
      let sysName = '';
      if (currentFilter.sysName !== 'cabinet') {
        sysName = 'spec';
      }
      let grids = state.anotherGridList.map((grid) => {
        return {
          ...grid,
          columns: grid.columns.map((col) => {
            return {
              ...col,
              appoints: handleAppointFilter(
                state.appoints,
                sysName,
                grid.id,
                col.date,
                col.id
              ),
              graphs: handleAppointFilter(
                state.graphs,
                sysName,
                grid.id,
                col.date,
                col.id
              ),
              tasks: handleAppointFilter(
                state.tasks,
                sysName,
                grid.id,
                col.date,
                col.id
              ),
            };
          }),
        };
      });
      return grids;
    },
    gridCollection(state, getters, rootState, rootGetters) {
      let {currentFilter, selectedFilterOptionsVuex, anotherDates} =
          rootState,
        {dates} = rootGetters;

      if (anotherDates.length) {
        currentFilter = {sysName: 'spec'};
        dates = anotherDates;
      }

      if (selectedFilterOptionsVuex.length) {
        return currentFilter.sysName !== 'date'
          ? dates
          : selectedFilterOptionsVuex;
      } else {
        return [];
      }
    },

    columns(state, getters, rootState, rootGetters) {
      let {currentFilter, selectedFilterOptionsVuex, anotherDates} =
          rootState,
        {dates} = rootGetters;

      if (anotherDates.length) {
        currentFilter = {sysName: 'spec'};
      }

      return currentFilter.sysName === 'date'
        ? dates
        : selectedFilterOptionsVuex;
    },
    appointTypeObj(state) {
      // так как значение типа записи это ид, чтобы не искать потом по массиву, делаем словарика а потом берем значение от ида
      return state.appointTypes.reduce((acc, object) => {
        const sys_name = object.sys_name;
        acc[sys_name] ??= object.color;
        return acc;
      }, {});
    },
    filteredPresets(state, _, rootState) {
     return  state.presets.filter((el) => {
        if (rootState.currentFilter.sysName === 'cabinet')
          return el.view_name == 'byCabinets';
        if (rootState.currentFilter.sysName === 'date')
          return el.view_name == 'byDates';
        if (rootState.currentFilter.sysName === 'spec')
          return el.view_name == 'byResource';
      });

    },
  },
};
