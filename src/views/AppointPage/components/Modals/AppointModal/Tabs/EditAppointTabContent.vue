<template>
  <validation-observer v-slot="{invalid, handleSubmit, reset, errors}"
                       :key='helperKey'
                       ref='formObserver'
  >
    <form @submit.prevent='beforeSubmit().then(() => handleSubmit(updateAppoint))' class='appoint__edit-form grid'>
      <div class='modal__content'>
        <div class='modal-total modal__content-left'>
          <h3 class='form__title'>{{ $t("Пациент") }}</h3>
          <span class='form__label'>{{ $t("Фамилия") }}</span>
          <validation-provider name='Фамилия'
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
            <v-select :options='patients'
                      :clearable='false'
                      label='full_name_ab_bd'
                      :filterable='false'
                      @search='searchPatient'
                      v-model='appointModalData.patient'
                      ref='patientSurname'
            >
              <template #selected-option>
                <span>{{ appointModalData.patient.surname }}</span>
              </template>
              <template #option="{ full_name_ab_bd, first_name, patronymic, surname, birthday, phone_number }">
                                      <span
                                          :title='showMoreInfo(first_name, patronymic, surname, birthday, phone_number)'
                                      >{{ full_name_ab_bd }}</span>
              </template>
              <template #no-options>
                {{ $t("Поиск пациента") }}
              </template>
            </v-select>

            <span v-if='errors[0]'
                  class='form__error'>{{ errors[0] }}</span>
          </validation-provider>


          <a v-html='pencil'
             target='_blank'
             href='#'
             class='base-btn patient__link'
             title='Перейти в карту пациента'

          ></a>

          <span class='form__label'>{{ $t("Имя") }}</span>
          <validation-provider name="Имя"
                               class='pos-rel appoint-grid__item'
                               rules='required'
                               v-slot='{errors}'>
            <input type='text'
                   class='form-input'
                   readonly
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
                   readonly
            >
          </div>

          <span class='form__label'>{{ $t("Пол") }}</span>
          <validation-provider name='Пол'
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
                 readonly
          >
          <!-- </div> -->

          <span class='form__label'>{{ $t("Дата рождения") }}</span>
          <validation-provider name='Дата рождения'
                               style="text-align: left;"
                               rules='required|min:8'
                               v-slot='{errors,}'
                               class='pos-rel appoint-grid__item'
          >
            <input type='text'
                   class='form-input form-input-date'
                   v-model='appointModalData.patient.birthday'
                   readonly
                   v-mask='"##.##.####"'
            >
            <br>
            <span v-if='errors[0]'
                  class='form__error'>{{ errors[0] }}</span>
          </validation-provider>


          <span class='form__label'>{{ $t("Доп. информация") }}</span>
          <div class='appoint-grid__item'>
                            <textarea class='form__textarea'
                                      readonly
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
                          :is-dark="theme==='custom-dark-theme'"
                          mode='date'
                          style="text-align: left;"
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
          <validation-provider name='Кабинет'
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
          <validation-provider name='Источник'
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
          <validation-provider name='Специалист'
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
                      :key="appointModalData.a_t"
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

      <div class='visit-badges'>
        <badge class='badge-red'
               text='Задолженность 300'
        ></badge>

        <badge class='badge-green'
               text='Депозит 500'
        ></badge>
      </div>


      <div class='appoint-errors text-red' v-if='appointError'>
        {{ appointError }}
      </div>


      <btns-wrapper>
        <template #left-btns>
          <base-btn :text='$t("Изменить")'
                    class='apply-btn'
                    style='justify-self: end;'
                    type='submit'
          ></base-btn>

        </template>

        <template #right-btns>
          <validation-provider name='Причина отказа'
                               :rules='{required_if: wantDelete === true}'
                               class='pos-rel'
                               ref='rejectionReason'
                               v-slot='{errors}'>
            <v-select :options='rejectionReasons'
                      :placeholder='$t("Причина отказа")'
                      :key="appointModalData.rejectionReasons"
                      label='name'
                      :reduce='reason => reason.id'
                      v-model='appointModalData.r_r'
            >
              <template #no-options>
                {{ $t("Поиск причины отказа") }}
              </template>
            </v-select>

            <span v-if='errors[0]'
                  class='form__error'>{{ errors[0] }}</span>
          </validation-provider>

          <base-btn :text='$t("Удалить")'
                    class='red-btn'
                    type='button'
                    @click.native='deleteAppoint(appointModalData.id)'
          ></base-btn>

          <base-btn :text='$t("Отмена")'
                    type='button'
                    @click.native='closeModal'
          ></base-btn>
        </template>
      </btns-wrapper>
    </form>
  </validation-observer>
