<template>
  <v-tooltip right >
    <template v-slot:activator="{ on, attrs }">
      <div class='appoint__item'
           :style="[itemCoordsStyle, appointStyles.appointType, appointStyles.appointRows]"
           @drop.prevent
           @click='openModal'
           :id="'appoint-' + gridItem.id"
           :ref="'appoint-' + gridItem.id"
           @contextmenu='openCtxMenu($event)'
           v-bind="attrs"
           v-on="on"
           draggable="true"
           @dragstart='startDrag($event, gridItem)'
           @dragover.prevent
           @dragenter.prevent
           @drop.prevent
      >


        <div class='patient__category'
             :style='appointStyles.patientCatColor'></div>

        <div class='appoint-status-type'
             :style='appointStyles.appointStatusType'>
        </div>

        <span class="appoint__patient text-overflow"
              ref='patientInitials'
              :style='appointStyles.patientFontSize'

        >
                      {{ patientInitials }}
                    </span>

        <span class='text-xxs-400 text-overflow'
              v-if='renderComment'
              ref='appointComment'
              :style="appointStyles.commentHeight"
        >
                      <span  v-if='!comment && gridItem.cmt'
                             style='padding-top: 4px; display: inline-block;'>
                        <img src='/static/js/src/assets/icons/ellipsis.svg' >
                      </span>

                      <span v-if='comment'> {{ comment }}</span>
                    </span>

        <div class='appoint__icons'
             v-if='appointIconsLength'
             :style='appointStyles.appointIcons'
             ref='appointIcons'
        >
          <div v-for='(icon, key) in appointIcons'
               :key='key'
               :class="{'red-ruble': key === 'dbt'}">

            <div v-html="icon" v-if='icon'></div>
          </div>
        </div>
      </div>
    </template>
    <span>{{ patientFullNameAndBirth }}</span>
  </v-tooltip>
</template>

<script>

