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
          label="search"
          dense
          outlined
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
        v-model="selected"
        :items="fetchFiles"
        :search="search"
        item-key="file_id"
        :single-select="singleSelect"
        :loading="isLoading"
        show-select
        class="elevation-1 table-striped"
      >
        <!-- CHANGE DATE FORMAT FROM DATABASE -->
        <template v-slot:item.created_at="{ item }">
          <span>{{ new Date(item.created_at).toLocaleDateString() }}</span>
        </template>
        <template v-slot:item.retention_date="{ item }">
          <span>{{ new Date(item.retention_date).toLocaleDateString() }}</span>
        </template>

        <template v-slot:item.file_status="{ item }">
            <div v-if="item.status === 'Denied'">
                <v-tooltip color="error" right>
                    <template v-slot:activator="{on,attrs}">
                        <v-chip :color="getColor(item.file_status)" v-on="on" v-bind="attrs" dark>
                            {{ item.status }}
                        </v-chip>
                    </template>

                    ERROR MESSAGE HERE!
                </v-tooltip>

            </div>
            <div v-else>
                <v-chip :color="getColor(item.file_status)" dark>
                            {{ item.file_status }}
                        </v-chip>
            </div>

        </template>

        <template v-slot:top>
          <h4>List of Documents</h4>
          <v-switch v-model="singleSelect" label="Single Select" class="pa-3">
          </v-switch>
          <v-toolbar flat>
            <!-- FILES MANAGEMENT MODALS -->

            <v-dialog v-model="dialog" max-width="80%">
              <!-- ADD NEW FILE BUTTON -->

              <template v-slot:activator="{ on, attrs }">
                <div v-show="auth.user_type === 'Staff'">
                  <v-btn-toggle v-model="icon" borderless>
                    <v-btn value="left" color="info" v-bind="attrs" v-on="on">
                      <span class="hidden-sm-and-down">New File</span>

                      <v-icon right class="text-white">
                        mdi-plus-circle
                      </v-icon>
                    </v-btn>

                    <v-btn value="center" color="error" @click="deleteItem">
                      <span class="hidden-sm-and-down text-white">Delete</span>

                      <v-icon right class="text-white"> mdi-delete </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </template>

              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-container>
                    <div v-show="auth.user_type === 'Chief'">
                      <v-form ref="form" @submit.prevent="save">
                        <v-alert outlined type="info" prominent border="left">
                          Make sure to validate the file throughly before approving this file
                        </v-alert>
                        <v-select
                          v-model="form.file_status"
                          prepend-inner-icon="mdi-archive"
                          :items="selectItem"
                          item-value="value"
                          item-text="text"
                          dense
                          outlined
                          required
                          select
                          return-object
                        >
                        </v-select>
                      </v-form>
                    </div>
                    <div v-show="auth.user_type === 'Staff'">
                      <v-form ref="form" @submit.prevent="save">
                        <v-container  v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          ">

                            <label for="filename">Filename</label>
                            <v-text-field
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          v-model="form.filename"
                          :rules="rules.filename"
                          @input="generateSlug"
                          prepend-inner-icon="mdi-file"
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                        <label for="filecode">File Code</label>
                            <v-text-field
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          v-model="form.code"
                          :rules="rules.code"
                          prepend-inner-icon="mdi-file-code"
                          dense
                          outlined
                          required
                        >
                        </v-text-field>
                        <label for="slug">Slug</label>
                         <v-text-field
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          v-model="form.slug"
                          :rules="rules.slug"
                          disabled
                          prepend-inner-icon="mdi-information-outline"
                          dense
                          outlined
                          required
                        >
                        </v-text-field>

                        <label for="category">Category</label>
                        <v-select
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          :items="category.filecategory"
                          item-text="category"
                          item-value="category_id"
                          v-model="form.category_id"
                          prepend-inner-icon="mdi-information-outline"
                          outlined
                          dense
                        >
                        </v-select>

                        <label for="doctype">Document Type</label>
                        <v-select
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          prepend-inner-icon="mdi-file-sign"
                          :items="document_type"
                          label="Select Document Type"
                          v-model="form.document_type"
                          :rules="rules.document_type"
                          dense
                          required
                          outlined
                        >
                        </v-select>

                        <label for="desc">Description</label>

                        <v-textarea
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          v-model="form.description"
                          :rules="rules.description"
                          prepend-inner-icon="mdi-text"
                          filled
                          name="input-7-4"
                        >
                        </v-textarea>
                        <label for="retentiondate">Retention Date</label>
                        <!-- VUETIFY DATE PICKER -->
                        <v-menu
                          v-show="
                            formTitle === 'New File' ||
                            formTitle === 'Update File'
                          "
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-show="
                                formTitle === 'New File' ||
                                formTitle === 'Update File'
                              "
                              v-model="date"
                              prepend-inner-icon="mdi-calendar"
                              :rules="rules.retention_date"
                              readonly
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            :active-picker.sync="activePicker"
                            min="1900-01-01"
                            @change="saveDate"
                          ></v-date-picker>
                        </v-menu>
                        </v-container>


                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text"
                              ><v-icon>mdi-file-cabinet</v-icon></span
                            >
                          </div>
                          <div class="custom-file">
                            <input
                              type="file"
                              class="custom-file-input"
                              id="exampleFormControlFile1"
                              v-show="formTitle === 'File Location'"
                              v-if="uploadReady"
                              :rules="rules.file_location"
                              ref="file"
                              @change="onChangeFile"
                              required
                            />

                            <label
                              class="custom-file-label"
                              for="inputGroupFile01"
                              >{{ filename }}</label
                            >
                          </div>
                        </div>

                      </v-form>
                    </div>
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
                  <v-btn color="info" dark @click="closeDelete">Cancel</v-btn>
                  <v-btn
                    color="error"
                    dark
                    :loading="isLoading"
                    @click="deleteItemConfirm"
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
              color="warning"
              @click="editFileLocation(item)"
            >
              <v-icon x-small class="text-white"> mdi-upload-outline </v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import AlertComponent from "./../../AlertComponent.vue";
