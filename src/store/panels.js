export const panels = {
  namespaced: true,
  state() {
    return {
      isMainMcPanelOpened: false,
      isMcOpened: false,
      isPriceOpened: false,
      isWaitListOpened: false,
      isBurgerMenuOpened: false,
      isCreateWaitListItemOpened: false,
      isCurrentDialogOpened: false,

      isSearchPanelOpened: false,
    };
  },
  actions: {},
  mutations: {
    switchPanelVisibility(state, panelState) {
      if (panelState === 'isPriceOpened' && state.isWaitListOpened) {
        state.isWaitListOpened = false;
      }

      if (panelState === 'isWaitListOpened' && state.isPriceOpened) {
        state.isPriceOpened = false;
      }
      state[panelState] = !state[panelState];

      if (state[panelState]) {
        this.commit('updateOpenedElements', 'SlidePanel', { root: true });
      }

      if (!state[panelState]) {
        this.commit('deleteLastOpenedElement', 'SlidePanel', { root: true });
      }
    },
    openPanel(state, panelState) {
      if (panelState === 'isPriceOpened') {
        state.isWaitListOpened = false;
        state.isCreateWaitListItemOpened = false;
      }

      if (panelState === 'isWaitListOpened' && state.isPriceOpened) {
        state.isPriceOpened = false;
      }

      if (
        panelState === 'isCreateWaitListItemOpened' &&
        state.isWaitListOpened
      ) {
        state.isWaitListOpened = false;
        state.isCreateWaitListItemOpened = true;
      }

      state[panelState] = true;

      this.commit('updateOpenedElements', 'SlidePanel', { root: true });
    },
    closePanel(state, panelState) {
      state[panelState] = false;
      this.commit('deleteLastOpenedElement', 'SlidePanel', { root: true });
    },
  },
  getters: {},
};