import { gridItemMix } from '../../../../../../mixins/GridItem.js';
import {
  mapActions,
  mapGetters,
  mapMutations,
  mapState,
} from 'vuex';
import {
  dateFormat,
  birthFormat,
} from '@/helpers/momentHelp.js';
import { handleNewKeys } from '@/helpers/handleNewKeys.js';
import { appointStatusColors } from '@/helpers/dicts.js';
import {
  car,
  man,
  ruble,
  sale,
  telemed,
  cake,
} from '@/helpers/icons.js';
import moment from "moment";
import {dragAndDropMixin} from "@/mixins/dragAndDropMixin.js";
export default {
  name: 'Appoint',
  mixins: [gridItemMix,dragAndDropMixin],

  props: ['gridItem', 'columnId'],

  data() {
    return {
      comment: '',
      renderComment: false,
      patient: {},
    };
  },
  created() {
    this.patient = this.gridItem?.patient || {};
  },
  mounted() {
    this.renderComment = this.selectedCheckboxes.includes('renderComment');
    this.comment = this.gridItem.cmt;
  },
  computed: {
    ...mapState({
      patientCategories: (state) => state.appoint.patientCategories,
      selectedCheckboxes: (state) => state.selectedCheckboxes,
    }),
    ...mapGetters('appoint', ['appointTypeObj']),

    patientInitials() {
      return `${this.patient.p_s_n} ${this.patient.p_f_n[0]}. ${
          this.patient.p_p_n ? this.patient.p_p_n[0] + '.' : ''
      }`;
    },
    patientFullNameAndBirth() {
      return `${this.patient.p_s_n} ${this.patient.p_f_n} ${
          this.patient.p_p_n
      }, ${dateFormat(this.patient.p_b_d)}
      ${this.gridItem.cmt || ''}`;
    },
    appointStyles() {
      return {
        // тип приёма - background  всей записи, рассчитывается от цвета типа записи
        appointType: {
          backgroundColor: this.appointTypeObj[this.gridItem.a_t_sys_name],
        },
        // тип записи маленькая закладка в верхнем правом углу
        appointStatusType: {
          backgroundColor: appointStatusColors[this.gridItem.sts_sys_name],
        },
        patientCatColor: {
          backgroundColor: this.patientCategories.find(
              (el) => el.id == this.patient?.p_c
          )?.color,
        },
        patientFontSize: {
          fontSize:
              parseInt(this.itemCoordsStyle.height, 10) === 10 ? '8px' : '',
        },
        appointIcons: {
          gridTemplateColumns: `repeat(${this.appointIconsLength}, 1fr)`,
        },
        appointRows: this.calcAppointRows(),
        commentHeight: this.gridItem.cmt && this.calcCommentStyles(),
      };
    },

    appointIcons() {
      let icons = {
        sts: this.gridItem.sts_sys_name === 'came' && man,
        dbt: this.gridItem.dbt > 0 && ruble,
        s_t:
            this.gridItem.s_t == 3
                ? car
                : this.gridItem.s_t == 2
                    ? telemed
                    : '',
        a_o: this.gridItem.a_o && sale,
        b_d:
            birthFormat(this.patient.p_b_d) ===
            birthFormat(this.gridItem.d_t_s) && cake,
      };

      icons = Object.fromEntries(Object.entries(icons).filter(([_, v]) => v));
      return icons;
    },
    appointIconsLength() {
      return Object.values(this.appointIcons).filter((el) => el).length;
    },
  },
  watch: {
    'gridItem.cmt'(val) {
      this.comment = val;
    },
    gridItem: {
      handler() {
        this.updateItemCoords();
      },
      deep: true,
    },

    selectedCheckboxes(val) {
      this.renderComment = val.includes('renderComment');
    },
  },
  methods: {
    ...mapMutations(['modal', ['openModal', 'updateModalData']]),
    ...mapMutations(['appoint', ['updatePayload']]),
    ...mapActions('appoint', ['getMoreAppointInfo']),

    async openModal(e, appoint) {
      e.stopPropagation();
      appoint = { ...this.gridItem };

      if (
          e.target.classList.contains('column-titles') ||
          e.target.closest('.column-titles')
      ) {
        e.preventDefault();
        return;
      }

      if (e.type === 'drop') {
        let dropData = JSON.parse(e.dataTransfer.getData('PatientData'));
        appoint.pat = dropData.patient;
      }

      let { id, p_p, p_c, p_f_n, p_s_n, p_p_n, p_b_d, p_g } =
          this.gridItem.patient;
      let modalData = {
        ...this.gridItem,
        d_t_s: moment(this.gridItem.d_t_s).format('YYYY-MM-DD HH:mm'),
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
      };
      modalData.oldData = { ...modalData };
      this.$store.commit('modal/updateAppointModalData', modalData);
      this.$store.commit('modal/updatePayload', {
        option: 'isAppointEdit',
        payload: true,
      });
      this.$store.commit('modal/updatePayload', {
        option: 'isTaskEdit',
        payload: false,
      });
      this.$store.commit('modal/openModal', 'isAppointModalTabsOpened');
    },
    calcAppointRows() {
      if (this.appointIconsLength) {
        return {
          gridTemplateRows: `10px 1fr 18px`,
        };
      }

      return {
        gridTemplateRows: `10px 1fr`,
      };
    },
    calcCommentStyles() {
      let appointHeight = parseInt(this.itemCoordsStyle.height, 10),
          patientInitialsHeight = this.$refs.patientInitials?.clientHeight,
          appointIconsHeight = this.$refs.appointIcons?.clientHeight || 0,
          // 14 - это размер шрифта, вообще размер шрифта 11 - но со значением 11 неправильно расситываетс количество строк
          commentFontSize = 14,
          // на всякий случай отнимаем одну строку - commentFontSize и прибавим 9 пикселей - commentFontSize + 9
          commentHeight =
              appointHeight - patientInitialsHeight - appointIconsHeight,
          commentStrings = Math.floor(commentHeight / 14),
          width = !this.appointIconsLength && '100%',
          gridRowStart = 'initial',
          gridColumnStart = 'initial',
          alignSelf = 'initial',
          paddingBottom = 0;
      // commentHeight = commentStrings * commentFontSize ;

      if (commentStrings <= 1) {
        commentStrings = 1;
        if (!this.appointIconsLength) {
          commentStrings = 1;
        }

        width = this.appointIconsLength * 10;
        if (!this.appointIconsLength || this.appointIconsLength == 1) {
          width = '100px';
        }

        if (this.appointIconsLength > 1) {
          width = 100 - this.appointIconsLength * 10 + 'px';
        }
        if (
            this.appointIconsLength > 4 ||
            (appointHeight >= 24 && appointHeight < 29)
        ) {
          this.comment = '';
        }
      }

      if (!this.gridItem.cmt) {
        commentHeight = 0;
      }

      if (this.comment) {
        commentHeight = commentHeight - 4;
      }

      return {
        height: this.appointIconsLength ? '' : commentHeight + 'px',
        gridRowStart,
        alignSelf,
        gridColumnStart,
        paddingBottom,
        '-webkit-line-clamp': commentStrings,
        width,
      };
    },
    openCtxMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      let data = {
        isVisible: true,
        top: e.pageY,
        left: e.pageX,
      };
      this.$emit('update-ctx-payload', data);
      this.$store.commit('modal/updateAppointModalData', this.gridItem);
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
