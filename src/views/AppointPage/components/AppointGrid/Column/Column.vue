<template>
  <div class='columns swiper-slide'
       @contextmenu='openCtxMenu'
       :style='[helperStyles,]'
       @drop='openModal'
       @dragover.prevent='Hilightlace($event)'
       @dragenter.prevent
       @click='openModal'
       :key="locale"
  >

    <div class='columns__title'
         :ref='column.style'
         :id='column.id'
    >

      <div class='column-titles' :key="locale">
        <span class="text-xs-400" style='color: var(--color-dusty-gray)'>
         {{ localeDay(column.day) }}
        </span>
        <span :class='column.day ? "text-md-500"  : "text-xs-400 "'>
          {{ localeDate(column.name) }}
        </span>
      </div>


      <appoint v-for='appoint in column.appoints'
               :key='appoint.id'
               :grid-item='appoint'
               :column-id='column.id'
               :ref="'appoint-' + appoint.id"
               @update-ctx-payload='show($event)'
      >
      </appoint>

      <appoint-task
          v-for='task in column.tasks'
          :column-id='column.id'
          :key='task.id'
          :grid-item='task'
          draggable="true"
          @dragstart.native='startDrag($event, task, "task")'
          @dragover.native.prevent
          @dragenter.native.prevent
      ></appoint-task>


      <graph-item v-for='graph in column.graphs'
                  :key='graph.id'
                  :grid-item='graph'
                  @drag-event-helper='graphDragHelper($event)'
                  @open-ctx-menu='openCtxMenu($event)'
      >
      </graph-item>
    </div>
    <slot name='bedplace'></slot>
  </div>
</template>

<script>
import Appoint from './Appoint/Appoint.vue';
import GraphItem from './Graph/Graph.vue';
import {
  mapState,
} from 'vuex';

import {calcTimeOfCoords} from '@/helpers/calcTimeOfCoords.js';
import {searchPatient} from '@/mixins/SearchPatient.js';
import {dateTimeBackFormat} from '@/helpers/momentHelp.js';

import {AppointTask} from './Task/Task.js';
import moment from "moment";


