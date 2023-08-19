export const modal = {
  namespaced: true,
  state() {
    return {
      isFilterModalOpened: false,
      isMcTemplateModalOpened: false,

      // запись
      isAppointModalOpened: false,
      appointModalData: {
        cab: '',
        date: '',
        rsr: '',
        dur: '',
      },
      isAppointModalTabsOpened: false,
      isAppointModalTabsEditOpened: false,
      isAppointEdit: false,
      isTaskEdit: false,
      // прием
      isVisitModalOpened: false,
      visitModalData: '',

      isTherapyPlanFiltersModalOpened: false,
      isTherapyPlanItemModalOpened: false,
      inpatientTherapyItemModal: '',
      isTableRowModalOpened: false,
      leadsModalData: '',
    };
  },
  actions: {},
  mutations: {
    openModal(state, modalItem) {
      // Выставляет в сторе логическую переменную "Модальное окно открыто", в шаблоне base_new.html данное свойство слушается для отрисовки модального окна
      state[modalItem] = true;
      this.commit('updateOpenedElements', modalItem, { root: true });
    },

    updatePayload(state, { option, payload }) {
      state[option] = payload;
    },

    closeModal(state, modalItem) {
      state[modalItem] = false;
      this.commit('deleteLastOpenedElement', modalItem, { root: true });
    },

    updateAppointModalData(state, data) {
      state.appointModalData = data;
    },
    updateLeadsModalData(state, payload) {
      state.leadsModalData = payload;
    },

    updateInpatientTherapyItemModal(state, payload) {
      state.inpatientTherapyItemModal = payload;
    },
  },
  getters: {
    inpatientTherapyItemModalGetter(state) {
      return state.inpatientTherapyItemModal;
    },
  },
};
