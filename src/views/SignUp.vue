<template>
  <!-- <img alt="Vue logo" src="../images/Resturan.png" /> -->
  <div class="container">
    <SignUpForm />
  </div>
</template>

<script>
import SignUpForm from "@/components/Signup/Signup.vue";
export default {
  name: "SignUp",
  components: {
    SignUpForm,
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
