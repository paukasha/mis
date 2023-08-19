<template>
  <div class='grid__content'
       :key="locale"
       :id='"grid-" + grid.id'>
    <div class='grid__titles'>
                <span class='text-md-400'
                >{{ currentFilter.sysName !== 'date' && grid.day ? grid.day + ' ' + grid.name : grid.name }}
                  <span v-if='grid.isEmpty'>
                    Нет записей</span>
                </span>
      <div class='grid__btns' >
        <base-btn class='grid-btn grid-prev-btn'
                  :class='"grid-prev-btn" + grid.id'
                  icon='arrow'
        >
        </base-btn>

        <base-btn class='grid-btn grid-next-btn'
                  :class='"grid-next-btn" + grid.id'
                  icon='arrow'>
        </base-btn>
      </div>
    </div>
    <div class='grid'
         v-if='!grid.isEmpty'
         :style='[styles.grid, helperStyles]'>

      <div class='times__grid'

           :style='[helperStyles, gridRows]'
      >
                      <span class="text"
                            v-for='time in times'
                            :key='time.id'>
                        {{ time.hour }}
                      </span>
      </div>

      <div class='columns__grid '
           :class='"swiper-container" + grid.id'
           :ref='"columnsGrid"+grid.style'
           :style="[styles.columnsGrid, styles.rowsGrid]">

        <div class='swiper-wrapper grid'
             :style="helperStyles">

          <slot name="columns" :columns='grid.columns' ></slot>

          <slot name='for-drag'></slot>

          <slot name='rows'></slot>

        </div>
      </div>

      <div style="grid-column-start: 2; position: relative">
      <div class="swiper-scrollbar"
           :class='"swiper-scrollbar" + grid.id'></div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';

import Row from './Row.vue';
import Column from './Column/Column.vue';
import { calcGridStyle } from '@/helpers/calcItemCoordsStyle.js';


export default {
  name: 'AppointGrid',
  props: ['grid', 'colWidth'], // Данные для отрисовки грида
  components: {
    Column,
    Row,
  },
  data() {
    return {
      dragData: {},
      isCtxMenuVisible: false,
      ctxMenuStyles: {},
      columnId: '',
      copyMethod: '',
      insertMethod: '',
    };
  },
  methods: {
    updateSwiper() {
      this.swiper = new Swiper(`.swiper-container${this.grid.id}`, {
        slidesPerGroup:
            this.styles.columnsInWidth === 'auto'
                ? 1
                : this.styles.columnsInWidth,
        slidesPerView: this.styles.columnsInWidth,
        observer: true,
        observeParents: true,
        allowTouchMove: false,
        initialSlide: 0,
        modules: [Navigation, Scrollbar],
        navigation: {
          nextEl: `.grid-next-btn${this.grid.id}`,
          prevEl: `.grid-prev-btn${this.grid.id}`,
        },
        scrollbar: {
          el: `.swiper-scrollbar${this.grid.id}`,
          hide: false,
          draggable: true,
        },
        mousewheel: false,
        onInit: (swiper) => {
          swiper.slideTo(1);
        },
      });
    },
  },
  mounted() {
    this.updateSwiper();
  },
  watch: {
    locale() {
      this.updateSwiper()
      this.$forceUpdate()
    }
  },
  computed: {
    ...mapGetters('appoint', ['appointTypeObj']),
    ...mapState({
      currentFilter: (state) => state.currentFilter,
      times: (state) => state.times,
      selectedCheckboxes: (state) => state.selectedCheckboxes,
      workDateTimeContinue: (state) => state.workDateTimeContinue,
      selectedFilterOptionsVuex: (state) => state.selectedFilterOptionsVuex,
      locale: (state) => state.locale,
    }),
    helperStyles() {
      return {
        gridTemplateRows: `64px repeat(${this.styles.rowsGridLength}, 60px)`,
      };
    },
    styles() {
      return calcGridStyle(
          this.grid.columns,
          this.workDateTimeContinue.dayContinue,
          +this.colWidth
      );
    },
    gridRows() {
      return {
        gridRow: `2/${+this.styles.rowsGridLength}`,
      };
    },
  },
}
</script>

<style lang="scss" scoped>

</style>


