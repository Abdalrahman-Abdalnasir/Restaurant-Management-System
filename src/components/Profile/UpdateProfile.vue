<template>
  <div class="container">
    <NavbarH />
    <section @click.prevent>
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
                  <h2 class="text-center mb-5">Update Profile</h2>
                  <form>
                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        class="form-control form-control-lg"
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

                    <div class="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        class="form-control form-control-lg"
                        placeholder="Enter Your Email"
                        v-model.trim="email"
                      />
                      <span class="error-feedback" v-if="v$.email.$error">{{
                        v$.email.$errors[0].$message
                      }}</span>
                      <label class="form-label" for="form3Example3cg"
                        >Your Email</label
                      >
                    </div>

                    <div class="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cg"
                        class="form-control form-control-lg"
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

                    <div class="d-flex justify-content-center">
                      <button
                        @click="UpdateProfileNow()"
                        type="submit"
                        class="btn btn-warning btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Update Profile Now
                      </button>
                    </div>
                    <div class="col-auto d-block mx-auto">
                      <div class="col-auto d-block mx-auto error-feedback">
                        {{ updateError }}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "UpdateProfile",
  components: {
    NavbarH,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      password: "",
      userId: "",
      updateError: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      email: { required, email },
      password: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    // Return User Date
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.password = JSON.parse(user).password;
      this.userId = JSON.parse(user).id;
    } else {
      this.redirectTo({ value: "SignUp" });
      //this.$router.push({name:"Profile_Page" , params: { pageTitle: "Profile_Page"}});
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async UpdateProfileNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        // Put = Update
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
        );
        //console.log(result);
        if (result.status == 200) {
          //console.log("Profile Is Updated Successfully");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.redirectTo({ value: "Profile_Page" });
        } else {
          console.warn("Profile Is Not Update");
          this.updateError = "Something Went Wrong, Try Again!";
        }
      } else {
        this.updateError = "Something Went, Try Again!";
      }
    },
  },
};
</script>

<style>
.error-feedback {
  color: red;
  font-size: 0.85em;
  display: block;
  text-align: center;
  padding: 5px;
}
</style>
