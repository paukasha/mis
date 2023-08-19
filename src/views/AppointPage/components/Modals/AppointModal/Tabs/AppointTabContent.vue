<template>
  <validation-observer
      v-slot="{invalid, handleSubmit, reset, errors}"
      :key='helperKey'
      ref='formObserver'>
    <form @submit.prevent='handleSubmit(createAppoint)'>
      <div class='modal__content'>
        <div class='modal-total modal__content-left'>
          <h3 class='form__title'>{{ $t("Пациент") }}</h3>
          <span class='form__label'>{{ $t("Фамилия") }}</span>
          <validation-provider :name='$t("Фамилия")'
                               rules='required'
                               v-slot='{validate, errors}'
                               class='pos-rel'
          >
            <!-- vee-validate не обрабатывает объект v-select поэтому нужен скрытый инпут с конкретным значением -->
            <input type='hidden'
                   style='opacity: 0'
                   class='form-input'
                   v-model='appointModalData.patient.surname'
            >
            <patient-field v-if='!isPatientEdit'
                           ref='patientSurname'
                           :patient-data.sync='appointModalData.patient'
                           :error-message='errors[0]'
            ></patient-field>
            <input type='text'
                   v-else
                   ref='patientSurnameInput'
                   class='form-input'
                   v-model='appointModalData.patient.surname'
            >
          </validation-provider>

          <base-btn :icon='patientModeIcon'
                    @click.native='togglePatientMode'
          ></base-btn>

          <span class='form__label'>{{ $t("Имя") }}</span>
          <validation-provider :name="$t('Имя')"
                               class='pos-rel appoint-grid__item'
                               rules='required'
                               v-slot='{errors}'>
            <input type='text'
                   class='form-input'
                   :readonly='!isPatientEdit'
                   v-model='appointModalData.patient.first_name'
            >
            <span v-if='errors[0]' class='form__error'>
                                     {{ errors[0] }}</span>
          </validation-provider>



          <span class='form__label'>{{ $t("Отчество") }}</span>
          <div class='appoint-grid__item'>
            <input type='text'
                   class='form-input'
                   v-model='appointModalData.patient.patronymic'
                   :readonly='!isPatientEdit'
            >
          </div>

          <span class='form__label'>{{ $t("Пол") }}</span>
          <validation-provider :name='$t("Пол")'
                               class='pos-rel appoint-grid__item'
                               rules='required'
                               v-slot='{errors}'>
            <v-select type='text'
                      :options='["М","Ж"]'
                      :clearable='false'
                      v-model='appointModalData.patient.gender'
            ></v-select>
            <span v-if='errors[0]'
                  class='form__error'>{{ errors[0] }}</span>
          </validation-provider>

          <!-- <div class='appoint-grid__item'> -->
          <span class='form__label'>{{ $t("Телефон") }}</span>
          <input type='text'
                 class='form-input'
                 v-model='appointModalData.patient.phone_number'
                 :readonly='!isPatientEdit'
          >
          <!-- </div> -->

          <span class='form__label'>{{ $t("Дата рождения") }}</span>
          <validation-provider :name='$t("Дата рождения")'
                               rules='required|min:8'
                               v-slot='{errors,}'
                               style="justify-self: start;"
                               class='pos-rel appoint-grid__item'
          >
            <input type='text'
                   class='form-input form-input-date'
                   v-model='appointModalData.patient.birthday'
                   :readonly='!isPatientEdit'
                   v-mask='"##.##.####"'
            >
            <br>
            <span v-if='errors[0]'
                  class='form__error'>{{ errors[0] }}</span>
          </validation-provider>


          <span class='form__label'>{{ $t("Доп. информация") }}</span>
          <div class='appoint-grid__item'>
                            <textarea class='form__textarea'
                                      :readonly='!isPatientEdit'
                                      v-model='appointModalData.extra_info'
                            ></textarea>
          </div>


          <span class='form__label'>{{ $t("Комментарий") }}</span>
          <div class='appoint-grid__item'>
            <textarea-base class='form__textarea'
                           id='comment'
                           :ref='"textarea-comment"'
                           v-model='appointModalData.cmt'></textarea-base>
          </div>
        </div>

        <div class='modal-total modal__content-right'>
          <h3>{{ $t("Специалист") }}</h3>


          <span class='form__label'>{{ $t("Дата") }}</span>
          <vc-date-picker v-model="appointModalData.d_t_s"
                          :locale="locale"
                          :is-dark="theme==='custom-dark-theme'"
                          style="justify-self: start;"
                         mode='date'
                         :masks="masks">
            <template v-slot="{ inputValue, inputEvents, togglePopover}">
              <input type='text'
                     class='form-input form-input-date date-input'
                     @input="inputEvents.input"
                     :value="inputValue"
                     @click="togglePopover({ transition: 'fade'})"
              >
            </template>
          </vc-date-picker>


          <span class='form__label'>{{ $t("Время") }}</span>
          <times
              :start.sync='appointModalData.d_t_s'
              :dur.sync='appointModalData.dur'
          ></times>

          <span class='form__label'>{{ $t("Кабинет") }}</span>
          <validation-provider :name='$t("Кабинет")'
                               rules='required'
                               class='pos-rel appoint-grid__item'
                               v-slot='{errors}'>
            <v-select :options='cabinets'
                      label='name'
                      :reduce='cab => cab.id'
                      v-model='appointModalData.cab'
            >
              <template #no-options>
                {{ $t("Поиск по кабинетам") }}
              </template>
            </v-select>
            <span class='form__error'>{{ errors[0] }}</span>
          </validation-provider>

          <span class='form__label'>{{ $t("Источник") }}</span>
          <validation-provider :name='$t("Источник")'
                               rules='required'
                               class='pos-rel appoint-grid__item'
                               v-slot='{errors}'>
            <v-select :options='appointSources'

                      label='name'
                      :reduce='source => source.id'
                      v-model='appointModalData.srs'
            >
              <template #no-options>
                {{ $t("Поиск источника") }}
              </template>
            </v-select>
            <span class='form__error'>{{ errors[0] }}</span>
          </validation-provider>

          <span class='form__label'>{{ $t("Специалист") }}</span>
          <validation-provider :name='$t("Специалист")'
                               rules='required'
                               class='pos-rel appoint-grid__item'
                               v-slot='{errors}'>
            <v-select :options='specs'
                      :disabled='currentFilter.sysName !== "cabinet"'
                      label='name'
                      :reduce='doc =>  doc.id'
                      v-model='appointModalData.rsr'
            >
              <template #no-options>
                {{ $t("Поиск специалиста") }}
              </template>
            </v-select>
            <span class='form__error'>{{ errors[0] }}</span>
          </validation-provider>


          <span class='form__label'>{{ $t("Тип записи") }}</span>
          <div class='appoint-grid__item'>
            <v-select :options='appointTypes'
                      label='name'
                      :reduce='type => type.sys_name'
                      v-model='appointModalData.a_t_sys_name'
            >
              <template #no-options>
                {{ $t("Поиск типа записи") }}
              </template>
            </v-select>
          </div>

          <span class='form__label'>{{ $t("Статус") }}</span>
          <div class='appoint-grid__item'>
            <v-select :options='appointStatus'
                      :key="appointModalData.sts"
                      label='name'
                      :reduce='type => type.id'
                      v-model='appointModalData.sts'
            >
              <template #no-options>
                {{ $t("Поиск статуса") }}
              </template>
            </v-select>
          </div>

          <span class='form__label'>{{ $t("Тип приема") }}</span>
          <div class='appoint-grid__item'>
            <v-select :options='receptionTypes'
                      label='name'
                      :reduce='type => type.id'
                      v-model='appointModalData.s_t'
            >
              <template #no-options>
                {{ $t("Поиск типа приема") }}
              </template>
            </v-select>
          </div>


          <span class='form__label'>{{ $t("Акция") }}</span>
          <div class='appoint-grid__item'>
            <v-select :options='advertOffers'
                      label='name'
                      :reduce='sale => sale.id'
                      v-model='appointModalData.a_o'
            >
              <template #no-options>
                {{ $t("Поиск акции") }}
              </template>
            </v-select>
          </div>
        </div>
      </div>



      <div class='appoint-errors text-red' v-if='appointError'>
        {{ appointError }}
      </div>

      <div class='btns-block'>
        <base-btn :text='$t("Добавить")'
                  class='apply-btn'
                  style='justify-self: end;'
                  type='submit'></base-btn>
      </div>
    </form>
  </validation-observer>
