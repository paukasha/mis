import Vue from 'vue'
import  Tabs  from './Tabs/Tabs.vue';
import { BaseBtn } from './BaseBtn.js';
import { BtnsWrapper } from './BtnsWrapper.js';
import TextareaBase from './TextareaBase.js';
import { Checkbox } from './Checkbox.js';
import { Badge } from './Badge.js';
import { VueSelect } from "vue-select";
import CustomSelect from "@/components/UI/CustomSelect.vue";
import BaseSpinner from "@/components/UI/BaseSpinner/BaseSpinner.vue";
import CustomModal from "@/components/UI/CustomModal.vue";

Vue.component('v-select', VueSelect);
Vue.component('tabs', Tabs);
Vue.component('base-btn', BaseBtn);
Vue.component('custom-modal', CustomModal);
Vue.component('btns-wrapper', BtnsWrapper);
Vue.component('textarea-base', TextareaBase);
Vue.component('checkbox', Checkbox);
Vue.component('badge', Badge);
Vue.component('custom-select', CustomSelect);
Vue.component('base-spinner', BaseSpinner);
