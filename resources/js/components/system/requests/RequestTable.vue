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

      <!-- REQUESTS TABLE -->
      <v-data-table
        :headers="headers"
        :items="fetchRequests"
        :search="search"
        :loading="isLoading"
        class="elevation-1 table-striped"
      >


        <template v-slot:item.request_date="{ item }">
          <span>{{ new Date(item.request_date).toLocaleDateString() }}</span>
        </template>
        <template v-slot:item.expiration_date="{ item }">
          <span>{{ new Date(item.expiration_date).toLocaleDateString() }}</span>
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

            <v-dialog v-model="dialog" max-width="960px">
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
                          <v-textarea
                            v-model="form.purpose"
                            label="Purpose"
                            outlined
                            disabled
                            filled
                            name="input-7-4"
                            required
                          ></v-textarea>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="form.status"
                            :items="selectItem"
                            item-value="value"
                            item-text="text"
                            dense
                            outlined
                            required
                            select
                            return-object
                          >
                            ></v-select
                          >
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

            <!--- VIEW REQUEST FORM -->
            <v-row justify="center">
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

                  <div v-if="getRequestForm" class="text-center">
                    <embed
                      :src="getRequestForm.filecontent"
                      v-show="
                        getRequestForm.filetype === 'pdf' ||
                        getRequestForm.filetype === 'PDF'
                      "
                      width="100%"
                      height="900"
                    />
                  </div>
                </v-card>
              </v-dialog>
            </v-row>

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
            <v-btn x-small value="left" color="info"
            @click="editItem(item)">
              <v-icon x-small class="text-white"> mdi-pencil-outline </v-icon>
            </v-btn>

            <v-btn
              value="center"
              x-small
              color="error"
              @click="deleteItem(item)"
              v-show="item.status === 'Approved'"
            >
              <v-icon x-small class="text-white"> mdi-trash-can-outline </v-icon>
            </v-btn>
            <v-btn
              value="center"
              x-small
              color="success"
              @click="showRequestForm(item)"
              v-show="item.status === 'Pending'"
            >
              <v-icon x-small class="text-white"> mdi-file-outline </v-icon>
            </v-btn>
          </v-btn-toggle>



          <!-- <v-icon color="primary" small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon
            color="error"
            small
            @click="deleteItem(item)"
            v-show="item.status === 'Approved'"
          >
            mdi-delete
          </v-icon>
          <v-icon
            color="success"
            small
            class="mr-2"
            @click="showRequestForm(item)"
            v-show="item.status === 'Pending'"
          >
            mdi-file
          </v-icon> -->
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
        icon:"justify",
      //TABLE SEARCH PROPERTY
      search: "",

      //Dialog Property
      dialog: false,
      dialogDelete: false,
      viewdialog: false,

      //NOTIFY PROPERTIES
      error: "",
      msgStatus: false,
      load: false,

      singleSelect: false,

      //TABLE HEADERS PROPERTIES
      headers: [

        { text: "File Name", value: "filename" },
        { text: "Code", value: "code"},
        { text: "Purpose", value: "purpose"},
        { text: "Status", value: "status"},
        {
          text: "Request Date",
          value: "request_date"
        },
        {
          text: "Expiration Date",
          value: "expiration_date"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        },
      ],

      //REQUEST PROPERTIES
      editedIndex: -1,
      selectedItem: null,
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
        {
          value: "Expired",
          text: "Expire",
        },
      ],

      //FORM PROPERTIES
      form: {
        request_id: null,
        status: "",
        purpose:"",
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
        purpose:"",
        expiration_date:null
      },
    };
  },
  computed: {

    auth() {
      return this.$store.state.auth.user
    },
    //FETCH FILE REQUESTS FROM STATE MANANGEMENT COMPUTED
    fetchRequests() {
      const files = this.$store.getters.getRequests;
      return this._.orderBy(files, ["created_at"], ["desc"]);
    },
    getRequestForm() {
      return this.$store.state.requests.request_form;
    },
    getLoading() {
      return this.$store.state.base.isLoading
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

    //EDIT FILE REQUESTS DATA
    editItem(item) {
      this.editedIndex = this.fetchRequests.indexOf(item);
      this.form = Object.assign({},item)
      console.log(item)
      switch(item.status){
        case "Approved":
          this.form.status = {text:'Approve',value:'Approved'}
          break;
            case "Denied":
              this.form.status = {text:'Deny',value:'Denied'}
              break;
                case "Pending":
                  this.form.status = {text:'Pending',value:'Pending'}
                  break;
                  case "Expired":
                    this.form.status = {text:'Expire',value:'Expired'}
                    break;
      }


      this.form.request_id = item.request_id

      this.dialog = true;
    },

    //DELETE REQUESTS DATA
    deleteItem(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },

    //CONFIRM DELETE FILE REQUEST
    async deleteItemConfirm() {
      this.msgStatus = true;
      this.$store.dispatch("deleteRequest", this.selectedItem.request_id);
      this.closeDelete();
    },
    async showRequestForm(item) {
      await this.$store.dispatch("showRequestForm", item);
      this.viewdialog = true;
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
    caclculateExpirationDate() {
      const expiration_date = new Date(this.form.expiration_date);
      expiration_date.setDate(expiration_date.getDate() + 5).toString();
      var converted_timestamp = new Date(expiration_date),
        mnth = ("0" + (converted_timestamp.getMonth() + 1)).slice(-2),
        day = ("0" + converted_timestamp.getDate()).slice(-2),
        hours = ("0" + converted_timestamp.getHours()).slice(-2),
        minutes = ("0" + converted_timestamp.getMinutes()).slice(-2),
        seconds = ("0" + converted_timestamp.getSeconds()).slice(-2);
      this.form.expiration_date =
        converted_timestamp.getFullYear() +
        "-" +
        mnth +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
    },

    //CALL STORE MANANGEMENT DISPATCH FOR UPDATING DATA TO STATE MANANGEMENT
    async updateRequest() {
      try {
        this.form.status = this.form.status.value
        if(this.form.status === 'Approved') {
          this.caclculateExpirationDate()
        }
        await this.$store.dispatch("updateRequest", this.form);
        console.log(this.form)
      } catch (error) {
        console.log(error);
      }
    },

    //SAVE BUTTON ( SEND FORM DATA TO DATABASE)
    save() {
      this.msgStatus = true;
      this.$refs.form.validate();
      this.updateRequest();
    },
  },
};
</script>
<style scoped>
::v-deep .v-data-table-header {
  background-color: #1E88E5;
}
</style>

