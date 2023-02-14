<template>
  <div class="container">
    <div class="row g-3 align-items-center">
      <NavbarH />
    </div>
  </div>
  <div class="container">
    <div class="clearfix"></div>
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button type="button" class="float-start btn btn-info">
        Back To Menu
      </button>
    </router-link>
    <br />
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb-0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <h1>Add New Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemName.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemPrice.$error }"
          >
            <input
              type="Number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span class="error-feedback" v-if="v$.itemPrice.$error">{{
              v$.itemPrice.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemsQty.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantities"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantities</label>
            <span class="error-feedback" v-if="v$.itemsQty.$error">{{
              v$.itemsQty.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 h200 form-control"
              placeholder="Enter Item Descriptions"
              id="floatItemDescriptions"
              v-model.trim="description"
            ></textarea>

            <label for="floatItemDescriptions">Enter Item Descriptions</label>
            <span class="error-feedback" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto"
          :class="{ 'form-group-error': v$.pickedCategory.$error }"
        >
          <div class="form-floating mb-3">
            <select
              class="w250 form-select"
              aria-label="floatItemCategory"
              v-model.trim="pickedCategory"
            >
              <!-- <option>Select Category Name</option> -->
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
              v$.pickedCategory.$errors[0].$message
            }}</span>
          </div>
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
            @click="addNewItem()"
            class="w250 btn btn-primary"
          >
            Add Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import axios from "axios";
import { required, between, maxLength, minLength } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";

export default {
  name: "AddNewItem",
  components: {
    NavbarH,
  },
  data() {
    return {
      v$: useValidate(),
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      locName: "",
      itemPrice: "",
      locAddress: "",
      itemName: "",
      itemsQty: 1,
      pickedCategory: "",
      description: "",
      successMessage: "",
      ErrorMessage: "",
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
  validations() {
    return {
      itemName: { required, minLength: minLength(6) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(120),
      },
      itemsQty: { required, between: between(1, 100000) },
      itemPrice: { required, between: between(0, 1000000) },
      pickedCategory: { required },
    };
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
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "caUserAccessThisLocation",
    ]),
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
    },
    async addNewItem() {
      this.v$.$validate(); // Activate My Validations
      if (!this.v$.$error) {
        let results = await axios.post(`http://localhost:3000/items`, {
          name: this.itemName,
          price: parseFloat(this.itemPrice).toFixed(2),
          description: this.description,
          qty: parseInt(this.itemsQty),
          userId: this.userId,
          locId: parseInt(this.locationId),
          catId: this.pickedCategory,
        });
        if (results.status == 201) {
          // Show Success message
          this.ErrorMessage = "";
          this.successMessage = "Add New Item";
          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { locationId: this.locationId },
            });
          }, 2000);
        } else {
          // Show error message
          this.successMessage = "";
          this.ErrorMessage = "Something Went Wrong, Please Try Again!";
        }
      } else {
        this.successMessage = "";
        this.ErrorMessage = "You must fill in all required fields!";
      }
    },
    // //button Go Back To Menu
    // getBackToMenu() {
    //   this.$router.push({
    //     name: "Menu",
    //     params: { locationId: this.locationId },
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.mb {
  margin-bottom: 0;
}
.w250 {
  min-width: 250px;
}
// !important
.h200 {
  min-height: 200px;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
</style>
