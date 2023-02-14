<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <div class="container">
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Add Category</button>
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
    <table class="table caption-top" v-if="numOfCategories > 0">
      <caption>
        <span> List Of Categories ({{ numOfCategories }}) </span>
        <span class="float-end">
          <router-link
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
          >
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <!-- table caption-top -->
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <th scope="row">{{ cat.name }}</th>
          <td>
            &nbsp;
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-warning">Update</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-else
      class="alert alert-warning"
      role="alert"
      style="margin-top: 15px"
    >
      No Categories Added Yet
    </div>
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import axios from "axios";
export default {
  name: "ViewCategories",
  components: {
    NavbarH,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      userName: "",
      locName: "",
      locAddress: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn ",
      "loggedInUserId",
      "numOfCategories",
      "listOfCategories",
    ]),
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      //If you are not registered, go to SignupV page
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.caUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "HomeView",
      });
      // Download this Data is displayAllCategories
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.getLocationInfo(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "caUserAccessThisLocation",
    ]),
    ...mapActions(["redirectTo"]),
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
  },
};
</script>
