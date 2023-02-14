<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <h1>Delete All Restaurant</h1>
        <hr />
        <p class="text-danger">
          Are You Sure You Want To Delete All Locations?
        </p>
        <p class="text-danger">
          It Will Also Delete All Related Items And Categories... Be Careful!
        </p>
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteAllLocationNew()">
          Delete All Now
        </button>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div
        class="col-auto d-block mx-auto alert alert-warning"
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
  </form>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "DeleteAllLocations",
  components: {
    NavbarH,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      ErrorMessage: "",
      allLocationId: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      // Date locations
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}`
      );
      let resultLength = result.data.length;
      for (var i = 0; i < resultLength; i++) {
        this.allLocationId.push(result.data[i].id);
      }
      // Date Categories
      let resultCatLoc = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}`
      );
      let resultCatLocLen = resultCatLoc.data.length;
      for (var ic = 0; ic < resultCatLocLen; ic++) {
        this.allCatsIdIs.push(resultCatLoc.data[ic].id);
      }
      // Date items
      let resultItemsLoc = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}`
      );
      let resultItemsLocLen = resultItemsLoc.data.length;
      for (var ii = 0; ii < resultItemsLocLen; ii++) {
        this.allItemsIdIs.push(resultItemsLoc.data[ii].id);
      }
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goBack() {
      this.redirectTo({ value: "HomeView" });
    },
    async deleteAllLocationNew() {
      // deleteAllLocationNew this items
      let allItemsResults = [];
      for (var itr = 0; itr < this.allItemsIdIs.length; itr++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[itr]}`
        );
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      // deleteAllLocationNew this categories
      let allCatsResults = [];
      for (var icr = 0; icr < this.allCatsIdIs.length; icr++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.allCatsIdIs[icr]}`
        );
        if (result.status == 200) {
          allCatsResults.push(true);
        } else {
          allCatsResults.push(false);
        }
      }
      // deleteAllLocationNew this locations
      let allResults = [];
      for (var i = 0; i < this.allLocationId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      // console.log(allResults);
      if (
        !allResults.includes(false) &&
        !allItemsResults.includes(false) &&
        !allCatsResults.includes(false)
      ) {
        //All Deleted Successfully
        this.successMessage = "All Locations Is Deleted...";
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
