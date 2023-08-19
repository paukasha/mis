<template>
  <custom-modal modalName='isAppointModalTabsOpened'
                :cross='true'>
    <tabs :tabList="tabs">
      <template v-slot:[appointSlotName] >
        <appoint-tab-content
            v-if='!isAppointEdit'
            @patient-edit='isPatientEdit = $event'
            class="tab">
        </appoint-tab-content>
        <edit-appoint-tab-content
            v-if='isAppointEdit'>

        </edit-appoint-tab-content>
      </template>

      <template v-slot:[taskSlotName]>
        <task-tab-content class="tab"
        ></task-tab-content>
      </template>
    </tabs>
  </custom-modal>
</template>

<script>
import {
  mapState,
} from 'vuex';
import TaskTabContent from './Tabs/TaskTabContent.vue';
import AppointTabContent  from './Tabs/AppointTabContent.vue';
import  EditAppointTabContent  from './Tabs/EditAppointTabContent.vue';
export default {
  name: 'AppointModalTabs',
  delimiters: ['#{', '}'],
  data() {
    return {
      currentTab: '',
      currentPatient: '',

      isPatientEdit: false,
    };
  },
  components: {
    'appoint-tab-content': AppointTabContent,
    'edit-appoint-tab-content': EditAppointTabContent,
    'task-tab-content': TaskTabContent,
  },
  computed: {
    ...mapState({
      modalData: (state) => state.modal.appointModalData,
      isAppointEdit: (state) => state.modal.isAppointEdit,
      isTaskEdit: (state) => state.modal.isTaskEdit,
    }),
    tabs() {
      let tabs = ['Добавление записи', 'Добавление задачи'];

      this.isAppointEdit
          ? (tabs = ['Редактирование записи'])
          : this.isTaskEdit
              ? (tabs = ['Редактирование задачи'])
              : tabs;

      return tabs;
    },
    appointSlotName() {
      if (!this.isTaskEdit) return 'tabPanel-1'
      return ''
    },
    taskSlotName() {
      if (this.isTaskEdit) return 'tabPanel-1'
      return 'tabPanel-2'
    }
  },


}
</script>

<style lang="scss" scoped>

</style>

