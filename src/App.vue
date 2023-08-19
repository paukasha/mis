<template>
  <div id="app"
       :key="locale"
  >
      <v-app  >
        <div v-if="!auth">
          <router-view ></router-view>
        </div>

        <div class='mis-container' v-else>
          <top-header></top-header>

          <transition name="slide-fade">
            <burger-menu v-if='isBurgerMenuOpened'></burger-menu>
          </transition>

          <router-view ></router-view>

          <slide-panel></slide-panel>

          <grid-ctx-menu
              v-if='ctxMenu.isVisible'
              :ctx-menu='ctxMenu'
              @open-modal='openModal($event)'
          >
          </grid-ctx-menu>

          <scroll-top-btn></scroll-top-btn>
        </div>
      </v-app>

  </div>
</template>
<script>
import TopHeader from "@/components/Header/TopHeader.vue";
import SlidePanel from "@/components/Panels/SlidePanel.vue";
import ScrollTopBtn from "@/components/UI/ScrollTopBtn.vue";
import BurgerMenu from "@/components/BurgerMenu.vue";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {baseFilters} from "@/helpers/dicts.js";
import GridContextMenu from "@/components/GridContext/GridContextMenu.vue";
// import moment from "moment";
import Vue from "vue";
import moment from 'moment';

import {momentLocale} from "@/mixins/momentLocale.js";



export default {
  mixins: [momentLocale],
  components: {
    'top-header': TopHeader,
    'slide-panel': SlidePanel,
    'scroll-top-btn': ScrollTopBtn,
    'grid-ctx-menu': GridContextMenu,
    'burger-menu': BurgerMenu,
  },
  data() {
    return {
      baseFilters,
      currentModalForEsc: '',
      selectedLanguage: '',

    };
  },
  created() {
    this.$store.commit('auth')

  },
  mounted() {
    document.addEventListener('keyup', (e) => {
      this.escListener(e);
    });
    this.getMountData()

    let locale = localStorage.getItem('locale')

    if (!locale) {
      localStorage.setItem('locale', 'ru')
      locale = localStorage.getItem('locale')
    }

    this.$store.commit('updatePayload', {option: 'locale', payload: locale})
    moment.locale(locale)
    this.$moment.locale(locale);
    Vue.prototype.moment.locale( locale)

    this.selectedLanguage = locale

   this.$store.commit('updateTheme')
  },
  beforeDestroy() {
    document.removeEventListener('keyup', (e) => {
      this.escListener(e);
    });
    let calendarRange = document.querySelector(
        '.calendar__range .vc-popover-content-wrapper'
    );
    document.removeEventListener('click', this.closeOpenContextMenu);
    calendarRange.removeEventListener('click', this.closeOpenContextMenu);
  },

  watch: {

    isAppointModalOpened(val) {
      if (!val) {
        this.$store.commit('appoint/updatePayload', {
          option: 'ctxMenu',
          payload: {
            isVisible: false,
            top: '',
            left: 0,
            copyMethod: '',
          },
        });

        this.$store.commit('appoint/updatePayload', {
          option: 'appointError',
          payload: '',
        });
      }
    },
  },

  methods: {
    escListener(e) {
      if (e.keyCode === 27) {
        this.$store.commit(
            'modal/closeModal',
            this.lastOpenedElement.modalName
        );
      }
    },
    ...mapActions(['getMountData']),
    ...mapActions('appoint', ['getData', 'updateGridList', 'updateTimes']),

    ...mapMutations(['updatePayload', 'createDates', 'createAnotherDates']),
  },

  computed: {
    ...mapGetters(['dates', 'lastOpenedElement']),
    ...mapState({
      datesTimes: (state) => state.datesTimes,
      isBurgerMenuOpened: (state) => state.panels.isBurgerMenuOpened,
      isAppointModalOpened: (state) => state.modal.isAppointModalOpened,
      isFilterModalOpened: (state) => state.modal.isFilterModalOpened,

      isContextMenuOpened: (state) => state.isContextMenuOpened,
      anotherDate: (state) => state.anotherDate,
      gridList: (state) => state.appoint.gridList,
      anotherGridList: (state) => state.appoint.anotherGridList,
      ctxMenu: (state) => state.appoint.ctxMenu,

      locale: (state) => state.locale,
      theme: (state) => state.theme,
      auth: (state) => state.auth,
    }),
    lang() {
      return this.locale;
    }
  },
}
</script>


