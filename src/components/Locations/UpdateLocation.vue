<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <form @click.prevent>
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div
              class="card"
              style="border-radius: 15px display: block;margin: 23px;"
            >
              <div class="card-body p-5">
                <h2 class="text-center mb-5">Update Restaurant</h2>
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
                        @click="updateLocationNow()"
                        class="btn btn-warning"
                      >
                        Update Now
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
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "UpdateLocation",
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
      locationId: "",
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
      this.locationId = this.$route.params.locationId;
      this.canCurrentUserAccessThisLocation();
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.state.name = this.locationData[0].name;
        this.state.Phone = this.locationData[0].Phone;
        this.state.address = this.locationData[0].address;
      } else {
        this.redirectTo({ value: "HomeView" });
      }
    },
    async updateLocationNow() {
      this.v$.$validate(); // Activate My Validations
      if (!this.v$.$error) {
        let results = await axios.put(
          `http://localhost:3000/locations/${this.locationId}`,
          {
            name: this.state.name,
            Phone: this.state.Phone,
            address: this.state.address,
            userId: this.userId,
          }
        );
        if (results.status == 200) {
          // Show Success message
          this.ErrorMessage = "";
          this.successMessage = "Location is Update...";
          setTimeout(() => {
            this.redirectTo({ value: "HomeView" });
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
