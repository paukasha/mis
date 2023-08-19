import { mapState } from 'vuex';
import {services} from "@/helpers/dicts.js";

export const serviceMixin = {
  data() {
    return {
      services: [],
      selectedGroup: '',
      selectedService: '',
      totalList: [],
      printPageTemplate: '',
      warehouses: [
        {
          "id": 10,
          "warehouse_item_id": 10,
          "gtin": "04607143560391",
          "name": "Бинты",
          "code": "002",
          "group_name": "Расходники",
          "quantity": 0,
           sale_price: "50",
          "batchs": [
            {
              "id": 80,
              "warehouse": 2,
              "name": "Основной",
              "warehouse_name": "Основной",
              "series": null,
              "expire_date": "",
              "remains": 100
            }
          ]
        },
        {
          "id": 5,
          "warehouse_item_id": 5,
          "gtin": "04607143560391",
          "name": "Шприц",
          "code": "002",
          "group_name": "Расходники",
          "group": 3,
          "quantity": 0,
          sale_price: "20",
          "cost_value": 1500,
          "batchs": [
            {
              "id": 80,
              "warehouse": 2,
              "warehouse_name": "Основной",
              "name": "Основной",
              "series": null,
              "expire_date": "",
              "remains": 100
            }
          ]
        }
      ],
      selectedWarehouse: '',
    };
  },
  mounted() {
    this.warehouses = this.warehouses.map((el) => {
      let filterBatchOnWarehouse = el.batchs.reduce((acc, cur) => {
        acc[cur.warehouse] = acc[cur.warehouse] || {
          id: cur.warehouse,
          name: cur.warehouse_name,
          totalRemains: [],
        };
        acc[cur.warehouse].totalRemains.push(cur.remains);
        return acc;
      }, {});

      let result = Object.values(filterBatchOnWarehouse).map(
        (item) => {
          return {
            ...item,
            totalRemains: item.totalRemains.reduce(
              (prev, next) => prev + next,
              0
            ),
          };
        }
      );

      return {
        ...el,
        batchs: result,
      };
    });
  },
  computed: {
    ...mapState({
      serviceGroups: (state) => state.serviceGroups,
    }),
    filteredServices() {
      let data = services
      if (this.selectedGroup.id) {
        data = data.filter(el => el.type===this.selectedGroup.id)
      }
      return data
    }
  },
  watch: {
    selectedGroup() {
      this.selectedService = ''
    }

  },
  methods: {
    getPrintTemplate() {

    },

    getServices(search, loading) {
      clearTimeout(this.timer);
      if (search.length) {
        loading(true);
        this.timer = setTimeout(() => {
          return priceApi
            .getServices({ query: search })
            .then((res) => {
              clearTimeout(this.timer);
              this.services = res.data;
              loading(false);
            })
            .catch(loading(false));
        }, 1500);
      }
    },
    addServiceToTotalList(serviceType) {
      let service =
        serviceType == 'service'
          ? this.totalList.find((el) => el.id == this.selectedService.id)
          : this.totalList.find((el) => el.id == this.selectedWarehouse.id);

      if (service) {
        this.totalList = this.totalList.map((el) => {
          if (el.id === service.id) {
            return {
              ...el,
              quantity: (el.quantity += 1),
            };
          }

          return { ...el };
        });
      } else {
        let object = {
          quantity: 1,
          price:
            serviceType === 'service'
              ? this.selectedService.price
              : this.selectedWarehouse.sale_price,
          date: this.properties?.date ?? '',
          rsr: this.properties?.rsr ?? '',
        };

        this.totalList.push(
          Object.assign(
            serviceType === 'service'
              ? { ...this.selectedService }
              : { ...this.selectedWarehouse },
            object
          )
        );
      }
    },
    printServices() {
      let services = this.totalList.map((el) => {
        return {
          service_code: el.code,
          service_name: el.name,
          service_price: el.quantity,
          service_quantity: el.price,
          total_sum: el.quantity * el.price,
        };
      });

      let contnext = {
        now: moment().format('DD.MM.YYYY'),
        services: services,
        totalSum: this.totalCost,
        // страница пациента
        // "patient_name": this.isPatientPage ? this.patientName : ''
      };
      let r = swig.render(this.printPageTemplate, { locals: contnext });
      let iframe = document.querySelector('#table__container1');
      let target = iframe.contentWindow.document.querySelector('html');

      target.innerHTML = r;

      setTimeout(function () {
        print_iframe(iframe);
      }, 300);
    },
    deleteItem(id) {
      this.totalList = this.totalList.filter((el) => el.id != id);
    },

    calcTableCols() {
      let colsWidths = this.theads
        .map((el) => el.width)
        .filter((el) => el)
        .join(' ');
      return {
        gridTemplateColumns: `1fr ${colsWidths}`,
      };
    },
    theadColor() {
      return {
        backgroundColor: this.greyThead ? 'var(--color-alabaster)' : '',
      };
    },
  },
};