</template>

<script>
import {clock, pencil} from '@/helpers/icons.js';
import {appoint} from '@/mixins/Appoint.js';
import {searchPatient} from '@/mixins/SearchPatient.js';
import {handleNewKeysRevert} from '@/helpers/handleNewKeys.js';
import Times from '@/components/times.vue';
import TextareaBase from '@/components/UI/TextareaBase.js';
import {Visit} from '@/components/VisitCart/VisitCart.js';

import {Badge} from '@/components/UI/Badge.js';
import {sortObjKeys} from '@/helpers/handleObjFn.js';
import {BtnsWrapper} from '@/components/UI/BtnsWrapper.js';
import moment from "moment";
import {mapState} from "vuex";

export default {
  name: 'EditAppointTabContent',

  mixins: [appoint, searchPatient],
  data() {
    return {
      clock,
      pencil,
      masks: {
        input: 'DD.MM.YYYY',
      },
      error: '',
      copyappointModalData: '',
      wantDelete: false,
      legalRepresentative: '',
    };
  },
  components: {
    times: Times,
    'textarea-base': TextareaBase,
    visit: Visit,
    badge: Badge,
    'btns-wrapper': BtnsWrapper,
  },
  async mounted() {


  },
  methods: {
    closeModal() {
      this.$store.commit('modal/closeModal', 'isAppointModalTabsOpened');
    },

    async beforeSubmit() {
      if (this.wantDelete) {
        this.wantDelete = false;
        return await new Promise((resolve) => {
          resolve(this.$refs.formObserver.reset());
        });
      }
    },
    async updateAppoint() {
      let {patient} = this.appointModalData;
      patient = handleNewKeysRevert(patient, 'patientForUpdateAppoint');

      let time = moment(this.appointModalData.d_t_s).format('HH:mm').split(':'),
          dateTime = moment(this.appointModalData.date).set({
            hours: time[0],
            minutes: time[1],
          });
      let data = {
        ...this.appointModalData,
        patient: handleNewKeysRevert(patient, 'patientForUpdateAppoint'),
        id: this.appointModalData.id,
        d_t_s: moment(this.appointModalData.d_t_s).format(
            'YYYY-MM-DDTHH:mm:ss'
        ),
      };

      await this.$store
          .dispatch('appoint/updateAppointVuex', {...data})
          .then((res) => {
            if (res?.response?.status != 500 || res.code != 'ERR_NETWORK') {
              this.closeModal();
            }
          })
          .catch((e) => {
            console.log(e);
            return false;
          });


    },

    isDataChanged() {
      let sortFilteredappointModalData = JSON.stringify(
              sortObjKeys({
                ...this.appointModalData,
                d_t_s: moment(this.appointModalData.date).format(),
              })
          ),
          sortModalData = JSON.stringify(
              sortObjKeys({
                ...this.copyappointModalData,
                d_t_s: moment(this.copyappointModalData.d_t_s).format(),
              })
          ),
          isDataChanged = false;

      // console.log(sortFilteredappointModalData);
      // console.log(sortModalData);

      if (sortFilteredappointModalData !== sortModalData) {
        isDataChanged = true;
      }
      this.$store.commit('appoint/updatePayload', {
        option: 'isAppointModalDataChanged',
        payload: isDataChanged,
      });

      return isDataChanged;
    },
    async deleteAppoint(id) {
      await new Promise((resolve) => resolve((this.wantDelete = true)));

      if (this.wantDelete) {
        const provider = this.$refs['rejectionReason'];
        await provider.validate().then((res) => {
          if (res.valid) {
            this.wantDelete = false;
            this.$store
                .dispatch('appoint/deleteAppoint', {
                  id,
                  r_r: this.appointModalData.r_r,
                })
                .catch((e) => {
                  return false;
                });

            this.closeModal();
          }
        });
      }
    },
  },
  computed: {
    ...mapState({
      theme: ({theme}) => theme
    }),
    visitProperties() {
      let {isAppointEdit, rsr, date} = this.appointModalData;
      return {
        isAppointEdit,
        rsr,
        date,
      };
    },
  },

}
</script>

<style lang="scss" scoped>

</style>
