import Vue from 'vue'
import VueRouter from 'vue-router'

import Appointment from '@/views/AppointPage/AppointPage.vue'
Vue.use(VueRouter)
import PatientPage from "@/views/PatientPage.vue";
import NotFound from "@/views/NotFound.vue";
import Patients from "@/views/Patients.vue";
import AuthorizationPage from "@/views/AuthorizationPage.vue";

const routes = [
  {
    path: '/',
    name: 'main',
    component: Appointment
  },
  {
    path: '/patients',
    name: 'patients',
    component: Patients
  },
  {
    path: '/patient/:id',
    name: 'patient',
    component: PatientPage
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthorizationPage
  },
  { name: "404", path: "/404", component: NotFound },
  { path: "*", redirect: "404" }, // Add the NotFound component route
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
