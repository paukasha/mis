<template>
  <div class='panel__wrapper wait-list-panel'>
    <div class='panel__top'>
      <div class='panel__titles'>
                      <span v-html='arrowStroke'
                            class='back-btn'
                            @click='backToWaitList'
                      ></span>
        <h2 class='panel__title'>
          Добавление в лист ожидания
        </h2>
      </div>

      <div v-html='cross'
           class='cross'
           @click='hidePanel("isCreateWaitListItemOpened")'
      ></div>
    </div>

    <div class='panel__content'>
      <ValidationObserver v-slot="{invalid, handleSubmit, validate, errors}">
        <form class='patient-content'
              @submit.prevent='handleSubmit(addWaitItem)'>

          <span class='form__label'>Фамилия</span>
          <div class='search-patient-block'>
            <ValidationProvider name='Фамилия'
                                class='pos-rel'
                                rules='required'
                                v-slot='{validate, errors}'>
              <!-- vee-validate не обрабатывает объект v-select поэтому нужен скрытый инпут с конкретным значением -->
              <input type='hidden'
                     style='opacity: 0'
                     class='form-input'
                     v-model='waitListData.patient.surname'
              >
              <v-select v-if='!isPatientEdit'
                        :options='patients'
                        :clearable='false'
                        ref='patientSurname'
                        label='full_name_ab_bd'
                        :filterable='false'
                        @search='searchPatient'
                        v-model='waitListData.patient'
              >
                <template #selected-option>
                  <span>#{waitListData.patient.surname}</span>
                </template>
                <template #no-options>
                  Поиск пациента
                </template>
              </v-select>

              <input type='text'
                     v-else
                     class='form-input'
                     v-model='waitListData.patient.surname'
                     ref='patientSurname'
              >

              <span v-if='errors[0]'
                    class='form__error'>#{errors[0]}</span>
            </ValidationProvider>

            <base-btn icon='plus'
                      @click.native='editPatient'
            ></base-btn>
          </div>


          <span class='form__label'>Имя</span>
          <ValidationProvider name="Имя" class='pos-rel' rules='required' v-slot='{errors}'>
            <input type='text'
                   class='form-input'
                   :readonly='!isPatientEdit'
                   v-model='waitListData.patient.first_name'
            >
            <span v-if='errors[0]'
                  class='form__error'>#{errors[0]}</span>
          </ValidationProvider>


          <span class='form__label'>Отчество</span>
          <ValidationProvider name='Отчество' class='pos-rel' rules='required' v-slot='{errors}'>
            <input type='text'
                   class='form-input'
                   v-model='waitListData.patient.patronymic'
                   :readonly='!isPatientEdit'
            >
            <span v-if='errors[0]'
                  class='form__error'>
                                     #{errors[0]}
                               </span>
          </ValidationProvider>


          <span class='form__label'>Дата рождения</span>
          <ValidationProvider name='Дата рождения'
                              class='pos-rel'
                              rules='required|min:8'
                              v-slot='{errors,}'
          >
            <input type='text'
                   class='form-input form-input-date'
                   v-model='waitListData.patient.birthday'
                   :readonly='!isPatientEdit'
                   v-mask='"##.##.####"'
            >
            <br>
            <span v-if='errors[0]'
                  class='form__error'>
                                     #{errors[0]}
                               </span>
          </ValidationProvider>



          <span class='form__label'>Специалист</span>
          <ValidationProvider name='Специалист'
                              rules='required'
                              class='pos-rel'
                              v-slot='{errors}'>
            <v-select :options='specs'
                      label='name'
                      :reduce='cab => cab.id'
                      v-model='waitListData.rsr'
            >
              <template #no-options>
                Поиск специалиста
              </template>
            </v-select>
            <span class='form__error'>#{errors[0]}</span>
          </ValidationProvider>


          <span class='form__label'>Дата</span>
          <ValidationProvider name='Дата'
                              rules='required'
                              class='pos-rel'
                              v-slot='{errors}'>
            <v-date-picker v-model="waitListData.date"
                           :masks="masks">
              <template v-slot="{ inputValue, inputEvents, togglePopover}">
                <input type='text'
                       class='form-input form-input-date date-input'
                       @input="inputEvents.input"
                       :value="inputValue"
                       @click="togglePopover({ transition: 'fade'})"
                       v-mask='"##.##.####"'
                >
              </template>
            </v-date-picker>
            <span class='form__error'>#{errors[0]}</span>
          </ValidationProvider>

          <span class='form__label'>Телефон</span>
          <input type='text'
                 class='form-input '
                 v-model='waitListData.patient.phone_number'
          >
          <span v-if='errors[0]'
                class='form__error'>
                                    #{errors[0]}
                              </span>

          <span class='form__label'>Комментарий</span>
          <textarea-base class='form__textarea textarea-base'
                         v-model='waitListData.comment'
          >
          </textarea-base>


          <div class='add-wait-item-btns'>
            <base-btn text='Добавить'
                      class='apply-btn'
                      type='submit'>
            </base-btn>

            <base-btn text='Отмена'
                      @click.native='backToWaitList'
            ></base-btn>
          </div>

        </form>
      </ValidationObserver>
    </div>
  </div>

</template>

<script>
import { arrowStroke, cross } from "@/helpers/icons.js";
import { mapMutations, mapState } from "vuex";
import { searchPatient } from "@/mixins/SearchPatient.js";

import TextareaBase from "../../UI/TextareaBase.js";
export default {
  name: 'CreateWaitListItem',
  delimiters: ["#{", "}"],
  mixins: [searchPatient],
  data() {
    return {
      arrowStroke,
      cross,
      isPatientEdit: false,
      masks: {
        input: "DD.MM.YYYY",
      },

      waitListData: {
        patient: { surname: "" },
        rsr: "",
        date: "",
        comment: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.waitListData.patient.surname) {
        this.$refs.patientSurname.$el.querySelector("input").focus();
      }
    });
  },
  components: {
    "textarea-base": TextareaBase,
  },
  methods: {
    ...mapMutations("panels", ["openPanel", "closePanel"]),
    backToWaitList() {
      this.$store.commit("panels/openPanel", "isWaitListOpened");
      this.$store.commit("panels/closePanel", "isCreateWaitListItemOpened");
    },
    hidePanel() {
      this.$store.commit("panels/closePanel", "isCreateWaitListItemOpened");
    },
    async addWaitItem() {
      let data = {
        birthday: this.waitListData.patient.birthday,
        comment: this.waitListData.comment,
        desired_date: moment(this.waitListData.date).format("YYYY-MM-DD"),
        first_name: this.waitListData.patient.first_name,
        patronymic: this.waitListData.patient.patronymic,
        phone_number: this.waitListData.patient.phone_number,
        surname: this.waitListData.patient.surname,
        wait_list_pat_id: this.waitListData.patient.id,
        wlf_resource: this.waitListData.rsr,
      };
      await waitListApi.addWaitItem(data).then(() => {
        this.backToWaitList();
      });
    },
  },
  computed: {
    ...mapState({
      specs: (state) => state.specs,
    }),
  },
  watch: {
    isPatientEdit(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.patientSurname.focus();
        });
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
