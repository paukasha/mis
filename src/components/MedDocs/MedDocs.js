import { MedDocsTable } from "../Tables/MedDocsTable.js";

export const MedDocs = {
  components: {
    "med-docs-table": MedDocsTable,
  },
  data() {
    return {
      docs: ["Осмотр терапевта", "Осмотр какого-то врача"],
      theads: [{}],
    };
  },
  template: `
  <div class='med-docs grid'>
    <div class='med-docs__add'>
      <v-select :options='docs'></v-select>
      <base-btn text='Добавить документ'
                icon='plus'
      ></base-btn>
    </div>

    <div>
      <med-docs-table></med-docs-table>
    </div>
  </div>
  `,
};
