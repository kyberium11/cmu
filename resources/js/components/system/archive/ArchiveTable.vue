<template>
  <div class="container">
    <v-card>
      <v-card-title>
          <select-file-category
          @selectcategory="getCategory"
        ></select-file-category>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Search"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-card-title>

      <!-- Alert Message -->
      <div v-if="msgStatus">
        <alert-component />
      </div>

      <!-- FILES TABLE  -->
      <v-data-table
        :headers="headers"
        :items="fetchDocuments"
        :search="search"
        class="elevation-1 table-striped"
      >
        <!-- CHANGE DATE FORMAT FROM DATABASE -->
        <template v-slot:item.created_at="{ item }">
          <span>{{ new Date(item.created_at).toLocaleDateString() }}</span>
        </template>
        <template v-slot:item.archive="{ item }">
          <v-chip :color="getColor(item.archive)" dark>
            {{ item.archive }}
          </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Archive Documents Table</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- FILES MANAGEMENT MODALS -->

            <v-dialog v-model="dialog" max-width="960px">
              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert outlined type="info" prominent border="left">
                      Once this file is archived this cannot be deleted in the system.
                      It's recommended those permanent records.
                    </v-alert>
                    <v-form ref="form" @submit.prevent="save">
                      <v-select
                        v-model="form.archive"
                        prepend-inner-icon="mdi-archive"
                        :items="selectItem"
                        dense
                        outlined
                        required
                        select
                        return-object
                      >
                      </v-select>
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
          </v-toolbar>
        </template>

        <!-- Table Actions Buttons -->
        <template v-slot:item.actions="{ item }">
          <v-btn-toggle v-model="icon" borderless>
            <v-btn x-small value="left" color="success" @click="editItem(item)">
              <v-icon x-small class="text-white"> mdi-archive-outline </v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import SelectFileCategory from "./../files/SelectFileCategory.vue";
import AlertComponent from "./../../AlertComponent.vue";
export default {
  components: { AlertComponent,SelectFileCategory },
  data() {
    return {
    category_id:0,
      icon: "justify",
      //TABLE SEARCH PROPERTY
      search: "",
      file_id: null,
      selectedFile: null,
      selectedItem: [],
      selectItem: ["Archive", "Unarchive"],

      //Dialog Property
      dialog: false,
      dialogDelete: false,

      //NOTIFY PROPERTIES
      error: "",
      msgStatus: false,
      load: false,

      //TABLE HEADERS PROPERTIES
      headers: [
        {
          text: "Code",
          align: "start",
          sortable: true,
          value: "code",
          class: "info text-black",
        },
        { text: "File Name", value: "filename", class: "info text-black" },
        { text: "Slug", value: "slug", class: "info text-black" },
        { text: "Uploaded", value: "created_at", class: "info text-black" },
        { text: "Archive", value: "archive", class: "info text-black" },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "info text-black",
        },
      ],

      //FILES PROPERTIES
      editedIndex: -1,

      //FORM PROPERTIES
      form: {
        file_id: null,
        archive: null,
      },

      //RULES VALIDATION PROPERTIES
      rules: {
        isValid: true,
        file_location: [(v) => !!v || "Select is File"],
      },

      //DEFAULT FORM DATA
      defaultItem: {
        file_id: null,
        archive: null,
      },
    };
  },
  computed: {
      category() {
      return this.$store.state.filecategory;
    },

    //FETCH FILES FROM STATE MANANGEMENT COMPUTED
    getUserId() {
      return this.$store.state.auth.user.user_id;
    },
    fetchDocuments() {

        if (this.category_id === 0) {
        const documents = this.$store.getters.getApprovedDocuments
        return this._.orderBy(documents, ["created_at"], ["desc"]);
      } else {
        const documents = this.$store.getters.filterFilesByCategory(
          this.category_id
        );
        return this._.orderBy(documents, ["created_at"], ["desc"]);
      }
    },

    //FORM TITLE COMPUTED
    formTitle() {
      if (this.editedIndex === 0) {
        return "Update File";
      }

      //return this.editedIndex === -1 ? "New File" : "Update File";
    },

    //ISLOADING COMPUTED
    isLoading: {
      get: function () {
        return this.$store.state.base.isLoading;
      },

      set: function (newVal) {
        return newVal;
      },
    },
  },

  watch: {
    //CLOSE MODAL
    dialog(val) {
      val || this.close();
    },

    // LOADING
    isLoading(val) {
      val || this.close();
    },
  },

  methods: {
    getCategory(category) {
      this.category_id = category;
    },
    getColor(item) {
      if (item === "Unarchive") return "red";
      else return "green";
    },

    editItem(item) {
      this.editedIndex = this.fetchDocuments.indexOf(item);
      this.form = Object.assign({}, item);
      this.dialog = true;
    },

    //MODAL CLOSE
    close() {
      this.dialog = false;

      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async updateDocument() {
      await this.$store.dispatch("updateFile", this.form);
    },

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
      this.$refs.form.validate();
      this.updateDocument();
    },
  },
};
</script>
