<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <div class="container">
    <router-link
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Back To Category</button>
    </router-link>
    &nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button class="btn btn-success">Back To Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1 class="mb-0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <br />
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
                  <h2 class="text-center mb-5">Update Category</h2>
                  <form>
                    <div class="form-outline mb-4">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Add Category Name "
                        v-model.trim="name"
                      />
                      <span class="error-feedback" v-if="v$.name.$error">{{
                        v$.name.$errors[0].$message
                      }}</span>
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
                          @click="UpdateCategory()"
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
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "UpdateCategory",
  components: {
    NavbarH,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      userName: "",
      locName: "",
      locAddress: "",
      name: "",
      successMessage: "",
      ErrorMessage: "",
      listOfUserCategories: [],
      categoryName: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      //If you are not registered, go to SignupV page
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      // I will summon the caUserAccessThisLocation on > store index
      this.caUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "HomeView",
      });
      // I will summon the caUserAccessThisCategory on > store index
      this.caUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "HomeView",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.displayUserCategories(this.userId, this.locationId); // User Cant Duplicate Category Name
      this.getCategoryName(this.userId, this.locationId, this.catId); //Extract the name you want to modify
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "caUserAccessThisLocation",
      "caUserAccessThisCategory",
    ]),
    ...mapActions(["redirectTo"]),
    // User Cant Duplicate Category Name
    async displayUserCategories(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locId}`
      );
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
      }
    },
    // View Location Details on Categories
    async getLocationInfo(userId, locId) {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${userId}&id=${locId}`
      );
      // let locDetails = [];
      if (result.status == 200 && result.data.length > 0) {
        let locDetails = result.data;
        this.locName = locDetails[0].name;
        this.locAddress = locDetails[0].address;
      }
      // console.log(locDetails);
    },
    //Extract the name you want to modify
    async getCategoryName(userId, locId, catId) {
      let result = await axios.get(`
    http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`);
      if (result.status == 200) {
        this.categoryName = result.data;
        if (this.categoryName.length > 0) {
          this.name = this.categoryName[0].name;
        }
      }
    },
    // Add New Category Name When You Click UpdateCategory
    async UpdateCategory() {
      this.v$.$validate();
      // User Cant Duplicate Category Name
      let filterCategoryName = this.listOfUserCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      // console.table(this.listOfUserCategories);
      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.ErrorMessage = "Category Name Already exists, Try Another Name";
          this.successMessage = "";
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.catId}`,
            {
              name: this.name,
              userId: this.userId,
              locationId: parseInt(this.locationId, 10),
            }
          );
          if (result.status == 200) {
            this.ErrorMessage = "";
            this.successMessage = "Update Category Name SuccessFull";
            setTimeout(() => {
              this.$router.push({
                name: "ViewCategories",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.successMessage = "";
            this.ErrorMessage = "Something Went Wrong, Try Again...";
          }
        }
      } else {
        this.successMessage = "";
        this.ErrorMessage = "You Must Fil in Category Name";
      }
    },
  },
};
</script>
