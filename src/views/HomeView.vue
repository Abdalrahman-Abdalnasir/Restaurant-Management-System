<template>
  <div class="container">
    <NavbarH />
  </div>

  <div class="container">
    <p class="text-start">
      <router-link :to="{ name: 'Profile_Page' }">
        <button class="btn btn-secondary" type="button">Profile</button>
      </router-link>
      Welcome {{ userName.toLocaleUpperCase() }}
    </p>
    <router-link :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">Add New Restaurant</button>
    </router-link>
    <UserLocations :allLocations="listOfLocations" />
  </div>
</template>

<script>
import NavbarH from "@/components/Header/NavbarH.vue";
import UserLocations from "@/components/Locations/UserLocations.vue";
import { mapActions } from "vuex";
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOfLocations: [],
    };
  },
  components: {
    NavbarH,
    UserLocations,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      //If you are not registered, go to SignupV page
      this.redirectTo({ value: "SignUp" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      this.listOfLocations = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>
