import { Search } from '../../Search.js';
import { TemplateCard } from './TemplateCard.js';
import { MessageCenterApi } from '../../../api/appointVue.js';
import TextareaBase from '../../UI/TextareaBase.js';
import { mapMutations } from '../../../libs/vuex.esm.browser.js';

export const McTemplateModal = {
  delimiters: ['#{', '}'],
  components: {
    search: Search,
    'mc-template-card': TemplateCard,
    'textarea-base': TextareaBase,
  },
  data() {
    return {
      tabs: ['Общие', 'Личные'],
      activeTabText: 'Общие',
      templates: [],
      searchStr: '',
      isFormOpened: false,
      newTemplate: {
        title: '',
        text: '',
      },
    };
  },
  mounted() {
    this.getTemplates();
  },
  methods: {
    ...mapMutations('modal', ['closeModal']),
    ...mapMutations('messageCenter', ['updateCurrentMcTemplate']),
    async getTemplates() {
      await MessageCenterApi.getMctemplates().then(
        ({ data }) => (this.templates = data)
      );
    },
    openAddForm() {
      this.isFormOpened = true;
    },
    async addTemplate() {
      await MessageCenterApi.createMctemplate({
        ...this.newTemplate,
        accessibility: 2,
      }).then(({ data }) => {
        this.templates.push(data);
        this.newTemplate = {
          title: '',
          text: '',
        };
        this.closeForm();
      });
    },
    closeForm() {
      this.isFormOpened = false;
    },
    pasteTemplateToMessageText(templateText) {
      this.$store.commit('messageCenter/updateCurrentMcTemplate', templateText);
      this.$store.commit('modal/closeModal', 'isMcTemplateModalOpened');
    },
  },
  computed: {
    filteredTemplates() {
      let data = this.templates.filter((el) => {
        return this.activeTabText === 'Общие'
          ? el.accessibility == 1
          : el.accessibility == 2;
      });

      if (this.searchStr) {
        data = data.filter(
          (el) =>
            el.text.toLowerCase().includes(this.searchStr.toLowerCase()) ||
            el.title.toLowerCase().includes(this.searchStr.toLowerCase())
        );
      }

      return data;
    },
  },
  template: `<custom-modal :is-dark='true'
                          :width='400'
                          :cross='true'
                          modalName='isMcTemplateModalOpened'>
  <div class='mc-temp-wrapper'>
              <tabs :tabList="tabs" 
                    @change-tab='activeTabText = $event'>
                <template>
                  <div v-if='isFormOpened'>
                    <ValidationObserver v-slot="{invalid, handleSubmit, validate, errors}" >
                      <form @submit.prevent='handleSubmit(addTemplate)' 
                            class='common-form'>
                        <ValidationProvider name="Название шаблона"
                                            rules='required' 
                                            v-slot='{errors}'
                          >
                            <input type='text' 
                                    class='form-input' 
                                    placeholder='Введите название*'
                                    v-model='newTemplate.title'>
                            <span v-if='errors[0]'
                                  class='form__error'>#{errors[0]}
                              </span>
                        </ValidationProvider>
                             
                        <ValidationProvider name='Текст шаблона'
                                          rules='required' 
                                          v-slot='{errors}'>
                          <textarea-base class='form__textarea textarea-base'
                                          placeholder='Введите текст*'
                                          v-model='newTemplate.text'
                            >
                          </textarea-base>
                          <span v-if='errors[0]'
                                class='form__error'>#{errors[0]}
                          </span>
                        </ValidationProvider>
                             
                        <div class='actions-btns'>
                          <base-btn text='Сохранить' 
                                    class='apply-btn text-xxs-400'
                                    type='submit'
                                    >
                          </base-btn>
                          <base-btn text='Отменить'
                                    @click.native='closeForm'
                          ></base-btn>
                        </div>
                      </form>
                    </ValidationObserver>
                  </div>
                
                  <div class='modal-templates__content'
                        v-else>
                    <search placeholder='Поиск шаблона'
                            :search='searchStr'
                              @update-search='searchStr = $event'
                    ></search>
                    <base-btn icon='plus'
                              @click.native='openAddForm'
                    ></base-btn>
                    
                    <div class='mc-templ-content'>
                      <mc-template-card v-for='template in filteredTemplates'
                                       :key='template.id'
                                       :template='template'
                                       @dblclick.native='pasteTemplateToMessageText(template.text)'
                      ></mc-template-card>
                    </div>
                  </div>
                </template>
              </tabs>
            </div>
</custom-modal>
`,
};
