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
        v-model="selected"
        item-key="request_id"
        :single-select="singleSelect"
        :loading="isLoading"
        show-select
        class="elevation-1 table-striped"
      >

        <template v-slot:item.expiration_date="{ item }">
          <span
            v-show="item.status === 'Approved' || item.status === 'Expired'"
            >{{ new Date(item.expiration_date).toLocaleDateString() }}</span
          >
        </template>

        <template v-slot:item.request_date="{ item }">
          <span>{{ new Date(item.request_date).toLocaleDateString() }}</span>
        </template>
        <template v-slot:item.status="{ item }">
            <div v-if="item.status === 'Denied'">
                <v-tooltip color="error" right>
                    <template v-slot:activator="{on,attrs}">
                        <v-chip :color="getColor(item.status)" v-on="on" v-bind="attrs" dark>
                            {{ item.status }}
                        </v-chip>
                    </template>

                    ERROR MESSAGE HERE!
                </v-tooltip>

            </div>
            <div v-else>
                <v-chip :color="getColor(item.status)" dark>
                            {{ item.status }}
                        </v-chip>
            </div>

        </template>


        <template v-slot:top>
          <h4>Request Log</h4>

          <v-switch
            v-model="singleSelect"
            label="Single Select"
            class="pa-3"
          ></v-switch>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- REQUEST FILE MANANGEMENT MODAL -->
          <div class="mb-3">
            <v-btn-toggle v-model="icon" borderless>
              <v-btn color="error" :loading="isLoading" @click="deleteItem">
                <span class="hidden-sm-and-down" @click="deleteItem"
                  >Delete</span
                >

                <v-icon right class="text-white"> mdi-trash-can-outline </v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>

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
                        <v-text-field
                          v-model="form.request_id"
                          label="Name"
                          outlined
                          disabled
                          dense
                          required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-select
                          :items="item"
                          label="Status"
                          v-model="form.status"
                          required
                          dense
                          outlined
                        ></v-select>
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
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import AlertComponent from "./../../../AlertComponent.vue";

export default {
  components: { AlertComponent },
  data() {
    return {
      //TABLE SEARCH PROPERTY
      search: "",
      //Dialog Property
      dialog: false,
      dialogDelete: false,

      icon:"justify",
      singleSelect: false,
      selected:[],

      //NOTIFY PROPERTIES
      error: "",
      msgStatus: false,
      load: false,

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
        { text: "Code", value: "code", class: "info text-black" },
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
      ],

      //REQUEST PROPERTIES
      editedIndex: -1,
      item: ["Pending", "Approved", "Expired"],

      //FORM PROPERTIES
      form: {
        request_id: null,
        status: "",
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
      },
    };
  },
  computed: {
    auth() {
      return this.$store.state.auth.user.user_id;
    },
    //FETCH FILE REQUESTS FROM STATE MANANGEMENT COMPUTED
    fetchRequests() {
      const files = this.$store.getters.getRequestsLog(this.auth);
      return this._.orderBy(files, ["created_at"], ["desc"]);
    },

    //FORM TITLE COMPUTED
    formTitle() {
      return this.editedIndex === -1 ? "New File" : "Update File";
    },

    //Get Selected Request Log
    getSelectedRequest() {
      let request_id = this.selected.map((item) => {
        return item.request_id;
      });
      return request_id;
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
    //Get color of vuetify chips
    getColor(status) {
      if (status === "Approved") return "green";
      else if (status === "Denied") return "red";
      else return "orange";
    },



    //DELETE REQUESTS DATA
    deleteItem(item) {
      if(this.getSelectedRequest.length > 0) {
        this.dialogDelete = true
      }else {
        alert("Please select request")
      }
    },

    //CONFIRM DELETE FILE REQUEST
    async deleteItemConfirm() {
      this.msgStatus = true;
      await this.$store.dispatch("deleteMultipleRequest", this.getSelectedRequest);
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

      //Check if actions update or add
      if (this.editedIndex > -1) {
      } else {
        /* this.$refs.form.validate(); */
      }
    },
  },
};
</script>
<style scoped>
::v-deep .v-data-table-header {
  background-color: #1e88e5;
}
</style>
