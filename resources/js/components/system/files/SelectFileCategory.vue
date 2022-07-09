<template>
  <div class="row">
      <div class="col-lg-12">
          <v-select
          :items="category"
          item-text="category"
          item-value="category_id"
          v-model="defaultSelect"
          label="Select Category"
          outlined
          prepend-inner-icon="mdi-format-list-bulleted-square"
          @change="onChangeCategory"
          dense
        >
        </v-select>
      </div>


  </div>
</template>
<script>

export default {

  data() {
    return {
        defaultSelect:{
            category_id:0,
        },
        icon:"justify",
        filecateg:[
          {
            category_id: 0,
            category: "All",
            created_at: "2022-04-26T01:56:19.000000Z",
            updated_at: "2022-04-26T01:56:19.000000Z"
          }
        ]
    };
  },
  computed: {
    category() {
        const categ = this.$store.state.filecategory.filecategory
        const newCateg = categ.concat(this.filecateg)
        return newCateg
    }


  },
  methods: {
    onChangeCategory(e) {
      this.category_id = e;
      this.$emit("selectcategory", e);
    },
  },

};
</script>
<style scoped>
@media print {
  .hidden-print {
    display: none !important;
  }
}
</style>