export default {
  name: 'Column',
  props: ['column', 'rowLength', 'colWidth'],
  mixins: [searchPatient,],
  components: {
    Appoint,
    GraphItem,
    'appoint-task': AppointTask,
  },
  data() {
    return {
      isDrag: false,
      dragHelperLineHeight: '',
      emitHelperObj: {},
    };
  },
  methods: {
    localeDay(val) {
      if (this.currentBaseFilter.sysName === 'date') {
        return moment(this.column.date).format('dddd')
      }

      return val

    },
    localeDate(val) {
      if (this.currentBaseFilter.sysName === 'date') {
      return moment(this.column.date).format('DD MMMM')
      }

      return val
    },
    async openModal(e) {
      let column = this.column,
          appoint = '';
      if (
          e.target.classList.contains('column-titles') ||
          e.target.closest('.column-titles')
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.stopDragEmit();
        return;
      }

      let modalData = '';
      let dateTimeData = this.column.date,
          specData = column.rsr,
          baseDurationData = column.baseDuration,
          cabinetData = column.cab,
          patient = {};

      if (e.type === 'drop') {
        this.stopDragEmit();
        try {
          appoint = JSON.parse(e.dataTransfer.getData('PatientData'));
        } catch (e) {
          console.log(e);
        }
        if (appoint.appointDrag) {
          if (e.offsetY < 64) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          let {id, gridId} = column;

          let dragNewAppointData = {
            ...appoint,
            cab: this.currentFilter.sysName === 'cabinet' ? id : appoint.cab,
            rsr:
                this.currentFilter.sysName === 'date'
                    ? gridId
                    : this.currentFilter.sysName === 'spec'
                        ? id
                        : appoint.rsr,
            d_t_s: dateTimeBackFormat(
                calcTimeOfCoords(
                    this.column.date,
                    e.offsetY,
                    10,
                    this.workDateTimeContinue
                )
            ),
          };


          !appoint.isTask
              ? this.updateDragData({
                dragNewAppointData,
                arrayName: 'appoints',
              })
              : this.updateDragData({
                dragNewAppointData,
                arrayName: 'tasks',
              });
          return;
        }
      }

      modalData = {
        rsr: specData,
        cab: cabinetData || '',
        d_t_s: moment(
            calcTimeOfCoords(
                dateTimeData,
                e.offsetY,
                baseDurationData,
                this.workDateTimeContinue
            )
        ).format(),

        dur: baseDurationData,
        columnId: this.column.id,
        gridId: this.column.gridId,
      };
      this.$store.commit('modal/updatePayload', {
        option: 'isAppointEdit',
        payload: false,
      });
      this.$store.commit('modal/updateAppointModalData', modalData);
      this.$store.commit('modal/openModal', 'isAppointModalTabsOpened');
    },
    stopDragEmit() {
      this.isDrag = false;
      this.$emit('drag-event-helper', {
        ...this.emitHelperObj,
        isDrag: this.isDrag,
      });
    },
    Hilightlace(e) {
      if (
          e.target.classList.contains('graph__item') ||
          e.target.closest('.graph__item') ||
          e.target.classList.contains('appoint__item') ||
          e.target.closest('.appoint__item')
      ) {
      } else {
        this.emitHelperObj = {
          isDrag: this.isDrag,
          styles: {
            top: e.offsetY + 'px',
            left: e.target.offsetParent.offsetLeft + 'px',
            height: this.dragHelperLineHeight,
            position: 'absolute',
            width: '100%',
            background: 'green',
            display: 'block',
          },
        };

        this.$emit('drag-event-helper', this.emitHelperObj);
      }
    },

    startDrag(e, appoint, isTask) {
      this.dragHelperLineHeight = e.target.style.height;
      this.isDrag = true;
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      let dataTransfetObj = {
        ...appoint,
        appointDrag: true,
        isTask,
      };

      e.dataTransfer.setData('PatientData', JSON.stringify(dataTransfetObj));
    },
    updateDragData(payload) {
      let {dragNewAppointData, arrayName} = payload;

      arrayName === 'appoints'
          ? this.$store.dispatch('appoint/updateAppointVuex', {
            ...dragNewAppointData,
          })
          : this.$store.dispatch('appoint/updateAppointTask', {
            ...dragNewAppointData,
          });
    },

    graphDragHelper() {
      this.isDrag = false;
      this.emitHelperObj = {
        isDrag: this.isDrag,
        style: {
          ...this.emitHelperObj.style,
          height: 0,
        },
      };

      this.$emit('drag-event-helper', this.emitHelperObj);
    },
    show(payload) {
      this.$store.commit('appoint/updatePayload', {
        option: 'ctxMenu',
        payload: {
          ...payload,
          gridId: this.column.gridId,
          columnId: this.column.id,
          date: this.column.date,
        },
      });
    },
    openCtxMenu(e, payload) {
      let y;
      if (typeof e !== 'number') {
        e.preventDefault();
        y = e.offsetY;
        if (this.ctxMenu.isVisible && !this.ctxMenu.copyMethod) {
          this.$store.commit('appoint/updatePayload', {
            option: 'ctxMenu',
            payload: {
              isVisible: false,
            },
          });
        }
      } else {
        y = e;
      }

      if (this.ctxMenu.copyMethod) {
        this.$store.commit('appoint/updatePayload', {
          option: 'ctxMenu',
          payload: {
            ...this.ctxMenu,
            date: this.column.date,
            gridId: this.column.gridId,
            columnId: this.column.id,
            isVisible: true,
            top: e.pageY,
            left: e.pageX,
            y,
          },
        });
      }
    },
  },

  computed: {
    ...mapState({
      currentFilter: (state) => state.currentFilter,
      selectedCheckboxes: (state) => state.selectedCheckboxes,
      workDateTimeContinue: (state) => state.workDateTimeContinue,
      ctxMenu: (state) => state.appoint.ctxMenu,
      locale: (state) => state.locale,
      currentBaseFilter: (state) => state.currentFilter,
    }),
    helperStyles() {
      return {
        gridRow: `1/${+this.workDateTimeContinue.dayContinue + 2}`,
        minWidth: this.colWidth ? +this.colWidth + 'px !important' : 'initial',
      };
    },
  },

}
</script>

<style lang="scss" scoped>

</style>
