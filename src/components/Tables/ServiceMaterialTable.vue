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
        <div v-html='$t(item.title)'></div>
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


        <div class='table__column'
             v-if='specCol'>
          <div v-if='!isFocus'
               @click='focusHandler'>
            {{ specValue(item.rsr) }}
          </div>

          <v-select v-else
                    v-click-outside='() => isFocus = false'
                    :options='specs'
                    class='text-overflow-select'
                    label='name'
                    :reduce='spec => spec.id'
                    v-model='item.rsr'></v-select>
        </div>


        <div  class='table__column'
              v-if='dateCol'>
          <v-date-picker v-model="item.date"
                         :popover='{transition: "none"}'
                         mode="date"
          >
            <template v-slot="{ inputValue, inputEvents,  togglePopover}">
              <input class="price__input"
                     style='text-align:left'
                     :value="inputValue"
                     @input="inputEvents.input"
                     @click="togglePopover({ transition: 'none',})"
              >
            </template>
          </v-date-picker>
        </div>

        <div class='table__column'>
          <input type='text'
                 class='price__input'
                 v-model.number='item.price'>
        </div>

        <div class='table__column'>
          <input type='text'
                 class='price__input'
                 v-model.number='item.quantity'>
        </div>

        <div class='table__column'>
          <input type='text'
                 readonly
                 class='price__input price__input-cost'
                 :value='item.quantity * item.price'>
        </div>

        <div  class='table__column-wh-remains'
              v-if='item?.batchs?.length'>
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
      {{ $t("Услуги/материалы не добавлены") }}</div>

    <div class='table__row-last'
         v-else>
      <base-btn icon='printer'
                style='justify-self: start;'
                class='btn-small text-sm-500'
                text='Печать'
                disabled
                @click.native='printServices'
      ></base-btn>
      <span class='text-sm-500'
            style='justify-self: end'
      >{{ $t("Общая стоимость услуг") }}: {{ totalCost }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { TableMixin } from './TableMixin.js';
import { cross, printer, clock } from '@/helpers/icons.js';
export default {
  name: 'ServicesMaterialTable',
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
        option: 'servicesTotalPayment',
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
      //  (&#8381;)
      return [
        { type: 'string', width: '', title: 'Услуга' },
        { type: 'string', width: '300px', title: 'Специалист' },
        { type: 'string', width: '120px', title: 'Дата' },
        { type: 'number', width: '100px', title: 'Цена за ед.' },
        { type: 'number', width: '100px', title: 'Кол-во' },
        { type: 'number', width: '100px', title: 'Стоимость' },
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

