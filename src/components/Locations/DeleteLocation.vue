<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <h1>Delete Restaurant #{{ deleteLocation }}</h1>
        <hr />
        <p class="text-danger">
          Are You Sure You Want To Delete This Location?
        </p>
        {{ name }} <br />
        {{ Phone }} <br />
        {{ address }} <br />
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteLocationNew()">
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
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteLocation",
  components: {
    NavbarH,
  },
  data() {
    return {
      name: "",
      Phone: "",
      address: "",
      userId: "",
      deleteLocation: "",
      successMessage: "",
      ErrorMessage: "",
      locationData: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
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
      // Go This items Give Date on locId
      let result = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}`
      );
      let resultLength = result.data.length;
      for (var i = 0; i < resultLength; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      // Go This items Give Date on All Categories
      let resultForCategories = await axios.get(
        `http://localhost:3000/Categories?locationId=${this.locationId}`
      );
      let resultCatLength = resultForCategories.data.length;
      for (var c = 0; c < resultCatLength; c++) {
        this.allCatsIdIs.push(resultForCategories.data[c].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ value: "HomeView" });
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
    async deleteLocationNew() {
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.deleteLocation}`
      );
      let allCatsResults = [];
      for (var v = 0; v < this.allCatsIdIs.length; v++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[v]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      let allItemsResults = [];
      for (var y = 0; y < this.allItemsIdIs.length; y++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[y]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      if (
        result.status == 200 &&
        !allCatsResults.includes(false) &&
        !allItemsResults.includes(false)
      ) {
        this.successMessage = "Location Is Deleted...";
        this.ErrorMessage = "";
        setTimeout(() => {
          this.redirectTo({ value: "HomeView" });
        }, 2000);
      } else {
        this.successMessage = "";
        this.ErrorMessage = "Something Went Wrong, Try Again";
      }
    },
  },
};
</script>
