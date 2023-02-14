<template>
  <NavbarH />
  <section @click.prevent>
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
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
                      disabled
                      type="text"
                      id="form3Example1cg"
                      class="form-control form-control-lg"
                      placeholder="Enter Your Name"
                      v-model="name"
                    />
                    <label class="form-label" for="form3Example1cg"
                      >Your Name</label
                    >
                  </div>

                  <div class="form-outline mb-4">
                    <input
                      disabled
                      type="email"
                      id="form3Example3cg"
                      class="form-control form-control-lg"
                      placeholder="Enter Your Email"
                      v-model="email"
                    />
                    <label class="form-label" for="form3Example3cg"
                      >Your Email</label
                    >
                  </div>

                  <div class="form-outline mb-4">
                    <input
                      disabled
                      type="password"
                      id="form3Example4cg"
                      class="form-control form-control-lg"
                      placeholder="Enter Your Password"
                      v-model="password"
                    />
                    <label class="form-label" for="form3Example4cg"
                      >Password</label
                    >
                  </div>

                  <div class="d-flex justify-content-center">
                    <button
                      @click="UpdateProfile()"
                      type="submit"
                      class="btn btn-warning btn-block btn-lg gradient-custom-4 text-body"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions } from "vuex";
export default {
  name: "ProfileVForm",
  components: {
    NavbarH,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  mounted() {
    // Return User Date
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.password = JSON.parse(user).password;
    } else {
      this.redirectTo({ value: "SignUp" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    UpdateProfile() {
      this.redirectTo({ value: "UpdateProfile" });
    },
  },
};
</script>

<style></style>
