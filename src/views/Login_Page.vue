<template>
  <!-- <img alt="Vue logo" src="../images/Resturan.png" /> -->
  <div class="container">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/Login/Login.vue";
export default {
  name: "Login_Page",
  components: {
    LoginForm,
  },
};
</script>

<style lang="scss" scoped>
// img {
//   border-style: none;
//   position: absolute;
//   z-index: -1;
//   display: block;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   opacity: 0.3;
// }
</style>
