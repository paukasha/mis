<template>
  <div>

  </div>
</template>

<script>
import { pencil } from '@/helpers/icons.js';
import { dateFormat } from '@/helpers/momentHelp.js';
import { mapMutations } from 'vuex';

export default {
  name: 'WaitListCard',
  delimiters: ['#{', '}'],
  props: ['waitItem'],
  mixins: [],
  data() {
    return {
      pencil,
      isCommentEdit: false,
      comment: '',
    };
  },
  components: {
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['modal', ['openModal'], 'filterWaitList']),
    editComment() {
      const textarea = this.$refs['textarea-' + this.waitItem.id][0];
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
    },

    deleteWaitItem() {
      waitListApi
          .deleteWaitItem(this.waitItem.id)
          .then(() => this.$store.commit('filterWaitList', this.waitItem.id));
    },
    inputEvent(e) {
      this.comment = e;
    },

    updateWaitItem() {
      waitListApi
          .updateWaitListItem(this.waitItem.id, {
            new_comment: this.waitItemReformed.cmt,
            wlid: this.waitItem.id,
          })
          .then(() => {
            this.isCommentEdit = false;
          });
    },
    looseBlur(e) {
      this.$nextTick(() => {
        e.target.blur();
        this.isCommentEdit = false;
      });
    },
    cancel() {
      this.isCommentEdit = false;
      this.comment = '';
    },
    async createAppoint() {
      let { data } = await instance2.get(
              `appoint/patient/${this.waitItem.patient.id}`
          ),
          {
            id,
            birthday,
            surname,
            first_name,
            patronymic,
            gender,
            phone_number,
          } = data.patient,
          patient = {
            id,
            birthday,
            surname,
            first_name,
            patronymic,
            gender,
            phone_number,
          };

      let modalData = {
        ...this.waitItem,
        d_t_s: moment(this.waitItem.d_t_s).format('YYYY-MM-DD'),
        patient,
        tab: 'appoint',
      };
      this.$store.commit('modal/updateAppointModalData', modalData);
      this.$store.commit('modal/openModal', 'isAppointModalOpened');
    },
  },
  computed: {
    waitItemReformed() {
      return {
        ...this.waitItem,
        cmt: this.waitItem.cmt + this.comment,
        creation_date: dateFormat(this.waitItem.creation_date),
        d_t_s: dateFormat(this.waitItem.d_t_s),
      };
    },
  },
  watch: {
    isCommentEdit(val) {
      if (val) {
        this.$nextTick(() => {
          const textarea =
              this.$refs['textarea-' + this.waitItem.id].$refs[
              'textarea-' + this.waitItem.id
                  ];
          textarea.focus();
          textarea.selectionStart = textarea.value.length;
        });
      }
    },
  },

}
</script>

<style lang="scss" scoped>

</style>

export default Vue.component('wait-list-card', {

  template: `<div class='wait-list__item'>
                <div>
                    <span class='card__label'>Врач</span>
                    <span>#{waitItemReformed.resource_full_name_ab}</span>
                </div>
                
                <div>
                    <span class='card__label'>Пациент</span>
                    <span class='card__label-main-text'>#{waitItemReformed.patient_name}
                        <br>
                        <span class='card__label-bold' 
                              style='font-weight: 500'>
                        #{waitItemReformed.patient_phone}
                        </span>
                    </span>
                                    
                    <span class='card__label'>
                          Желаемая дата приема
                    </span>
                    <span>#{waitItemReformed.d_t_s}</span>
                                    
                    <span class='card__label'>Примечание</span>
                    <div class='card__edit-block'>
                          <div>
                            <textarea-base :readonly='!isCommentEdit'
                                            @custom-blur='looseBlur'
                                            class='textarea-base form__textarea'
                                            :id='waitItem.id'
                                            @update:val='inputEvent($event)'
                                            :ref='"textarea-"+waitItem.id'
                                            v-model='waitItemReformed.cmt'
                            >
                            </textarea-base>

                          </div>
                                      
                          <span v-html='pencil'
                                v-if='!isCommentEdit'
                                @click='isCommentEdit = true'
                          ></span>
                                        
                          <div class='wait__item-btns'
                                v-if='isCommentEdit'>
                              <base-btn text='Отмена' 
                                        class="card-delete-btn wait-list-btn"
                                        @mousedown.native='cancel'
                                        >
                                </base-btn>
                                            
                              <base-btn text='Изменить'
                                        class='apply-btn wait-list-btn'
                                        @mousedown.native='updateWaitItem($event)'
                                        >
                              </base-btn>
                           </div>
                     </div>
                                   
                                    
                    <span class='card__label'>
                          Дата добавления 
                    </span>
                    <span>#{waitItemReformed.creation_date}</span>
                 </div>

              <div class='actions-btns'>
                <base-btn text='Удалить' 
                          class="card-delete-btn wait-list-btn"
                          @click.native='deleteWaitItem'
                          >
                  </base-btn>
                      
                <base-btn text='Записать'
                          class='apply-btn wait-list-btn'
                          @click.native='createAppoint'
                >
                </base-btn>
           </div>
        </div>
  `,
});
