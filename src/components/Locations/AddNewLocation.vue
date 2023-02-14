<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <div class="container">
    <form @click.prevent>
      <div class="mask d-flex align-items-center h-100 gradient-custom-3">
        <div class="container h-100">
          <div
            class="row d-flex justify-content-center align-items-center h-100"
          >
            <div class="col-12 col-md-9 col-lg-7 col-xl-6">
              <div
                class="card"
                style="border-radius: 15px display: block;margin: 23px;"
              >
                <div class="card-body p-5">
                  <h2 class="text-center mb-5">Add New Restaurant</h2>
                  <form>
                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Restaurant Name "
                        v-model.trim="state.name"
                      />
                      <span class="error-feedback" v-if="v$.name.$error">{{
                        v$.name.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example1cg"
                        >Your Name</label
                      >
                    </div>

                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Phone Number"
                        v-model.trim="state.Phone"
                      />
                      <span class="error-feedback" v-if="v$.Phone.$error">{{
                        v$.Phone.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example3cg"
                        >Phone</label
                      >
                    </div>

                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Restaurant Address "
                        v-model.trim="state.address"
                      />
                      <span class="error-feedback" v-if="v$.address.$error">{{
                        v$.address.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example4cg"
                        >Address</label
                      >
                    </div>
                    <br />
                    <div class="row g-3 align-items-center">
                      <div
                        class="col-auto d-block mx-auto alert alert-success"
                        v-if="successMessage.length > 0"
                      >
                        {{ successMessage }}
                      </div>
                    </div>
                    <div class="row g-3 align-items-center">
                      <div
                        class="col-auto d-block mx-auto alert alert-danger"
                        v-if="ErrorMessage.length > 0"
                      >
                        {{ ErrorMessage }}
                      </div>
                    </div>
                    <br />
                    <div class="row g-3 align-items-center">
                      <div class="col-auto d-block mx-auto">
                        <button
                          type="button"
                          @click="addLocation()"
                          class="btn btn-primary"
                        >
                          Add Now
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "AddNewLocation",
  setup() {
    const state = reactive({
      name: "",
      Phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(10) },
        Phone: { required },
        address: { required },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  components: {
    NavbarH,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      ErrorMessage: "",
    };
  },
  mounted() {
    // If you are registered go to HomeView page
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "SignUp" });
    } else {
      // extract user.id
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async addLocation() {
      this.v$.$validate(); // Activate My Validations
      if (!this.v$.$error) {
        let results = await axios.post(`http://localhost:3000/locations`, {
          name: this.state.name,
          Phone: this.state.Phone,
          address: this.state.address,
          userId: this.userId,
        });
        if (results.status == 201) {
          // Show Success message
          this.ErrorMessage = "";
          this.successMessage = "Add New Location";
          setTimeout(() => {
            this.redirectTo({ value: "HomeView" });
            // Clear data when recording finished mine 2000 a second
            // this.successMessage = "";
            // this.ErrorMessage = "";
            // this.state.name = "";
            // this.state.Phone = "";
            // this.state.address = "";
            // this.v$.name.$errors[0].$message = "";
            // this.v$.Phone.$errors[0].$message = "";
            // this.v$.address.$errors[0].$message = "";
          }, 2000);
        } else {
          // Show error message
          this.successMessage = "";
          this.ErrorMessage = "Something Went Wrong, Please Try Again!";
        }
      } else {
        this.successMessage = "";
        this.ErrorMessage = "You must fill in all required fields!";
      }
    },
  },
};
</script>
