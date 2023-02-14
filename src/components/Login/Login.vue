<template>
  <form @click.prevent>
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div
              class="card"
              style="border-radius: 15px display: block;margin: 48px;"
            >
              <div class="card-body p-5">
                <h2 class="text-center mb-5">Login</h2>
                <form>
                  <div class="form-outline mb-5">
                    <div
                      class="form-floating mb-3"
                      :class="{ 'form-group-error': v$.email.$error }"
                    >
                      <input
                        type="email"
                        class="w250 form-control"
                        id="floatEmailIS"
                        placeholder="Your Email Is"
                        v-model.trim="state.email"
                      />
                      <label for="floatItemQty">Your Email Is</label>
                      <span class="error-feedback" v-if="v$.email.$error">{{
                        v$.email.$errors[0].$message
                      }}</span>
                    </div>
                  </div>

                  <div class="form-outline mb-4">
                    <div
                      class="form-floating mb-3"
                      :class="{ 'form-group-error': v$.password.$error }"
                    >
                      <input
                        type="password"
                        class="w250 form-control"
                        id="floatPasswordIs"
                        placeholder="Your password Is"
                        v-model.trim="state.password"
                      />
                      <label for="floatItemQty">Your password Is</label>
                      <span class="error-feedback" v-if="v$.password.$error">{{
                        v$.password.$errors[0].$message
                      }}</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-center">
                    <button
                      @click="userLogin()"
                      type="button"
                      class="btn btn-primary btn-lg"
                    >
                      Login
                    </button>
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
                  <br />
                  <div class="row g-3 align-items-center">
                    <div
                      class="col-auto d-block mx-auto alert alert-danger"
                      v-if="ErrorMessage.length > 0"
                    >
                      {{ ErrorMessage }}
                    </div>
                  </div>

                  <p class="text-center text-muted mt-5 mb-0">
                    Have already an account?
                    <a href="#!" class="fw-bold text-body"
                      ><u
                        ><button
                          type="button"
                          @click="redirectTo({ value: 'SignUp' })"
                          class="btn btn-link"
                        >
                          Sign Up
                        </button></u
                      ></a
                    >
                  </p>
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
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  name: "LoginForm",
  //Compostion API
  setup() {
    // State Date
    const state = reactive({
      password: "",
      email: "",
    });
    //Validations
    const rules = computed(() => {
      return {
        email: { required, email },
        password: { required },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return { successMessage: "", ErrorMessage: "" };
  },
  // If you are registered go to HomeView page
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ value: "HomeView" });
    }
  },
  methods: {
    // On Click Button Sign Up // Using VueX
    ...mapActions(["redirectTo"]),
    //The click On button Sign Up
    // signUpPage() {
    //   this.$router.push({ name: "SignUp" });
    // },
    async userLogin() {
      // Activate Me Validate is Date
      this.v$.$validate();
      if (!this.v$.$error) {
        //console.log("Form Validate SuccessFully");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          this.successMessage = "Loading ...";
          this.ErrorMessage = "";
          setTimeout(() => {
            this.redirectTo({ value: "HomeView" });
          }, 1000);
        } else {
          this.successMessage = "";
          this.ErrorMessage = "User In Invalid";
        }
      } else {
        this.successMessage = "";
        this.ErrorMessage = "You must Enter Your Email And Password fields!";
      }
      //console.log(result);
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 19.1px;
  border-radius: 16px;
}
</style>
