<template>
  <div class='table__container'
       style='max-height: 100%'
       ref='tableContainer'>

    <div  class='table__row'
          :style='calcTableCols'>
      <div  class='table__title table__column'
            :style='[calcTextAlign(item.type),theadColor]'
            v-for='item in theads'
            :key='item.title'
      >
        <div v-html='item.title'></div>
      </div>
    </div>

    <iframe id="table__container1" style="width:0; height:0;border:none"></iframe>

    <div class='table__row-wrapper'
         v-if='contents.length'>
      <div class='table__row table__row-content' :style='calcTableCols'
           v-for='item in contents'
           :key='item.id'>
        <div class='table__column' >
          Код: {{ item.code }}<br>{{ item.name }}
          <div v-if="item.duration"
               class="service__dur"
               title="Срок готовности">
            <div v-html='clock'></div>
            {{ item.duration_label }}
          </div>

          <div v-html='cross'
               class='cross table-cross'
               @click='$emit("delete-table-item",item.id)'
          ></div>
        </div>



        <div class='table__column'>
          <div>
            {{ item.gtin }}
          </div>
        </div>



        <div class='table__column'>
          <input type='text'
                 class='price__input'
                 v-model.number='item.quantity'>
        </div>

        <div class='table__column'>
          <input type='text'
                 class='price__input'
                 v-model.number='item.price'>
        </div>

        <div class='table__column'>
          <input type='text'
                 readonly
                 class='price__input price__input-cost'
                 :value='item.quantity * item.price'>
        </div>

        <div  class='table__column-wh-remains'
              :style='{gridColumn: "span " + theads.length}'
              v-if='item.batchs && item.batchs.length'>
          <div class='no-remains'
               v-if='!item.batchs.length'>Нет остатков!</div>
          <div class='wh-remains'>
            <div class='remains__title'>Склад</div>
            <div class='remains__text--bold'>Остаток</div>
            <div class='remains__content'
                 v-for='batch in item.batchs'>
              <div>{{ batch.name }}</div><div class='remains__text--bold'>{{ batch.totalRemains }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if='!contents.length'
         class='table__empty table__column'>
      Материалы не добавлены</div>

    <div class='table__row-last'
         v-else>
      <base-btn icon='printer'
                style='justify-self: start;'
                class='btn-small text-sm-500'
                text='Печать'
                @click.native='printServices'
      ></base-btn>
      <span class='text-sm-500'
            style='justify-self: end'
      >Общая стоимость материалов: #{totalCost}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { TableMixin } from './TableMixin.js';
import { cross, printer, clock } from '@/helpers/icons.js';
export default {

  mixins: [TableMixin, ],
  components: {},
  mounted() {
    this.contents = this.table;
  },
  data() {
    return {
      cross,
      printer,
      clock,
      contents: [],
      isFocus: false,
      helperKey: 0,
    };
  },
  watch: {
    table: {
      handler(val) {
        this.contents = val;
      },
      deep: true,
    },
    totalCost(payload) {
      this.$store.commit('updatePayload', {
        option: 'materialsTotalPayment',
        payload,
      });
    },
  },
  computed: {
    ...mapState({
      specs: (state) => state.specs,
    }),
    theads() {
      let filterCondition = [];
      if (!this.specCol) {
        filterCondition.push('Специалист');
      }
      if (!this.dateCol) {
        filterCondition.push('Дата');
      }

      return [
        { type: 'string', width: '', title: 'Название' },
        { type: 'string', width: '300px', title: 'Партия' },
        { type: 'number', width: '100px', title: 'Кол-во' },
        { type: 'number', width: '100px', title: 'Цена за ед. (&#8381;)' },
        { type: 'number', width: '100px', title: 'Стоимость (&#8381;)' },
      ].filter((el) => !filterCondition.includes(el.title));
    },
    theadsLength() {
      return this.theads.length;
    },
  },
  methods: {
    focusHandler() {
      this.isFocus = true;
    },
    specValue(val) {
      return this.specs.find((el) => el.id == val)?.name || '';
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

