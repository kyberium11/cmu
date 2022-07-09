<template>
  <div class="container">
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Search"
          dense
          outlined
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-card-title>

      <!-- Alert Message -->
      <div v-if="msgStatus">
        <alert-component />
      </div>

      <!-- User Table -->
      <v-data-table
        :headers="headers"
        :items="fetchCategory"
        :search="search"
        :loading="isLoading"
        class="elevation-1 table-striped"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List of Categories</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>


            <!-- User Management Modal -->

            <v-dialog v-model="dialog" max-width="960px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dark> mdi-plus-circle </v-icon>
                  New Category
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form
                      ref="form"
                      @submit.prevent="save"
                      v-model="rules.isValid"
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.category"
                            label="Name"
                            outlined
                            dense
                            :rules="rules.name"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <!-- Form Buttons -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" dark @click="close"> Cancel </v-btn>
                  <v-btn
                    :disabled="!rules.isValid"
                    color="success"
                    dark
                    @click="save"
                    :loading="isLoading"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete Confirmation Modal -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-toolbar color="error" dark>
                      <v-toolbar-title class="text-h6">
                          Confirmation
                      </v-toolbar-title>
                  </v-toolbar>
                   <v-alert outlined type="error" prominent border="left">
                      Once this file is archived this cannot be deleted in the system.
                      It's recommended those permanent records.
                    </v-alert>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="info" dark @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="error" dark :loading="isLoading" @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- Table Actions Buttons -->
        <template v-slot:item.actions="{ item }">
            <v-btn-toggle v-model="icon" borderless>
            <v-btn x-small value="left" color="info" @click="editItem(item)">
              <v-icon x-small class="text-white"> mdi-pencil-outline </v-icon>
            </v-btn>
            <v-btn
              value="center"
              x-small
              color="error"
              @click="deleteItem(item)"
            >
              <v-icon x-small class="text-white">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>

      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import AlertComponent from "./../../AlertComponent.vue";
export default {
  components: { AlertComponent },
  data() {
    return {
      //TABLE SEARCH PROPERTY
      search: "",

    //Dialog Property
    dialog: false,
    dialogDelete: false,


    //NOTIFY PROPERTIES
    error: "",
    msgStatus: false,
    load:false,

    //TABLE HEADERS PROPERTIES
    headers: [
      {
        text: "Category ID",
        align: "start",
        sortable: true,
        value: "category_id",
        class: "info text-black",
      },
      { text: "Category", value: "category", class: "info text-black" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "info text-black",
      },
    ],

    //Category  PROPERTIES

    editedIndex: -1,
    selectedItem:null,



    //FORM PROPERTIES
    form: {
        category_id:null,
        category:null,
    },

    //RULES VALIDATION PROPERTIES
    rules: {
      isValid: true,
      category: [v => !!v || "Category Name is required"],

    },

    //DEFAULT FORM DATA
    defaultItem: {
      category_id:null,
      category:null
    },
    }
  },
  computed: {

    //FETCH CATEGORY DATA FROM STATE MANANGEMENT COMPUTED
    fetchCategory() {
      const category = this.$store.getters.getCategory
      return this._.orderBy(category, ["created_at"], ["desc"]);
    },

    //FORM TITLE COMPUTED
    formTitle() {
      return this.editedIndex === -1 ? "New Category" : "Update Category";
    },

    //ISLOADING COMPUTED
    isLoading: {
      get:function(){
        return this.$store.state.base.isLoading
      },
      set:function(newVal) {
        return newVal
      }
    }
  },

  watch: {
    //CLOSE MODAL
    dialog(val) {
      val || this.close();
    },
    // DELETE MODAL
    dialogDelete(val) {
      val || this.closeDelete();
    },
    // LOADING
    isLoading(val) {
      val || this.close()
    }
  },

  methods: {

    //EDIT FILE CATEGORY DATA
    editItem(item) {
      this.form = Object.assign({}, item);
      this.dialog = true;
      this.editedIndex = 1
    },

    //DELETE CATEGORY DATA
    deleteItem(item) {
        this.selectedItem = item
        console.log(item.category_id)
        this.dialogDelete = true;
    },

    //CONFIRM DELETE CATEGORY
    async deleteItemConfirm() {
      this.msgStatus = true
      await this.$store.dispatch("deleteCategory",this.selectedItem)
      this.closeDelete();
      this.editedIndex = 0
    },


    //MODAL CLOSE
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1
      });
    },


    //CLOSE DELETE CONFIRMATION
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },


    //CALL STORE MANANGEMENT DISPATCH FOR UPDATING DATA TO STATE MANANGEMENT
    async updateCategory() {
        this.$store.dispatch("updateCategory",this.form)
    },

    //CALL STORE MANANGEMENT DISPATCH FOR ADDING DATA TO STATES
    async addCategory() {
        this.$store.dispatch("addCategory",this.form)
    },

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
      //Check if actions update or add
      if (this.editedIndex >-1) {
        this.updateCategory()
      } else {
        this.$refs.form.validate();
        this.addCategory();
      }

    },
  },


};
</script>
