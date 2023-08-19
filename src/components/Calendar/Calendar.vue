<template>
  <div >
    <vc-date-picker
        :locale="locale"
        :is-dark="theme==='custom-dark-theme'"
        :key='calendarHelperKey'
        v-model="datesTimes"
        @contextmenu.native.prevent='onContextMenu'
        ref='calendarRange'
        :popover='{keepVisibleOnInput: true, transition: "none"}'
        mode="date"
        :columns="$screens({ default: 2,})"
        :masks="masks"
        class="calendar__range"
        is-range>
      <template #default="{ inputValue, inputEvents,  togglePopover}">
        <div class='calendar-block'>
          <input class="calendar-input"
                 :value="inputValue.start"
                 @input="inputEvents.start.input"
                 @click="togglePopover({ transition: 'none',})"
          >
          <input class="calendar-input"
                 @click="togglePopover({ transition: 'none'})"
                 :value="inputValue.end"
                 @input="inputEvents.end.input"
                 v-mask='"##.##.####"'>
          <base-btn icon='calendar'
                    @click.native="togglePopover({ transition: 'none',})"
                    class='calendar-btn'>
          </base-btn>
        </div>
      </template>

      <template v-slot:header-left-button>
        <div>
          <base-btn icon="doubleArrow"></base-btn>
          <base-btn icon="arrow"></base-btn>
        </div>
      </template>

      <template v-slot:header-right-button>
        <div>
          <base-btn icon="doubleArrow"></base-btn>
          <base-btn icon="arrow"></base-btn>
        </div>
      </template>

      <template v-slot:header-title="{monthLabel, year, }" >
        <div class="calendar-title-btns">
          <base-btn :text="monthLabel + ' ' +  year"
                    order="2"
                    icon="arrow">
          </base-btn>
        </div>
      </template>


      <template v-slot:footer>
        <div class="calendar__footer">
          <base-btn :text="$t('Применить')"
                    class='apply-btn'
                    @click.native="execute"
          ></base-btn>

          <base-btn :text="$t('Очистить')"
                    @click.native="clearSelectedDates"
          ></base-btn>

          <base-btn :text="$t('Текущий месяц')"
                    @click.native.stop="setCalendarToCurrentMonth"
          ></base-btn>
        </div>
      </template>
    </vc-date-picker>
<!--    <div  v-if='isContextMenuOpened && allowContextMenu'-->
<!--          class='calendar-context'-->
<!--          :style='contextMenuStyles'-->
<!--          @click="goToGrid"-->
<!--          v-click-outside='closeTool'-->
<!--    >-->
<!--      <span>{{ $t("Перейти к сетке") }}</span>-->
<!--    </div>-->
  </div>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapState,
} from 'vuex';
import { Menu } from '../Menu.js';
import { calendarDateFormat } from '@/helpers/momentHelp.js';
import moment from 'moment'

export default {
  components: {
    'custom-menu': Menu,
  },
  data() {
    return {
      datesTimes: {
        start: '',
        end: '',
      },
      masks: {
        input: 'DD.MM.YYYY',
      },
      contextMenu: [
        { sysName: 'dayContext', text: 'Перейти к сетке', icon: '' },
      ],
      isContextMenuOpened: false,
      contextMenuStyles: {},
      parseDate: '',
      calendarHelperKey: 0,
    };
  },
  computed: {
    ...mapState({
      dates: (state) => state.datesTimes,
      theme: (state) => state.theme,
      locale: (state) => state.locale,
    }),
    allowContextMenu() {
      return !this.$router.currentRoute.fullPath.includes(
          '/crm/work_with_lead/'
      );
    },
  },
  methods: {
    ...mapMutations(['updatePayload', 'createDates']),
    ...mapActions('appoint', ['getData']),
    ...mapActions('reabilitationPlan', ['getReabilitationPlans']),
    onContextMenu(e) {
      if (!this.allowContextMenu) return false;
      if (
          e.target.classList.contains('vc-day') ||
          e.target.closest('.vc-day')
      ) {
        this.showTool(e);
        return false;
      }
    },
    showTool(e) {
      if (
          !e.target.classList.contains('vc-day-content') &&
          !e.target.closest('.vc-day-content')
      )
        return;

      let { offsetY } = e;

      this.parseDate = calendarDateFormat(
          moment(e.target.ariaLabel, 'dddd, DD MMMM YYYY', 'ru').locale('ru')
      );

      // чтобы ровно расположить контектное меню
      let diffHeight = e.target.clientHeight - offsetY;

      this.contextMenuStyles = {
        // 76 - запасные пиксели, точнее лишние
        top: e.pageY - 76 + diffHeight + 'px',
        left: e.pageX + 'px',
      };
      this.isContextMenuOpened = true;
    },
    goToGrid() {
      this.$store.dispatch('scrollToAnotherGrid', this.parseDate);

      this.isContextMenuOpened = false;
      this.$refs.calendarRange.hidePopover();
      this.calendarHelperKey++;
    },
    execute() {
      this.$refs.calendarRange.hidePopover();

      if (!this.allowContextMenu) {
        this.$store.dispatch('workWithLead/getAll');
        return;
      }
        this.$store.dispatch('appoint/getData');

    },
    setCalendarToCurrentMonth(e) {
      e.stopPropagation();
      this.datesTimes = {
        start: moment().startOf('month').format(),
        end: moment().endOf('month').format(),
      };
    },
    clearSelectedDates() {
      this.datesTimes = {
        start: moment().startOf('day').format(),
        end: moment().endOf('day').format(),
      };
    },
    closeTool() {
      this.isContextMenuOpened = false;
    },
  },
  watch: {
    dates: {
      handler(val) {
        this.datesTimes = val;
      },
      immediate: true,
    },
    datesTimes: {
      handler(payload) {
        this.$store.commit('updatePayload', { option: 'datesTimes', payload });
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

