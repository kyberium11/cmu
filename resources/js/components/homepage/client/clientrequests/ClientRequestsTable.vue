<template>
  <div class="container">
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          label="Search"
          outlined
          dense
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-card-title>


      <!-- REQUESTS TABLE -->
      <v-data-table
        :headers="headers"
        :items="fetchRequests"
        :search="search"
        class="elevation-1 table-striped"
      >


        <template v-slot:item.request_date="{ item }">
          <span>{{ new Date(item.request_date).toLocaleDateString() }}</span>
        </template>


        <template v-slot:item.expiration_date="{ item }">
          <span v-show="item.status === 'Approved'">{{
            new Date(item.expiration_date).toLocaleDateString()
          }}</span>
        </template>


        <template v-slot:item.status="{ item }">
          <v-chip :color="getColor(item.status)" dark>
            {{ item.status }}
          </v-chip>
        </template>


        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List of File Requests</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- REQUEST FILE MANANGEMENT MODAL -->
            <!-- FILES MANAGEMENT MODALS -->
            <v-row justify="center">
              <v-dialog
                v-model="viewdialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                persistent
              >
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="reloadPage()">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <!--- GET FILE CONENTS -->
                  <div v-if="getDocumentRequest" class="text-center">
                    <web-viewer v-if="getDocumentRequest" :docs.sync="getDocumentRequest" :request="selectedRequest"/>

                  </div>
                </v-card>
              </v-dialog>
            </v-row>

            <v-dialog v-model="dialog" max-width="960px">
              <v-card>
                <v-toolbar color="primary" dark>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-title> </v-card-title>
                <v-card-text>
                  <v-container>
                    <h6>Form</h6>
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
         <v-icon
            color="error"
            small
            @click="deleteItem(item)"
            v-show="item.status === 'Pending'"
          >
            mdi-delete
          </v-icon> 
          <v-btn-toggle v-model="icon" borderless>
            <v-btn x-small value="left" color="success" @click="showRequestedDocument(item)"
            v-show="item.status === 'Approved'">
              <v-icon x-small class="text-white"> mdi-eye-outline </v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import AlertComponent from "./../../../AlertComponent.vue";
import WebViewer from './WebViewer.vue'

export default {
  components: { AlertComponent,WebViewer },
  data() {
    return {
        icon:"justify",
      //TABLE SEARCH PROPERTY
      search: "",

      //Dialog Property
      dialog: false,
      dialogDelete: false,

      //NOTIFY PROPERTIES
      error: "",
      msgStatus: false,
      load: false,
      viewdialog: false,
      selectedRequest:null,

      //TABLE HEADERS PROPERTIES
      headers: [
        {
          text: "Request ID",
          align: "start",
          sortable: true,
          value: "request_id",
          class: "info text-black",
        },

        { text: "File Name", value: "filename", class: "info text-black" },
        { text: "Purpose", value: "purpose", class: "info text-black" },
        { text: "Status", value: "status", class: "info text-black" },
        {
          text: "Request Date",
          value: "request_date",
          class: "info text-black",
        },
        {
          text: "Expiration Date",
          value: "expiration_date",
          class: "info text-black",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "info text-black",
        },
      ],

      //FILE PROPERTIES
      editedIndex: -1,

      //FORM PROPERTIES
      form: {
        request_id: null,
        status: "",
        expiration_date: null,
      },

      //RULES VALIDATION PROPERTIES
      rules: {
        isValid: true,
        filename: [(v) => !!v || "Filename is required"],
        description: [(v) => !!v || "Description is required"],
        file_location: [(v) => !!v || "File Location is required"],
      },

      //DEFAULT FORM DATA
      defaultItem: {
        request_id: null,
        status: "",
        expiration_date:null
      },
    };
  },
  computed: {

    auth() {
      return this.$store.state.auth.user.user_id
    },
    //FETCH FILE REQUESTS FROM STATE MANANGEMENT COMPUTED
    fetchRequests() {
      const request = this.$store.getters.getApprovedPendingRequest(this.auth);
      return this._.orderBy(request, ["created_at"], ["desc"]);
    },
    getDocumentRequest() {
      return this.$store.state.requests.request_document;
    },

    //FORM TITLE COMPUTED
    formTitle() {
      return this.editedIndex === -1 ? "New File" : "Update File";
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
    getColor(status) {
      if (status === "Approved") return "green";
      else return "default";
    },
    reloadPage() {
      this.viewdialog = false
      if(!this.viewdialog) {
        this.$router.go()
      }


      /* this.$router.go() */
      /* window.location.reload() */
    },


    async showRequestedDocument(item) {
      this.viewdialog = true;
      this.selectedRequest = item
      let get_expiration_date = new Date(item.expiration_date)
      let set_expiration_date = get_expiration_date.getFullYear()+ '-'+(get_expiration_date.getMonth()+1)+'-'+get_expiration_date.getDate()
      let today = new Date()
      let current_date = today.getFullYear()+ '-'+(today.getMonth()+1)+'-'+today.getDate()

      if(set_expiration_date<current_date) {
        this.viewdialog = false
        alert("The request was expired")
        this.form = Object.assign({},item)
        this.form.status = "Expired"
      }else {
        console.log(item)
        await this.$store.dispatch("showRequestDocument", item);
      }

    },

    //DELETE REQUESTS DATA
    deleteItem(item) {
      this.dialogDelete = true;
      this.selectedRequest = item;
    },

    //CONFIRM DELETE FILE REQUEST
    async deleteItemConfirm() {
      this.msgStatus = true;
      await this.$store.dispatch(
        "deleteRequest",
        this.selectedRequest.request_id
      );
      this.closeDelete();
    },

    //MODAL CLOSE
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultItem);
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

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
    },
  },
  mounted() {
  },
};
</script>
<style scoped>
.embed-cover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  /* Just for demonstration, remove this part */
  opacity: 0.25;
  background-color: red;
}

.wrapper {
  position: relative;
  overflow: hidden;
}
</style>
