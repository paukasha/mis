export let Icon = Vue.component('icon',{
  props: ['source'],
  template: `<img  v-if="source"
                   class="appoint__icon-img" 
                   :src='source' />`
})