<template>
  <div>
    <img src="../images/ErrorPage.png" class="rounded mx-auto d-block h400" />
  </div>
  <br />
  <div class="text-center">
    <router-link :to="{ name: 'Login_Page' }">
      <button class="btn btn-info">Visit Home Page</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>

<style>
.h400 {
  height: 400px;
}
</style>
