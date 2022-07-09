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
          dense
          outlined
          label="Search"
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
        :items="fetchFileLocations"
        :search="search"
        v-model="selected"
        item-key="file_location_id"
        :single-select="singleSelect"
        show-select
        :loading="isLoading"
        class="elevation-1 table-striped"
      >
        <!-- CHANGE DATE FORMAT FROM DATABASE -->
        <template v-slot:item.created_at="{ item }">
          <span>{{ new Date(item.created_at).toLocaleDateString() }}</span>
        </template>
        <template v-slot:top>
          <h4>List of Documents</h4>
          <v-switch v-model="singleSelect" class="pa-3" label="Single Select">
          </v-switch>

          <v-toolbar flat>
            <div v-show="auth.user_type === 'Staff'">
              <v-btn-toggle v-model="icon" borderless>
                <v-btn color="error" :loading="isLoading" @click="deleteItem">
                  <span class="hidden-sm-and-down" @click="deleteItem"
                    >Delete</span
                  >

                  <v-icon right class="text-white"> mdi-delete </v-icon>
                </v-btn>
              </v-btn-toggle>
            </div>

            <!-- FILES MANAGEMENT MODALS -->
            <v-dialog
              v-model="viewdialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="viewdialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <!--- GET FILE CONENTS -->

                <div v-if="getFile" class="text-center">
                  <img
                    :src="getFile.filecontent"
                    v-show="
                      getFile.filetype === 'png' ||
                      getFile.filetype === 'jpg' ||
                      getFile.filetype === 'jpeg' ||
                      getFile.filetype === 'PNG' ||
                      getFile.filetype === 'JPG' ||
                      getFile.filetype === 'JPEG'
                    "
                  />
                  <embed
                    :src="getFile.filecontent"
                    v-show="
                      getFile.filetype === 'pdf' || getFile.filetype === 'PDF'
                    "
                    width="100%"
                    height="900"
                  />
                </div>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="960px">
              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" @submit.prevent="save">
                      <v-text-field
                        v-show="formTitle === 'Update File'"
                        v-model="form.file_id"
                        prepend-inner-icon="mdi-information-outline"
                        label="File ID"
                        disabled
                        dense
                        outlined
                        required
                      >
                      </v-text-field>


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
                                 v-show="formTitle === 'Update File'"
                                v-if="uploadReady"
                                :rules="rules.file_location"
                                ref="fileupload"
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
                          <div v-if="isLoading">
                            <v-progress-linear
                              indeterminate
                              color="yellow darken-2"
                            ></v-progress-linear>
                          </div>

                      <!-- <input
                        type="file"
                        class="custom-file-input" id="inputGroupFile01"
                        v-show="formTitle === 'Update File'"
                         v-if="uploadReady"
                        :rules="rules.file_location"
                        ref="file"
                        @change="onChangeFile"
                        required
                      /> -->
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
                  >Are you sure you want to delete this item(s)?</v-card-title
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
            <v-btn x-small value="left" color="info" @click="editItem(item)" v-show="auth.user_type === 'Staff'">
              <v-icon x-small class="text-white"> mdi-pencil-outline </v-icon>
            </v-btn>
            <v-btn
              value="center"
              x-small
              color="success"
              @click="showFile(item)"
            >
              <v-icon x-small class="text-white"> mdi-eye-outline </v-icon>
            </v-btn>
          </v-btn-toggle>



          <!-- <v-icon
            color="primary"
            small
            class="mr-2"
            @click="editItem(item)"
            v-show="auth.user_type === 'Staff'"
          >
            mdi-pencil
          </v-icon>
          <v-icon color="success" small class="mr-2" @click="showFile(item)">
            mdi-information
          </v-icon> -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import SelectFileCategory from "./SelectFileCategory.vue";
