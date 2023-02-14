<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>

  <div class="container">
    <div>
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button type="button" class="float-start btn btn-success">
          View/Add Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'AddNewItem', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="float-end btn btn-success"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>

    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>

    <div class="clearfix"></div>
    <router-link
      v-if="listOfUserCategories.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger">Delete All Items</button>
    </router-link>
    <div class="clearfix"></div>
    <!-- <br /> -->
    <!-- <div>
    Is User Logged In? {{ isUserLoggedIn }} <br />
      Num of Categories ?{{ loggedInUserId }} <br />
      Is User Logged In? {{ numOfCategories }} <br />
      Categories Array?{{ listOfCategories }} <br />
    </div> -->
    <div class="each-category">
      <div class="" v-for="(cat, i) in listOfUserCategories" :key="i">
        <div class="row">
          <div class="row col-12 catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div
            v-for="(item, h) in listOfUserItems"
            :key="h"
            v-show="cat.id == item.catId"
            :class="{ 'col-xs-12 col-sm-4 px-4': cat.id == item.catId }"
          >
            <div
              v-if="cat.id == item.catId"
              :class="{ 'each-item ': cat.id == item.catId }"
            >
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-description text-break">
                {{ item.description }}
              </p>
              <div>
                <div class="available-items float-start text-muted">
                  Available Qty: {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-muted">
                  Price: {{ numberWithCommas(item.price) }}
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <hr />
            <div class="p-1 mt-2">
              <div class="available-items float-start">
                <router-link
                  :to="{
                    name: 'UpdateItem',
                    params: { itemId: item.id, locationId: locationId },
                  }"
                >
                  <button type="button" class="float-end btn btn-warning">
                    Update
                  </button>
                </router-link>
              </div>
              <div class="item-price float-end">
                <router-link
                  :to="{
                    name: 'DeleteItem',
                    params: { itemId: item.id, locationId: locationId },
                  }"
                >
                  <button type="button" class="float-end btn btn-danger">
                    Delete
                  </button>
                </router-link>
              </div>
            </div>
            <div class="clearfix"></div>
            <hr />
          </div>
        </div>

        <br />
      </div>
    </div>
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Menu",
  components: {
    NavbarH,
  },
  data() {
    return {
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      locName: "",
      locAddress: "",
      listOfUserCategories: [],
      listOfUserItems: [],
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
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      //If you are not registered, go to SignupV page
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser();
      // this.locationId = this.$route.params.locationId;
      this.displayAllCategories({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
      });
      this.caUserAccessThisLocation({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        redirectToPage: "HomeView",
      });
      this.getLocationInfo(this.userId, this.locationId);
      this.getCurrentUserCategories(this.userId, this.locationId);
      this.getCurrentUserItems(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "caUserAccessThisLocation",
    ]),
    //It prevents the user from accessing other people's data in Category
    async getCurrentUserCategories(userId, locId) {
      let result = await axios.get(`
    http://localhost:3000/categories?userId=${userId}&locationId=${locId}`);
      if (result.status == 200) {
        this.listOfUserCategories = result.data;
        // console.table(this.listOfUserCategories);
      }
    },
    async getCurrentUserItems(userId, locId) {
      let result = await axios.get(`
    http://localhost:3000/items?userId=${userId}&locId=${locId}`);
      if (result.status == 200) {
        this.listOfUserItems = result.data;
        // console.table(this.listOfUserItems);
      }
    },
    // Convert the number to a number inside ","
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
  },
};
</script>

<style lang="scss" scoped>
.mb {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 100px;
}
</style>
