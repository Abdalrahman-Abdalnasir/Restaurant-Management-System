<template>
  <ul id="nav">
    <router-link
      :to="{ name: 'HomeView', params: { pageTitle: 'ProfileP' } }"
      exact
    >
      <a>Home</a>
    </router-link>
    <a href="#" class="link" @click="logMeOut()">Logout</a>
  </ul>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "NavbarH",
  methods: {
    ...mapActions(["redirectTo"]),
    logMeOut() {
      localStorage.clear();
      //this.$router.push({ name: "Login_Page" });
      //OR
      this.redirectTo({ value: "Login_Page" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: darkcyan;
$navColor: #525a5a;
ul {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 50px;
  a {
    text-decoration: none;
    font-weight: bold;
    padding: 10px;
  }
}
a.router-link-exact-active a,
ul a a:hover {
  box-shadow: 2px 2px 4px 0px;
}
.link:hover {
  box-shadow: 2px 2px 4px 0px;
}
</style>