import AlertComponent from "./../../AlertComponent.vue";
export default {
  components: { AlertComponent, SelectFileCategory },
  data() {
    return {
      uploadReady: true,
      filename:'choose file',
      singleSelect: false,
      selected: [],
      icon: "justify",
      //TABLE SEARCH PROPERTY
      search: "",
      file_id: null,
      selectedFile: null,

      category_id: 0,

      //Dialog Property
      dialog: false,
      dialogDelete: false,
      viewdialog: false,

      uploadPercentage:0,
      //NOTIFY PROPERTIES
      msgStatus: false,

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
        {
          text: "File Location",
          value: "file_location",
          class: "info text-black",
        },
        { text: "Slug", value: "slug", class: "info text-black" },
        { text: "Uploaded", value: "created_at", class: "info text-black" },
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
        file_location: null,
        file_id: null,
      },

      //RULES VALIDATION PROPERTIES
      rules: {
        isValid: true,
        file_location: [(v) => !!v || "Select is File"],
      },

      //DEFAULT FORM DATA
      defaultItem: {
        filename: "",
        file_location: null,
        file_id: null,
      },
    };
  },
  computed: {
    //FETCH FILES FROM STATE MANANGEMENT COMPUTED
    getUserId() {
      return this.$store.state.auth.user.user_id;
    },

    //FETCH SINGLE FILE FROM STATE MANANGEMENT COMPUTED
    getFile() {
      return this.$store.state.files.show_file;
    },

    getSelectedFileLocation() {
      let file_location_id = this.selected.map((item) => {
        return item.file_location_id;
      });
      return file_location_id;
    },

    //GET CURRENT USER LOGGED IN
    auth() {
      return this.$store.getters.user;
    },

    //FETCH FILE LOCATIONS FROM STATE MANANGEMENT COMPUTED
    fetchFileLocations() {
      if (this.category_id === 0) {
        const file_location = this.$store.getters.getFileLocations;
        return this._.orderBy(file_location, ["created_at"], ["desc"]);
      } else {
        const files = this.$store.getters.filterFilesByCategory(
          this.category_id
        );
        return this._.orderBy(files, ["created_at"], ["desc"]);
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
        return this.$store.state.base.isLoading
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
    getCategory(category) {
      this.category_id = category;
    },

    getUserID() {
      this.form.user_id = event.target.value;
    },
    editItem(item) {
      this.editedIndex = this.fetchFileLocations.indexOf(item);
      this.form.file_id = item.file_id;
      this.form.filename = item.file_location;
      this.dialog = true;
      this.editedIndex = 0;
    },

    //DELETE FILE DATA
    deleteItem() {
      if (this.getSelectedFileLocation.length > 0) {
        this.dialogDelete = true;
      } else {
        alert("Please select Item");
        return false;
      }
    },

    async showFile(item) {
      this.viewdialog = true;
      await this.$store.dispatch("showFile", item);
    },

    //CONFIRM DELETE FILE
    async deleteItemConfirm() {
      this.msgStatus = true;
      await this.$store.dispatch(
        "deleteFileLocation",
        this.getSelectedFileLocation
      );
      this.closeDelete();
    },

    //MODAL CLOSE
    close() {
      this.dialog = false;
      this.uploadReady = false;
      this.filename = 'choose file'
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
        this.filename = 'choose file'
        this.uploadReady = true;
        this.editedIndex = -1;
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

    async updateFileLocation() {
      let fd = new FormData();

      fd.append("file_id", this.form.file_id);
      fd.append("file_location", this.form.file_location);
      fd.append("filename", this.form.filename);
      fd.append("_method", "put");
      if (this.form.file_location !== null) {
        await this.$store.dispatch("updateFileLocation", fd);
      } else {
        alert("Please select file");
      }
    },
    onChangeFile(e) {
      this.form.file_location = e.target.files[0];
      this.filename = e.target.files[0].name;

      /* this.form.file_location = this.$refs.file.files[0]
      this.filename = this.$refs.file.files[0].name */
    },

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
      //Check if actions update or add
      this.$refs.form.validate();
      this.updateFileLocation();
    },
  },
};
</script>
<style scoped>
::v-deep .v-data-table-header {
  background-color: #1e88e5;
}
</style>
