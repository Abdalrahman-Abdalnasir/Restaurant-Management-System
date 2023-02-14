<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <h1>Delete All Categories</h1>
        <hr />
        <p class="text-danger">
          Are You Sure You Want To Delete All Categories for This Location ?
        </p>
        <br />
        <div class="text-center">
          <h1 class="mb-0">{{ locName }}</h1>
          <p class="text-muted">{{ locAddress }}</p>
        </div>
        <p class="text-danger">
          When Deleting All Categories, Their related Menu items Will Be Deleted
          As Well...
        </p>
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteAllCategories()">
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
  name: "DeleteAllCategories",
  components: {
    NavbarH,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      successMessage: "",
      ErrorMessage: "",
      locationData: [],
      name: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
      locName: "",
      locAddress: "",
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
      this.getLocationInfo(this.userId, this.locationId);
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
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
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
    async deleteAllCategories() {
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
      if (!allCatsResults.includes(false) && !allItemsResults.includes(false)) {
        this.successMessage = "Category and related items are All Deleted...";
        this.ErrorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "HomeView",
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
