import { TableMixin } from "./TableMixin.js";

export const MedDocsTable = {
  delimiters: ["#{", "}"],
  mixins: [TableMixin],
  data() {
    return {
      theads: [
        { type: "string", title: "Документ" },
        { type: "string", title: "Добавил" },
      ],
      contents: [
        {
          id: 1,
          name: "Стационар осмотр анестезиолога",
          owner: "Попович С. А.",
          creation_date: "11.03.2022",
        },
        {
          id: 2,
          name: "Tratata",
          owner: "Попович С. А.",
          creation_date: "11.03.2022",
        },
      ],
    };
  },
  template: `<table class="v-table med-docs-table">
              <thead>
                <tr>
                  <th v-for="item in theads"
                      :key='item.title'
                      :style="calcTextAlign(item.type)">
                    <div v-html="item.title"></div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, key) in contents"
                    :key='item.id'
                >
                  <td :style='calcTextAlign("", key)'>
                    <a class='base-link'>#{item.name}</a>
                  </td>
                  <td :style='calcTextAlign("", key)'>
                    <span>#{item.owner}, #{item.creation_date}</span>
                  </td>
                 
                </tr>
                <tr v-if="!contents.length">
                  <td >
                    <div>Не добавлено ничего</div>
                  </td>
                </tr>
              </tbody>
            </table>`,
};
