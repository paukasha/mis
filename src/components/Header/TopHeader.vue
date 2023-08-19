<template>
  <header class='header'>
    <div class='container'>
      <div class='header-container'>
        <div class='header__item'>
          <base-btn icon='burger'
                    class='burger'
                    @click.native='switchPanel("isBurgerMenuOpened")'
          ></base-btn>
        </div>

        <div class='header__item logo'>
          <a href='/'>
            <img src='../../assets/icons/logo.svg'>
          </a>

        </div>

        <div class='header__item affiliate'>
          <custom-select :options="affiliates"
                         class="select"
          ></custom-select>
        </div>

        <div class='header__item header__item-date'>
          <date-time></date-time>
        </div>

        <div class='header__item header__item-global-search'>
          <div class="global__search">
            <div class='search__hidden'></div>
            <search :placeholder='$t("searchPatient")'
                    :search='globalSearch'
                    @focus-handler='focusHandler'
                    :loading='isLoading'
                    @update-search='globalSearch = $event'
            ></search>
            <div v-if="isResultOpened"
                 class="global__search-result"
                 v-click-outside="closeResult"
            >

              <div v-for="result in globalSearchResult"
                   :key="result.id">
<!--                :href="baseLink + '/patient/'+ result.id + '/'"-->
                <span @click="goTo(result)"
                             :title="showMore(result)"
                >{{result.full_name_ab_bd}}</span>
              </div>
              <div v-if='!globalSearchResult.length'>Ничего не найдено</div>
            </div>
          </div>

        </div>

        <div class='header__item'>
          <base-btn icon='ruble'
                    @click.native='switchPanelVisibility("isPriceOpened")'
                    :class='{"base-btn--active": isPriceOpened}'
          ></base-btn>
        </div>

<!--        <div class='header__item'>-->
<!--          <base-btn icon='list'-->
<!--                    :class='{"base-btn&#45;&#45;active": isWaitListOpened}'-->
<!--                    @click.native='switchPanelVisibility("isWaitListOpened")'-->
<!--          ></base-btn>-->
<!--        </div>-->

        <div class='header__item header__account'>
          <dropdown  icon='account'
                     :list='accountMenuList'
                     :is-list-opened.sync='isMessagesMenuOpened'
                     @update:is-list-opened='isMessagesMenuOpened'
          >
          </dropdown>
        </div>


        <locale-btn></locale-btn>
        <theme-btn></theme-btn>

      </div>
    </div>
  </header>
</template>

<script>

import {
  mapMutations,
  mapState,
} from 'vuex';
import { Dropdown } from '../UI/Dropdown.js';
import { Search } from '../Search.js';
import DateTime from './DateTime.vue';
import axios from "axios";
import ThemeBtn from "@/components/ThemeBtn.vue";
import LocaleBtn from "@/components/LocaleBtn.vue";


export default {
  name: 'TopHeader',
  data() {
    return {
      currentUser: 'Иванов Ф. Н.',
      accountMenuList: [
        {
          sysName: 'user_data',
          text: 'Сидоров Ф. К.',
          icon: '',
        },
        { sysName: 'exit', text: 'Выйти из аккаунта', icon: '' },
      ],
      isMessagesMenuOpened: false,
      globalSearch: '',
      isLoading: false,
      isResultOpened: false,
      globalSearchResult: [],
      patientsRu: [
        {
          id: 1,
          gender: 'M',
          full_name_ab_bd: 'Иванов И. И',
          first_name: 'Иван',
          surname: 'Иванов',
          patronymic: 'Иванович',
          phone_number: '78787',
          birthday: '2000-12-04'
        },
        {
          id: 2,
          gender: 'M',
          full_name_ab_bd: 'Сидоров А. Ф',
          first_name: 'Антон',
          surname: 'Сидоров',
          patronymic: 'Федорович',
          phone_number: '9995555',
          birthday: '1995-07-05'
        },
        {
          id: 3,
          gender: 'Ж',
          full_name_ab_bd: 'Соловьева И. П.',
          first_name: 'Ирина',
          surname: 'Соловьева',
          patronymic: 'Павловна',
          phone_number: '987456',
          birthday: '1990-08-21'
        }
      ]


    };
  },
  mounted() {},
  components: {
    ThemeBtn,
    LocaleBtn,
    DateTime,
    dropdown: Dropdown,
    search: Search,
  },
  methods: {
    ...mapMutations('panels', ['switchPanelVisibility']),
    switchPanel(panelName) {
      this.$store.commit('panels/switchPanelVisibility', panelName);
    },
    goTo(result) {
      this.isResultOpened = false
      this.$router.push({name: 'patient', params: {id: result.id}})

    },
    updateSearch($event, loadFn) {
      if (!$event) {
        this.isResultOpened = false;
        return;
      }
      this.isLoading = true;
      clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(async () => {
        let { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/`)
        this.globalSearchResult = data;
        this.globalSearchResult =  this.patientsRu.filter(el => el.surname.toLowerCase().includes($event.toLowerCase()))
        this.isResultOpened = true;
        this.isLoading = false;
      }, 1500);
    },
    loadFn(bool) {
      return (this.isLoading = bool);
    },
    focusHandler() {
      if (this.globalSearchResult.length) {
        this.isResultOpened = true;
      }
    },
    showMore(patient) {
      return patient.phone;
    },
    closeResult(e) {
      if (e.target.classList.contains('form-input')) {
        this.isResultOpened = true;
        return;
      }

      if (
          !e.target.classList.contains('global__search-result') &&
          !e.target.closest('.global__search-result')
      ) {
        this.isResultOpened = false;
      }
    },


  },
  watch: {
    globalSearch(val) {
      this.updateSearch(val);
    },
  },
  computed: {
    ...mapState({
      isBurgerMenuOpened: (state) => state.panels.isBurgerMenuOpened,
      isWaitListOpened: (state) => state.panels.isWaitListOpened,
      isPriceOpened: (state) => state.panels.isPriceOpened,
      isMcOpened: (state) => state.panels.isMcOpened,
      affiliates: (state) => state.affiliates,
      locale: ({locale}) => locale,

    }),


  },
}

</script>

<style lang="scss" scoped>

</style>




// Компонент-шапка системы. Включает в себя иконкы открытия слайд-панелей, время, пользователя и кнопку-бургер меню(сам компонент меню находится в базовом шаблоне МИС)
export const TopHeader = {

  template: ``,
};
