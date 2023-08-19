import {
  mapState,
  mapMutations,
  mapActions,
} from '../libs/vuex.esm.browser.js';

export const appoint = {
  delimiters: ['#{', '}'],
  data() {
    return {
      appointModalData: {
        patient: {
          surname: '',
          name: '',
          patronymic: '',
          gender: '',
          phone_number: '',
          birthday: '',
        },

        extra_info: '',
        cmt: '',
        cab: '',
        srs: '', // источник
        a_t: '', // тип записи
        rsr: '', // специалист
        sts: '', // статус
        s_t: '', // тип приема
        a_o: '', // акция
      },
      helperKey: 0,
      isLocalDataChanged: false,
    };
  },
  mounted() {
    this.appointModalData = {
      ...this.appointModalData,
      ...this.modalData,
    };
    this.helperKey++;
  },

  watch: {
    modalData: {
      handler(val) {
        this.appointModalData = {
          ...this.appointModalData,
          ...val,
        };
        this.helperKey++;
      },
      deep: true,
    },
    patientNotFound(val) {
      if (val) {
        this.appointModalData.patient.surname = val;
      }
    },
  },

  methods: {
    ...mapMutations('modal', ['updateAppointModalData']),
    ...mapActions('appoint', ['deleteAppoint', 'deleteAppointTask']),
  },
  computed: {
    ...mapState({
      specs: (state) => state.specs,
      cabinets: (state) => state.cabinets,
      currentFilter: (state) => state.currentFilter,
      advertOffers: (state) => state.appoint.advertOffers,
      appointSources: (state) => state.appoint.appointSources,
      receptionTypes: (state) => state.appoint.receptionTypes,
      appointTypes: (state) => state.appoint.appointTypes,
      appointStatus: (state) => state.appoint.appointStatus,
      appointError: (state) => state.appoint.appointError,
      rejectionReasons: (state) => state.appoint.rejectionReasons,
      modalData: (state) => state.modal.appointModalData,
    }),
  },
};
