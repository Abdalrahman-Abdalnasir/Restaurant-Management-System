<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <h1>Delete Category # {{ catId }}</h1>
        <h4>Category Name : {{ name }}</h4>
        <hr />
        <p class="text-danger">
          Are You Sure You Want To Delete This Category?
        </p>
        <p class="text-danger">
          When Deleted This Category, It Will Delete All Related Menu Items As
          Well...
        </p>
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteCategory()">
          Delete Now
        </button>
      </div>
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
        class="col-auto d-block mx-auto alert alert-warning"
        v-if="ErrorMessage.length > 0"
      >
        {{ ErrorMessage }}
      </div>
    </div>
  </form>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "DeleteCategory",
  components: {
    NavbarH,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      successMessage: "",
      ErrorMessage: "",
      locationData: [],
      name: "",
      allItemsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "SignUp" });
    } else {
      this.deleteLocation = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      // I will summon the caUserAccessThisCategory on > store index
      this.caUserAccessThisCategory({
        userIdIs: this.userId,
        catIdIs: this.catId,
        locationIdIs: this.locationId,
        redirectToPage: "HomeView",
      });
      this.getCategoryName(this.userId, this.locationId, this.catId); //Extract the name you want to modify
      // Go This items Give Date on catId
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.catId}`
      );
      // console.log(result.data.length);
      let resultLength = result.data.length;
      for (var i = 0; i < resultLength; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
    }
  },
  methods: {
    ...mapMutations(["caUserAccessThisCategory"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
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
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.Phone = this.locationData[0].Phone;
        this.address = this.locationData[0].address;
      } else {
        this.redirectTo({ value: "HomeView" });
      }
    },
    // Go to categories and delete is id => catId
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.catId}`
      );
      let allResults = [];
      for (var i = 0; i < this.allItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      if (result.status == 200 && !allResults.includes(false)) {
        this.successMessage = "Category and related items are Deleted...";
        this.ErrorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
          });
        }, 2000);
      } else {
        this.successMessage = "";
        this.ErrorMessage = "Something Went Wrong, Try Again";
      }
    },
  },
};
</script>
