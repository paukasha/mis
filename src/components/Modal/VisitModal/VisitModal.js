import { mapMutations } from '../../../libs/vuex.esm.browser.js';
import  Times  from '../../times.vue';
import { pencil } from '../../../helpers/icons.js';
import { ServicesBlock } from '../../ServicesBlock/ServicesBlock.js';
import { MaterialsBlock } from '../../MaterialsBlock/MaterialsBlock.js';
import { PaymentBlock } from '../../PaymentBlock/PaymentBlock.js';

export const VisitModal = {
  components: {
    times: Times,
    'services-block': ServicesBlock,
    'materials-block': MaterialsBlock,
    'payment-block': PaymentBlock,
  },
  data() {
    return {
      pencil,
      date: moment().format(),
    };
  },
  methods: {
    ...mapMutations('modal', ['openModal', 'closeModal']),
    backToAppoint() {
      this.$store.commit('modal/closeModal', 'isVisitModalOpened');
      this.$store.commit('modal/openModal', 'isAppointModalTabsOpened');
    },
  },
  computed: {},
  template: `<custom-modal 
                modalName='isVisitModalOpened'
                :cross='true'>
  <div class='visit-modal'>
    <div>
      <base-btn text='Вернуться к записи'
                icon='arrowStroke'
                class='btn-small'
                @click.native='backToAppoint'
      ></base-btn>
    </div>
   
    <h2 class='text-lg-500'>
        Добавление приема
    </h2>

    <delimiter></delimiter> 

    <div class='grid visit-form'>
      <div class='modal__content'>
        <div class='modal-total modal__content-left'>
          <span class='form__label'>Фамилия</span>
          <input type='text' 
                  class='form-input' 
                  readonly
                  value='Иванов Иван Иванович, 01.01.2001'
          >   
          <a v-html='pencil'
            target='_blank'
            href='/affiliate/14/patient/45632/'
            class='base-btn patient__link'
            title='Перейти в карту пациента'
          ></a>

        
          <span class='form__label'>Плательщик</span>
          <div class='appoint-grid__item'>
            <input type='text' 
                    class='form-input' 
                    value='Иванов Иван Иванович, 01.01.2001'
            >   
          </div>
        

        
          <span class='form__label'>Поликлиника</span>
          <div class='appoint-grid__item'>
            <input type='text' 
                    class='form-input' 
                    value='Поиклиника №3'
            >   
          </div>

        
          <span class='form__label'>Диагнозы МКБ</span>
          <div class='appoint-grid__item'>
            <input type='text' 
                    class='form-input' 
                    value='диагноз'
            >   
          </div>
        </div> 
        
        <div class='modal-total modal__content-right'>
          <span class='form__label'>Дата</span>
          <v-date-picker v-model="date"
                              mode='date' >
            <template v-slot="{ inputValue, inputEvents, togglePopover}">
                <input type='text' 
                        class='form-input form-input-date date-input'
                        @input="inputEvents.input"
                        :value="inputValue"
                        @click="togglePopover({ transition: 'fade'})"
              >
            </template>
          </v-date-picker>

          
          <span class='form__label'>Кабинет</span>
          <div class='appoint-grid__item'>
            <input type='text' 
                    class='form-input' 
                    value='кабинет'
            >   
          </div>
        

          <span class='form__label'>Время</span>
          <times 
              start='12.04.2023T15:30'
              dur='30'
          ></times>

        
          <span class='form__label'>Доп инфа</span>
          <div class='appoint-grid__item'>
            <textarea class='form__textarea'  
                    value='info'
            ></textarea> 
          </div>
        </div>
      </div>    
      <services-block></services-block> 
      
      <materials-block></materials-block>

      <payment-block></payment-block>
  </div>

   <delimiter></delimiter>
     <btns-wrapper style='padding-bottom: var(--spacing-xm)'>
        <template #right-btns>
          <base-btn class='apply-btn' text='Добавить'></base-btn>
        </template>
      </btns-wrapper>
</div>
</custom-modal>
`,
};