</template>

<script>

import { clock, pencil } from '@/helpers/icons.js';
import { appoint } from '@/mixins/Appoint.js';
import { searchPatient } from '@/mixins/SearchPatient.js';
import { handleNewKeysRevert } from '@/helpers/handleNewKeys.js';
import Times  from '@/components/times.vue';
import {
  calendarDateFormat,
  timeFormat,
} from '@/helpers/momentHelp.js';
import TextareaBase from '@/components/UI/TextareaBase.js';

import  PatientField  from '@/components/FormsFields/PatientField.vue';
import axios from "axios";
import {mapState} from "vuex";
export default {
  name: 'AppointTabComponent',
  mixins: [appoint, searchPatient, ],
  data() {
    return {
      clock,
      pencil,
      masks: {
        input: 'DD.MM.YYYY',
      },
      isPatientEdit: false,
      error: '',
    };
  },
  components: {
    times: Times,
    'textarea-base': TextareaBase,
    'patient-field': PatientField,
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.patientSurname.$el.querySelector('input').focus();
    });
  },
  methods: {
    updatePatient(val) {
      this.appointModalData.patient = val;
    },
    togglePatientMode() {
      this.isPatientEdit = !this.isPatientEdit;

      this.$nextTick(() => {
        if (this.isPatientEdit) {
          this.$refs.patientSurnameInput.focus();
        } else {
          this.appointModalData.patient.surname = '';
          this.$refs.patientSurname.$el.querySelector('input').focus();
        }
      });
    },
    async createAppoint() {
      let { a_t, s_t, a_o, sts, srs, cab, rsr, dur, patient, cmt, d_t_s } =
          this.appointModalData;
      let data =  {
            cab, rsr, dur,cmt,
            id: Math.random()* 100,
            d_t_s,
            patient: {
              p_s_n: patient.surname,
              p_f_n: patient.first_name,
              p_p_n: patient.patronymic,
              p_b: patient.birthday,
              p_g: patient.gender,
              p_p: patient.phone_number,
              p_c: 43
            },
            a_t,
            s_t,
            a_o,
            sts,
            srs,
          }


      if (this.isPatientEdit) {
        let patientRes = await axios.post(
            'https://jsonplaceholder.typicode.com/users/', this.appointModalData.patient),

            { id } = patientRes.data.model;
            data = {
              ...data,
              patient: id,
            };

        try {
          await this.$store.dispatch('appoint/createAppoint', data);
          this.isPatientEdit = false;
          this.$store.commit('addSnackBar', {
            type: 'success',
            descr: 'Запись успешно создана',
          });
        } catch (e) {
          this.$store.commit('addSnackBar', {
            type: 'error',
            descr: 'Ошибка создания записи',
          });
          return false;
        }
      } else {
        this.$store.dispatch('appoint/createAppoint', data);
      }
    },
  },
  watch: {},
  computed: {
    patientModeIcon() {
      return this.isPatientEdit ? 'arrowStroke' : 'plus';
    },
    ...mapState({
      theme: ({theme}) => theme,
      locale: ({locale}) => locale,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>

