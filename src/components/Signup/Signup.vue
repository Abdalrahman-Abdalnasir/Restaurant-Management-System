<template>
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
                <h2 class="text-center mb-5">Sign Up</h2>
                <form>
                  <div class="form-outline mb-4">
                    <div
                      class="form-floating mb-3"
                      :class="{ 'form-group-error': v$.name.$error }"
                    >
                      <input
                        type="text"
                        id="form3Example1cg"
                        class="w250 form-control"
                        placeholder="Enter Your Name"
                        v-model.trim="name"
                      />
                      <span class="error-feedback" v-if="v$.name.$error">{{
                        v$.name.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example1cg"
                        >Your Name</label
                      >
                    </div>
                  </div>

                  <div class="form-outline mb-4">
                    <div
                      class="form-floating mb-3"
                      :class="{ 'form-group-error': v$.email.$error }"
                    >
                      <input
                        type="email"
                        id="floatEmailIS"
                        class="w250 form-control"
                        placeholder="Your Email"
                        v-model.trim="email"
                      />
                      <span class="error-feedback" v-if="v$.email.$error">{{
                        v$.email.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example3cg"
                        >Your Email</label
                      >
                    </div>
                  </div>

                  <div class="form-outline mb-4">
                    <div
                      class="form-floating mb-3"
                      :class="{ 'form-group-error': v$.password.$error }"
                    >
                      <input
                        type="password"
                        id="floatPasswordIs"
                        class="w250 form-control"
                        placeholder="Enter Your Password"
                        v-model.trim="password"
                      />
                      <span class="error-feedback" v-if="v$.password.$error">{{
                        v$.password.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example4cg"
                        >Password</label
                      >
                    </div>
                  </div>

                  <div class="d-flex justify-content-center">
                    <button
                      @click="validateEmailBeforeSignUp()"
                      type="button"
                      class="btn btn-primary btn-lg"
                    >
                      Sign Up Now
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
                          @click="redirectTo({ value: 'Login_Page' })"
                          class="btn btn-link"
                        >
                          Login
                        </button></u
                      ></a
                    >
                  </p>
                  <!-- Button trigger modal -->
                  <p class="text-center text-muted mt-5 mb-0">
                    Do you want to know the use of the site !
                    <a href="#!" class="fw-bold text-body"
                      ><u
                        ><button
                          type="button"
                          class="btn btn-link"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                        >
                          Site functionality
                        </button></u
                      ></a
                    >
                  </p>

                  <!-- Modal -->
                  <div
                    class="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">
                            How to use the site
                          </h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-footer">
                          <br />
                          The site is a system for managing your restaurants.<br />
                          1- You register restaurants,<br />
                          2- You can edit, delete and add,<br />
                          3- You can add new food menus to the place knowing
                          that you will add your own categories,<br />
                          4- You can add new items and you can edit and add
                          anything you want
                          <br />Thanks for visiting our site.
                          <br />
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
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
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "SignUp",

  data() {
    return {
      v$: useValidate(),
      name: "",
      password: "",
      email: "",
      successMessage: "",
      ErrorMessage: "",
      userEmailExists: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      password: { required, minLength: minLength(10) },
      email: { required, email },
    };
  },
  mounted() {
    // If you are registered go to HomeView page
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ value: "HomeView" });
    }
  },
  methods: {
    // On Click Button Login // Using VueX
    ...mapActions(["redirectTo"]),
    //The click On button Login
    // LoginPage() {
    //   this.$router.push({ name: "Login_Page" });
    // },
    async validateEmailBeforeSignUp() {
      let res = await axios.get(
        `http://localhost:3000/users?email=${this.email}`
      );
      if (res.status == 200) {
        this.userEmailExists = res.data;
        if (this.userEmailExists.length != 1) {
          this.successMessage = "";
          this.ErrorMessage = "";
          this.signUpNow();
        } else {
          this.successMessage = "";
          this.ErrorMessage = "This Email Already Exists..";
        }
      }
    },
    async signUpNow() {
      // Activate Me Validate is Date
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post("http://localhost:3000/users", {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        if (result.status == 201) {
          //console.log("Added New User Successfully");
          //Save User Data in local storage
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.successMessage = "SingUp ...";
          this.ErrorMessage = "";
          setTimeout(() => {
            // Redirect To Home Page
            // If you are registered go to HomeView page
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
