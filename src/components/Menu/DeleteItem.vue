<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
      <!-- <div class="clearfix"></div>
      <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
        <button type="button" class="btn btn-info float-and">
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
        <p class="text-danger">Are You Sure You Want To Delete This Item?</p>
        <hr />
        <h4>Item Name : {{ locName }}</h4>
        <hr />
      </div>
    </div>
    <div class="row g-3 align-items-center">
      <div class="col-auto mx-auto d-block">
        <button class="btn btn-info" @click="goBack()">Go Back</button>
        &nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger" @click="deleteItem()">Delete Now</button>
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
  name: "DeleteItem",
  components: {
    NavbarH,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      userId: "",
      successMessage: "",
      ErrorMessage: "",
      locationData: [],
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
      pickedCategory: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      // I will summon the caUserAccessThisItem on > store index
      this.caUserAccessThisItem({
        userIdIs: this.userId,
        locationIdIs: this.locationId,
        itemIdIs: this.itemId,
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
      this.getItemInfo(this.userId, this.locationId, this.itemId);
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
    //It prevents the user from accessing other people's data in items
    async getItemInfo(userId, locId, itemId) {
      let result = await axios.get(`
    http://localhost:3000/items?userId=${userId}&locId=${locId}&id=${itemId}`);
      let resultData = result.data[0];
      if (result.status == 200) {
        this.itemName = resultData.name;
        this.itemPrice = resultData.price;
        this.description = resultData.description;
        this.itemsQty = resultData.qty;
        this.pickedCategory = resultData.catId;
      }
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
    async deleteItem() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
      );
      // let allResults = [];
      // for (var i = 0; i < this.allItemsIdIs.length; i++) {
      //   let result = await axios.delete(
      //     `http://localhost:3000/items/${this.allItemsIdIs[i]}`
      //   );
      //   if (result.status == 200) {
      //     allResults.push(true);
      //   } else {
      //     allResults.push(false);
      //   }
      // }
      //if (result.status == 200 && !allResults.includes(false)
      if (result.status == 200) {
        this.successMessage = "Item Is Deleted...";
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
