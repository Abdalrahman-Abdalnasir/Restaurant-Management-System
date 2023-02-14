<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
      <!-- <div class="clearfix"></div>
      <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
        <button type="button" class="btn btn-info float-start">
          Back To Menu
        </button>
      </router-link>
      <div class="clearfix"></div> -->
    </div>
  </div>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <div class="text-center">
          <h1 class="mb0">{{ locName }}</h1>
          <p class="text-muted">{{ locAddress }}</p>
        </div>
        <!-- <h1>Delete Item # {{ itemId }}</h1> -->
        <div class="clearfix"></div>
        <p class="text-danger">
          Are You Sure You Want To Delete All Items For Above Location?
        </p>
        <hr />
        <p class="text-danger">
          When Deleting This Items, You Will No Longer See Them...?
        </p>
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteAllItems()">
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
  name: "DeleteAllItems",
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
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
      myResult: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      // Go This items Give Date on UserId
      let result = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}`
      );
      this.myResult = result.data;
      let resultLength = this.myResult.length;
      for (var i = 0; i < resultLength; i++) {
        this.allItemsIdIs.push(result.data[i].id);
      }
      // console.table(this.allItemsIdIs);
    }
  },
  methods: {
    ...mapMutations(["caUserAccessThisItem"]),
    ...mapActions(["redirectTo"]),
    goBack() {
      this.$router.push({
        name: "Menu",
        params: { locationId: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.locName = this.locationData[0].name;
        this.locAddress = this.locationData[0].address;
      } else {
        this.redirectTo({ value: "HomeView" });
      }
    },
    // Go to categories and delete is id => itemId
    async deleteAllItems() {
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
      if (!allResults.includes(false)) {
        this.successMessage = "AllItem Are Deleted...";
        this.ErrorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "Menu",
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