import SelectFileCategory from "./SelectFileCategory.vue";
export default {
  components: { AlertComponent, SelectFileCategory },
  data() {
    return {
      uploadReady: true,
      filename: "choose file",
      //DATE PICKER PROPERTY
      activePicker: null,
      date: null,
      menu: false,

      category_id: 0,

      singleSelect: false,
      selected: [],

      document_type: ["Public", "Private"],
      items: ["1", "2", "3"],
      //SELECT ITEM
      selectItem: [
        {
          value: "Pending",
          text: "Pending",
        },
        {
          value: "Approved",
          text: "Approve",
        },
        {
          value: "Denied",
          text: "Deny",
        },
      ],

      //TABLE SEARCH PROPERTY
      search: "",
      file_id: null,
      selectedFile: null,
      update: 0,
      icon: "justify",

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
        { text: "Description", value: "description", class: "info text-black" },
        { text: "Slug", value: "slug", class: "info text-black" },
        { text: "Category", value: "category", class: "info text-black" },
        { text: "Date Created", value: "created_at", class: "info text-black" },
        {
          text: "Date Retention",
          value: "retention_date",
          class: "info text-black",
        },
        { text: "File Status", value: "file_status", class: "info text-black" },
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
        filename: "",
        description: "",
        slug: "",
        file_location: null,
        user_id: null,
        category_id: null,
        code: "",
        file_status: null,
        retention_status: "Active",
        archive: "Unarchive",
        document_type: "",
        file_id: null,
      },

      //RULES VALIDATION PROPERTIES
      rules: {
        isValid: true,
        filename: [(v) => !!v || "Filename is required"],
        slug: [(v) => !!v || "Filename is required"],
        description: [(v) => !!v || "Description is required"],
        file_location: [(v) => !!v || "Select is File"],
      },

      //DEFAULT FORM DATA
      defaultItem: {
        filename: "",
        slug: "",
        user_id: null,
        description: "",
        archive: "Unarchive",
        file_location: null,
        file_status: null,
        retention_status: "Active",
        category_id: null,
        code: "",
        file_id: null,
      },
    };
  },
  computed: {
    //FETCH FILES FROM STATE MANANGEMENT COMPUTED
    auth() {
      return this.$store.state.auth.user;
    },

    category() {
      return this.$store.state.filecategory;
    },

    //Get Selected File Document
    getSelectedFile() {
      let file_id = this.selected.map((item) => {
        return item.file_id;
      });
      return file_id;
    },

    //Get User ID from the Current user logged in
    getUserId() {
      return this.$store.state.auth.user.user_id;
    },

    //fetch File Documents from state
    fetchFiles() {
      if (this.category_id === 0) {
        const files = this.$store.getters.getAllDocs;
        return this._.orderBy(files, ["created_at"], ["desc"]);
      } else {
        const files = this.$store.getters.filterFilesByCategory(
          this.category_id
        );
        return this._.orderBy(files, ["created_at"], ["desc"]);
      }
    },

    //FORM TITLE COMPUTED
    formTitle() {
      if (this.editedIndex === -1) {
        this.date = null;
        return "New File";
      } else if (this.editedIndex === 0) {
        return "Update File";
      } else {
        return "File Location";
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
    //Menu
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
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
      val || this.close();
    },
  },

  methods: {
    generateSlug(event) {
      if(event) {
        this.form.slug = event
      }
    },
    getCategory(category) {
      this.category_id = category;
    },
    getColor(item) {
      if (item === "Denied") {
        return "red";
      } else if (item === "Approved") {
        return "green";
      }
    },
    //Save Retention Date
    saveDate(date) {
      this.$refs.menu.save(date);
      this.form.retention_date = date;
    },

    //EDIT FILE DATA
    /*     getUserID(event) {

      this.form.user_id = event.target.value

    }, */
    editItem(item) {
      this.editedIndex = this.fetchFiles.indexOf(item);
      this.form = Object.assign({}, item);
      console.log(this.form.file_id);
      this.date = item.retention_date;
      this.dialog = true;
      this.editedIndex = 0;
    },
    editFileLocation(item) {
      this.dialog = true;

      this.form.file_id = item.file_id;
      this.editedIndex = 1;
    },

    //GENERATE FILE CODE
    /* generateFileCode(event) {
      if (event) {
        let filename = this.form.filename;

        let generatedcode =
          filename.toUpperCase().slice(0, 3) +
          Math.floor(Math.random() * 100000000000);

        if (filename === "") {
          this.form.code = "";
        } else {
          this.form.code = generatedcode;
        }
      }
    }, */

    //DELETE FILE DATA
    deleteItem() {
      if (this.getSelectedFile.length > 0) {
        this.dialogDelete = true;
      } else {
        alert("Please select file document");
      }
    },

    //CONFIRM DELETE FILE
    async deleteItemConfirm() {
      this.msgStatus = true;
      await this.$store.dispatch("deleteMultipleFiles", this.getSelectedFile);
      this.closeDelete();
    },

    //MODAL CLOSE
    close() {
      this.dialog = false;
      this.fileReady = false;
      this.$nextTick(() => {
        this.fileReady = true;
        this.form = Object.assign({}, this.defaultItem);
        this.filename = "choose file";
        this.uploadReady = true;
        this.editedIndex = -1;
      });
    },

    //CLOSE DELETE CONFIRMATION
    closeDelete() {
      this.dialogDelete = false;
      this.uploadReady = false;
      this.filename = "choose file";
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    //CALL STORE MANANGEMENT DISPATCH FOR UPDATING DATA TO STATE MANANGEMENT
    async updateFile() {
      await this.$store.dispatch("updateFile", this.form);
    },

    async updateDocument() {
      this.form.file_status = this.form.file_status.value;
      await this.$store.dispatch("updateFile", this.form);
    },

    //CALL STORE MANANGEMENT DISPATCH FOR ADDING DATA TO STATES
    async addFile() {
      this.form.user_id = this.getUserId;
      this.form.file_status = "Pending";
      await this.$store.dispatch("addFile", this.form);
    },

    //CALL STORE MANANGEMENT DISPATCH FOR ADDING FILE_LOCATIONS
    async addFileLocation() {
      let fd = new FormData();

      fd.append("file_id", this.form.file_id);

      fd.append("file_location", this.form.file_location);
      if (this.form.file_location !== null) {
        await this.$store.dispatch("addFileLocation", fd);
        this.close();
      } else {
        alert("Please select file");
      }
    },
    onChangeFile(e) {
      this.form.file_location = e.target.files[0];
      this.filename = e.target.files[0].name;
    },

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
      //Check if actions update or add
      if (this.editedIndex === 0) {
        this.$refs.form.validate();
        if (this.auth.user_type === "Chief") {
          this.updateDocument();
        } else {
          this.updateFile();
        }
        /* this.generateFileCode(); */
      } else if (this.editedIndex === -1) {
        this.$refs.form.validate();
        this.addFile();
        /* this.$refs.form.validate(); */
      } else {
        this.$refs.form.validate();
        this.addFileLocation();
      }
    },
  },
};
</script>
<style scoped>
.denied {
  background-color: red;
}
::v-deep .v-data-table-header {
  background-color: #1e88e5;
}
</style>
