import  Calendar  from '../Calendar/Calendar.vue';

export const HeaderBottom = {
  delimiters: ['#{', '}'],
  props: ['pageTitle'],
  components: {
    calendar: Calendar,
  },
  data() {
    return {};
  },
  methods: {
    openModal() {
      this.$emit('open-modal');
    },
  },
  template: `<div class='header__bottom'>
                <h1 class='title'>#{pageTitle}</h1>

                <slot></slot>
                    
                <base-btn 
                          class="header__filter-btn"
                            icon='filter'
                            :text='$t("Фильтры")'
                            @click.native='openModal'
                ></base-btn>

                <calendar class="header__bottom-calendar" ></calendar>
            </div>`,
};
