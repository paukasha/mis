<template>
  <ValidationObserver
      v-slot="{invalid, handleSubmit, errors}"
      :key='helperKey'>
    <form @submit.prevent='handleSubmit(createTask)'>
      <div class='modal__content'>
        <div class='modal-total modal__content-left'>
          <span class='form__label'>{{ $t('Специалист') }}</span>
          <v-select :options='specs'
                    :disabled='currentFilter.sysName !== "cabinet"'
                    label='name'
                    :reduce='doc => doc.id'
                    v-model='modalData.rsr'>
            <template #no-options>
              {{ $t('Поиск специалиста') }}
            </template>
          </v-select>

          <span class='form__label'>{{ $t('Дата') }}</span>

          <input type='text'
                 readonly
                 class='form-input form-input-date'
                 v-model='taskDate'
          >


          <span class='form__label'>Время</span>
          <times :start.sync='appointModalData.d_t_s'
                 :dur.sync='appointModalData.dur'
          ></times>

          <span class='form__label'>Кабинет</span>
          <v-select :options='cabinets'
                    label='name'
                    :reduce='cab => cab.id'
                    v-model='appointModalData.cab'
          >
            <template #no-options>
              {{ $t('Поиск по кабинетам') }}
            </template>
          </v-select>

          <span class='form__label'>{{ $t('Комментарий') }}</span>
          <textarea class='form__textarea'
                    v-model='appointModalData.cmt'
          ></textarea>
        </div>
      </div>

      <btns-wrapper>
        <template #left-btns>

          <base-btn :text='$t("Добавить")'
                    class='apply-btn'
                    type='submit'
          ></base-btn>

        </template>

        <template #right-btns>
          <base-btn :text='$t("Удалить")'
                    v-if='appointModalData.isAppointEdit'
                    style='justify-self: start;'
                    class='red-btn'
                    type='button'
                    @click.native='deleteAppointTask(appointModalData.id)'
          ></base-btn>
        </template>
      </btns-wrapper>
    </form>
  </ValidationObserver>
</template>

<script>
import { dateTimeBackFormat } from "@/helpers/momentHelp.js";
import { appoint } from "@/mixins/Appoint.js";
import { TextBtnMixin } from "@/mixins/TextBtnMixin.js";
import  Times from "@/components/times.vue";
import { dateFormat } from "@/helpers/momentHelp.js";
export default {
  name: 'TaskTabContent',
  mixins: [appoint, TextBtnMixin],
  components: {
    times: Times,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    taskDate() {
      return dateFormat(this.appointModalData.d_t_s)
    }
  },
  methods: {
    async addOrUpdateTask() {
      let taskData = {
        id: this.localData.id,
        owner: gns.currentUser,
        dur: this.localData.dur,
        d_t_s: dateTimeBackFormat(this.localData.d_t_s),
        cmt: this.localData.cmt,
        rsr: this.localData.rsr,
        cab: this.localData.cab,
      };

      if (!this.localData.isAppointEdit) {
        await this.$store.dispatch("appoint/createAppointTask", taskData);
        this.$store.commit("modal/closeModal", "isAppointModalOpened");
      } else {
        await this.$store.dispatch("appoint/updateAppointTask", taskData);
        this.$store.commit("modal/closeModal", "isAppointModalOpened");
      }
    },
    async createTask() {
      let taskData = {
        // id: this.appointModalData.id,
        // owner: gns.currentUser,
        dur: this.appointModalData.dur,
        d_t_s: dateTimeBackFormat(this.appointModalData.d_t_s),
        cmt: this.appointModalData.cmt,
        rsr: this.appointModalData.rsr,
        cab: this.appointModalData.cab,
      };

      await this.$store.dispatch("appoint/createAppointTask", taskData);
      this.$store.commit("modal/closeModal", "isAppointModalTabsOpened");
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
