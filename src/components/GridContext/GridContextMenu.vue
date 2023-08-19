<template>
  <div class='grid-context-menu__list '
       v-click-outside='closeGridContextMenu'
       :style='cxtStyles'
  >
    <v-list>
      <v-list-item v-for='item in appointContextList'
                   :key='item.sysName'
                   :title='item.title'
                   @click.native='contextMenuHandler(item.sysName)'
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>

import { VList } from "../UI/VList/VList.js"
import { VListItem } from "../UI/VListItem/VListItem.js"
import { VIcon } from "../UI/VIcon/VIcon.js"
import { mapActions, mapMutations } from "../../libs/vuex.esm.browser.js"
export default {
  name: 'GridContextMenu',
  props: ['ctxMenu'],
  components: {
    'v-list': VList,
    'v-list-item': VListItem,
    'v-icon': VIcon
  },
  mounted() {
  },
  data() {
    return {
      contextMenu: [
        {sysName: 'copy', title: 'Копировать', icon: 'copy'},
        {sysName: 'cut', title: 'Вырезать', icon: 'cut'},
        {sysName: 'call', title: 'Позвонить', icon: 'call'},
        {sysName: 'paste', title: 'Вставить', icon: 'paste'},
      ],
    }
  },
  computed: {
    appointContextList() {
      let data = this.contextMenu
      if (!this.ctxMenu.copyMethod) {
        data = this.contextMenu.filter(el => el.sysName !== 'paste')
      } else {
        data = this.contextMenu.filter(el => el.sysName  == 'paste')
      }
      return data
    },
    cxtStyles() {
      return {
        top:  this.ctxMenu.top + "px",
        left: this.ctxMenu.left + "px"
      }
    }
  },
  methods: {
    ...mapActions('appoint', ['openModalFromCtx']),
    ...mapMutations('modal', ['openModal']),
    closeGridContextMenu(e) {
      e.stopPropagation()
      this.$store.commit('appoint/updatePayload', {option: 'ctxMenu', payload: {isVisible: false, copyMethod: ''}})
    },
    contextMenuHandler(sysName) {
      if (sysName !== 'paste') {
        this.$store.commit('appoint/updatePayload', {
          option: 'ctxMenu',
          payload: {
            ...this.ctxMenu,
            isVisible: false,
            copyMethod: sysName}})
      }

      if (sysName == 'call') {
        instance2.post('telephony/call/make/')
        this.$store.commit('appoint/updatePayload', {
          option: 'ctxMenu',
          payload: {
            ...this.ctxMenu,
            isVisible: false,
          }})
        return
      }

      if (sysName == 'paste') {
        this.$store.dispatch('appoint/openModalFromCtx')
        this.$store.commit('appoint/updatePayload', {
          option: 'ctxMenu',
          payload: {
            ...this.ctxMenu,
            isVisible: false,
          }})
      }

    }
  },
}
</script>

<style lang="scss" scoped>

</style>
