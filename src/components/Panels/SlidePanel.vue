<template>
  <div class='slide-panel'
       :style='styles'
       @click='setElementFocus'
  >
    <!-- TODO исправить анимацию -->
    <transition name="slide-panel-fade">
      <div class='panel-container'>
        <price-panel  v-if='isPriceOpened'
                      key='pricePanel'></price-panel>
        <wait-list-panel  v-if='isWaitListOpened'
                          key='waitPanel'></wait-list-panel>
        <create-wait-list-item  v-if='isCreateWaitListItemOpened'
                                key='createWaitPanel'></create-wait-list-item>
      </div>
    </transition>


  </div>
</template>

<script>

import { mapGetters, mapState } from '../../libs/vuex.esm.browser.js';
import CreateWaitListItem from './WaitList/CreateWaitListItem.vue';
import WaitListPanel from './WaitList/WaitList.vue';

import PricePanel from './PricePanel.vue';
export default {
  name: 'SlidePanel',
  delimiters: ['#{', '}'],
  components: {
    PricePanel,
    WaitListPanel,
    CreateWaitListItem,

  },
  mounted() {
    this.$nextTick(() => {
      this.zIndex = this.lastOpenedElement.zIndex;
    });
  },
  data() {
    return {
      zIndex: 0,
    };
  },
  methods: {
    setElementFocus() {
      this.$store.commit('updateOpenedElements', 'SlidePanel');
    },
  },
  computed: {
    ...mapState({
      isMcOpened: (state) => state.panels.isMcOpened,
      isWaitListOpened: (state) => state.panels.isWaitListOpened,
      isPriceOpened: (state) => state.panels.isPriceOpened,
      isCreateWaitListItemOpened: (state) => state.panels.isCreateWaitListItemOpened,
      isCurrentDialogOpened: (state) => state.panels.isCurrentDialogOpened,
      isMainMcPanelOpened: (state) => state.panels.isMainMcPanelOpened,
      isSearchPanelOpened: (state) => state.panels.isSearchPanelOpened,
    }),

    ...mapGetters(['lastOpenedElement']),
    styles() {
      return {
        zIndex: this.zIndex,
      };
    },
  },
  watch: {
    lastOpenedElement: {
      handler(val) {
        if (val.modalName === 'SlidePanel') {
          this.zIndex = val.zIndex;
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>


