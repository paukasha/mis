<template>
  <div class='burger-menu'
       v-click-outside="closeBurgerMenu">
    <div class='fixed-burger'
         style='position: fixed'>
      <div class='accord'>
        <div v-for='(item, key) in sideMenuList'
             :key='key'
             class='accord__item'>
          <div class='accord__main'
               :class="key === 'tasks' ?  'accord__main--disabled' : ''"
               >
            <div class='accord__item-icon'
                 v-html='sideMenuIcons[key]'
            ></div>
            <span class='accord__title'
                  @click="goTo(sideMenuList[key].link)"


            >{{ $t('navMenu.' +sideMenuRus[key]) }} </span>
            <div class="accord-arrow" v-html='arrow'></div>
          </div>

          <div v-if='item.isOpen'
               class='accord__content'>
            <div  v-for='link in item.items'
                  :key='link.title'>

              <div  class='accord'
                    v-if='link?.subLinks?.length'>
                <div class='accord__main'
                     @click='link.isOpen = !link.isOpen'>
                                      <span class='accord__title'>
                                        {{ link.title }}
                                      </span>
                  <div class="accord-arrow" v-html='arrow'></div>
                </div>

                <div v-if='link.isOpen'
                     class='accord__content' style='padding-left: 10px'>
                  <div
                      v-for='sublink in link.subLinks'
                      :key='link.title'>
                    <a :href="calcLink(sublink.link)">
                      {{ sublink.title }}
                    </a>
                  </div>
                </div>
              </div>

              <a v-else
                 :href="calcLink(link.link)">{{ link.title }}</a>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { sideMenuIcons, arrow } from '../helpers/icons.js';
import { sideMenuList, sideMenuRus } from '../helpers/dicts.js';
export default {
  name: 'BurgerMenu',
  data() {
    return {
      arrow,
      sideMenuIcons,
      sideMenuRus,
      sideMenuList,
    };
  },
  methods: {
    closeBurgerMenu() {
      this.$store.commit('panels/closePanel', 'isBurgerMenuOpened');
    },
    calcLink(link) {
      return gns.baseUrl2 + link;
    },

    goTo(name) {
      if (name === 'tasks') return
      this.$router.push({name}).catch(e => console.log(e))
      this.closeBurgerMenu()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

