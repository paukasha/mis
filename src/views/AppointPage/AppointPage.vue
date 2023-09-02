<template>
  <div class='page'>
    <header-bottom
        :page-title='$t("pageTitle")'
        @open-modal='openFiltersModal'
    >
      <template>
        <mis-legend></mis-legend>
      </template>
    </header-bottom>



    <div class="content container"
         id='appointVueApp'
         ref='appointVueApp'>

      <span style="display: inline-block; padding: 10px; border: 1px solid red">{{ $t('searchPatientWarning')}}</span>

      <base-spinner v-if='isGetDataLoading'></base-spinner>
      <div v-else>
        <appoint-grid v-for='grid in newGridList'
                      :key='grid.id'
                      :grid='grid'
                      colWidth='148'
        >

          <template #columns='{columns}' >
            <column v-for='column in columns'
                    :key='column.id'
                    :column='column'
                    @drag-event-helper='dragData = $event'
                    :row-length='calcGridRowsLength(grid)'
                    colWidth='148'
            >
            </column>
          </template>


          <template #for-drag>
            <div v-if='dragData.isDrag'
                 :style='dragData.styles'
            ></div>
          </template>

          <template #rows>
            <row :columns-length='grid.columns.length'
                 :row-length='calcGridRowsLength(grid)'
                 :times='times' >
            </row>
          </template>
        </appoint-grid>
      </div>


      <div class="appoint-delimiter"
           v-if='anotherGridList.length'></div>

      <appoint-grid v-for='grid in newAnotherGridList'
                    :key='grid.id'
                    colWidth='148'
                    :grid='grid'>
        <template #columns='{columns}' >
          <column v-for='column in columns'
                  :key='column.id'
                  :column='column'
                  @drag-event-helper='dragData = $event'
                  :row-length='calcGridRowsLength(grid)'
                  colWidth='148'
          >
          </column>
        </template>


        <template #for-drag>
          <div v-if='dragData.isDrag'
               :style='dragData.styles'
          ></div>
        </template>

        <template #rows>
          <row :columns-length='grid.columns.length'
               :row-length='calcGridRowsLength(grid)'
               :times='times' >
          </row>
        </template>
      </appoint-grid>

    </div>

    <filters-modal v-if='isFilterModalOpened'></filters-modal>
    <appoint-modal-tabs v-if='isAppointModalTabsOpened'></appoint-modal-tabs>
    <visit-modal v-if='isVisitModalOpened'></visit-modal>


    <!--  snackbars сделать отдельный компонент если необхоимо -->

    <div class='snackbars' v-if='snackbars.length'>
      <v-slide-y-transition
          class="py-0"
          group>
        <template v-for='(snackbar, idx) in snackbars' >
          <v-alert
              :key='idx'
              :close-delay='5000'
              :color='snackbar.type === "success" ?  "var(--color-jade)" : "var(--color-alizarin-crimson)"'
              :type="snackbar.type">
            #{snackbar.descr}
          </v-alert>
        </template>
      </v-slide-y-transition>

    </div>
  </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex';
import AppointGrid from "@/views/AppointPage/components/AppointGrid/AppointGrid.vue";
import Column from './components/AppointGrid/Column/Column.vue';
import { calcGridStyle } from '@/helpers/calcItemCoordsStyle.js';
import Row from "@/views/AppointPage/components/AppointGrid/Row.vue";
const FiltersModal = () => import('./components/Modals/FiltersModal/Filters.vue')
import  AppointModalTabs  from './components/Modals/AppointModal/AppointModal.vue';
import { HeaderBottom } from '../../components/Header/HeaderBottom.js';
import { Legend } from './components/Legend/Legend.js';
import { VisitModal } from '../../components/Modal/VisitModal/VisitModal.js';
import moment from "moment";
export default {
  name: 'Appointment',
  components: {
    'header-bottom': HeaderBottom,
    'appoint-grid': AppointGrid,
    column: Column,
    'filters-modal': FiltersModal,
    'appoint-modal-tabs': AppointModalTabs,
    'mis-legend': Legend,
    'visit-modal': VisitModal,
    row: Row
  },
  data() {
    return {
      styles: {},
      dragData: {},
      snackbar: true,
      text: 'My timeout is set to 2000.',
      timeout: 2000,
    };
  },
  mounted() {
    let calendarRange = document.querySelector(
        '.calendar__range .vc-popover-content-wrapper'
    );
    document.addEventListener('click', this.closeOpenContextMenu);
    calendarRange.addEventListener('click', this.closeOpenContextMenu);

    this.getPageData();
  },
  methods: {
    async getPageData() {
      await this.$store.dispatch('appoint/getMountData');

      await this.$store.dispatch('appoint/getData');
    },
    calcGridRowsLength(grid) {
      return calcGridStyle(grid.columns, this.workDateTimeContinue.dayContinue)
          .rowsGridLength;
    },
    openFiltersModal() {
      this.$store.commit('modal/openModal', 'isFilterModalOpened');
    },
  },
  computed: {
    ...mapState({
      gridList: (state) => state.appoint.gridList,
      anotherGridList: (state) => state.appoint.anotherGridList,
      isGetDataLoading: (state) => state.appoint.isGetDataLoading,
      workDateTimeContinue: (state) => state.workDateTimeContinue,
      times: (state) => state.times,
      isContextMenuOpened: (state) => state.isContextMenuOpened,
      isFilterModalOpened: (state) => state.modal.isFilterModalOpened,
      isAppointModalTabsOpened: (state) => state.modal.isAppointModalTabsOpened,
      isVisitModalOpened: (state) => state.modal.isVisitModalOpened,
      snackbars: (state) => state.snackbars,
    }),
    ...mapGetters('appoint', ['newGridList', 'newAnotherGridList']),
  },
  watch: {

    isAppointModalTabsOpened(val) {
      if (!val) {
        this.$store.commit('modal/updatePayload', {option: 'isTaskEdit',payload:false})
      }
    },
    snackbars: {
      handler(val) {
        if (val.length) {
          this.snackbars.forEach((el, idx) => {
            this.timer = setTimeout(() => {
              this.$delete(this.snackbars, idx);
              clearTimeout(this.timer);
            }, 7000);
          });
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
