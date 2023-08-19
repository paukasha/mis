<template>
  <div class='graph__item'
       :style='[itemCoordsStyle, graphDropStyles, legendColor]'
       @click='openModal($event)'
       @drop='openModal'
       @dragover.prevent='dragoverHelper'
       @dragleave='onDragleave'
       @dragenter='changeStyle'
       @contextmenu='openCtxMenu'
  >
                   <span class='text-xs-400 '
                         style='font-size: 8px; color: var(--color-silver-chalice);'>{{ gridItem.specName }}</span>
  </div>
</template>

<script>

import { gridItemMix } from '@/mixins/GridItem.js';
import {
  mapActions,
  mapMutations,
  mapState,
} from 'vuex';
export default {
  name: 'Graph',
  props: ['gridItem'],
  mixins: [gridItemMix],
  data() {
    return {
      graphDropStyles: {},
    };
  },
  computed: {
    ...mapState({
      currentFilter: (state) => state.currentFilter,
      workDateTimeContinue: (state) => state.workDateTimeContinue,
      ctxMenu: (state) => state.appoint.ctxMenu,
      modalData: (state) => state.modal.appointModalData,
    }),
    legendColor() {
      return {
        backgroundColor: this.gridItem.color,
      };
    },
  },
  methods: {
    ...mapMutations(['modal', ['openModal', 'updateModalData']]),
    ...mapActions(['appoint', ['updateAppointVuex', 'updateAppointTask']]),

    async openModal(e) {
      e.stopPropagation();

      let patient = '';

      if (e.type === 'drop') {
        this.graphDropStyles = {};
        let dropData;
        try {
          dropData = await JSON.parse(e.dataTransfer.getData('PatientData'));
        } catch (e) {
          console.log(e);
        }

        if (dropData.appointDrag) {
          let dragAppointData = {
            ...dropData,
            rsr:
                this.currentFilter.sysName === 'spec'
                    ? this.gridItem.rsr
                    : dropData.rsr,
            cab:
                this.currentFilter.sysName === 'cabinet'
                    ? this.gridItem.cab
                    : this.gridItem.cab,
            d_t_s: this.gridItem.d_t_s,
          };

          if (!dropData.isTask) {
            this.$store.dispatch('appoint/updateAppointVuex', {
              ...dragAppointData,
            });
          } else {
            this.$store.dispatch('appoint/updateAppointTask', {
              ...dragAppointData,
            });
          }
          return;
        } else {
          let data = '';
          if (!dropData.patient.id) {
            // для цс
            patient = {
              phone_number: dropData.phone_number,
            };
          } else {
            data = await instance2.get(
                `appoint/patient/${dropData.patient?.id}`
            );

            let {
              id,
              birthday,
              surname,
              first_name,
              patronymic,
              gender,
              phone_number,
            } = data.data.patient;

            patient = {
              id,
              birthday,
              surname,
              first_name,
              patronymic,
              gender,
              phone_number,
            };
          }
        }
      }

      let modalData = {
        ...this.gridItem,
        tab: 'appoint',
        patient: patient,
      };

      this.$store.commit('modal/openModal', 'isAppointModalOpened');
      this.$store.commit('modal/updateAppointModalData', modalData);
    },
    changeStyle() {
      this.graphDropStyles = {
        backgroundColor: 'red',
      };
    },
    onDragleave() {
      this.graphDropStyles = {};
    },
    dragoverHelper() {
      this.$emit('drag-event-helper', false);
    },
    openCtxMenu(e) {
      e.preventDefault();

      this.$emit('open-ctx-menu', parseInt(this.itemCoordsStyle.top) - 64);
    },
  },
}
</script>

<style lang="scss" scoped>

</style>


