import { BlockBox } from '../BlockBox.js';
import { directions } from '../../helpers/dicts.js';
import { AppointByСomprehensiveProgram } from '../AppointByСomprehensiveProgram/AppointByСomprehensiveProgram.js';
import { mapGetters } from '../../libs/vuex.esm.browser.js';

export const PaymentBlock = {
  delimiters: ['#{', '}'],
  components: {
    'block-box': BlockBox,
    'comprehensive-program': AppointByСomprehensiveProgram,
  },
  data() {
    return {
      directions,
      isActualDirectionsOpened: false,
      selectedDirections: [],

      activeTabText: 'Отдельный счет',
      tabs: ['Отдельный счет', 'Прием по комплескной программе'],
      checkTypes: ['На бумаге', 'Электронный'],
      paymentTypes: ['Система  быстрых платежей', 'Наличные'],

      discount: 0,
      withDiscount: 0,
      checkType: '',
      paymentType: '',
      paymentSum: 0,
      paymentFull: false,
      check: false,
      sbp: false,
    };
  },

  methods: {
    toggle() {
      this.isActualDirectionsOpened = !this.isActualDirectionsOpened;
    },
    setFullPayment() {
      if (this.withDiscount) this.paymentSum = this.withDiscount;
      if (!this.withDiscount) this.paymentSum = this.totalSum;
    },
  },
  computed: {
    isSeparateAccount() {
      return this.activeTabText === 'Отдельный счет';
    },
    ...mapGetters(['serviceMaterialsTotalSum']),
    totalSum() {
      return this.serviceMaterialsTotalSum;
    },
  },
  watch: {
    discount(val) {
      if (!val) {
        this.withDiscount = 0;
      }
      if (val) {
        this.withDiscount = this.totalSum - (this.totalSum / 100) * val;
      }
    },
  },
  template: `
      <block-box>
        <template #box-header>
          <div class='grid payment-block-header'>
              <span class='text-h6'>Оплата</span>
                <div class='visit-badges'>
                  <badge class='badge-red'
                        v-html='"Задолженность 300 &#8381;"'
                  ></badge>

                  <badge class='badge-green'
                        v-html='"Депозит 500 &#8381;"'
                  ></badge>
                </div>

                <tabs :tabList="tabs" 
                      class='grey-tabs'
                      style='justify-self: end'
                       @change-tab='activeTabText = $event'
                      >
                </tabs>
          </div>
        </template>

      <template #box-body>
        <div v-if='isSeparateAccount'>
          <div class='payment__total-sum grid'>
            <div class='grid payment-block__input'>
              <label>Скидка, %</label>
              <input type="text" 
                    class="form-input form-input__time"
                    v-model='discount'>
            </div>

            <div class='grid payment-block__input'>
              <label>С учетом скидки</label>
              <input type="text" 
                    class="form-input form-input__time"
                    readonly
                    v-model='withDiscount'>
            </div>

            <div class='grid payment-block__input'>
              <label>Общая сумма</label>
              <input type="text" 
                    class="form-input form-input__time"
                    v-model='totalSum'>
            </div>

            <div class='grid payment-block__input'>
              <label>Тип чека</label>
              <v-select :options='checkTypes'
                        v-model='checkType'
              ></v-select>
            </div>

            <div class='grid payment__type'>
              <div class='grid payment-block__input'>
                <label>Тип оплаты</label>
                <v-select :options='paymentTypes'
                          v-model='paymentType'></v-select>
              </div>

              <div class='payment__checks grid'>
              <checkbox 
                    v-model='check'>
                  <template>
                    Чек
                  </template>
                </checkbox>

                <checkbox 
                    v-model='sbp'>
                  <template>
                    СБП оплачен
                  </template>
                </checkbox>
            </div>
          </div>

          <div class='payment__sum grid'>
            <div class='grid payment-block__input'>
              <label>Сумма оплаты</label>
              <input type="text" 
                    class="form-input form-input__time"
                    v-model='paymentSum'>
            </div>
            <span class='bordered-link'
                  style='justify-self: start;'

                  @click='setFullPayment'
                  >Оплата 100%</span>
          </div>
        </div>
      </div>

      <comprehensive-program v-else></comprehensive-program>
      
      </template>
    </block-box>
  `,
};
