<template>
  <table class="table caption-top" v-if="allLocations.length > 0">
    <caption>
      <span> List Of Locations ({{ allLocations.length }}) </span>
      <router-link :to="{ name: 'DeleteAllLocations' }">
        <button class="btn btn-outline-danger float-end">Delete All</button>
      </router-link>
      <!-- <span class="float-end">
        <router-link :to="{ name: 'DeleteAllLocations' }">
          <button class="btn btn-danger">Delete All</button>
        </router-link>
      </span> -->
    </caption>
    <!-- table caption-top -->
    <thead class="table-dark">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Phone</th>
        <th scope="col">Address</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(loc, i) in allLocations" :key="i">
        <th scope="row">{{ loc.name }}</th>
        <td>{{ loc.Phone }}</td>
        <td>{{ loc.address }}</td>
        <td>
          <router-link :to="{ name: 'Menu', params: { locationId: loc.id } }">
            <button class="btn btn-success">Menu</button>
          </router-link>

          <div class="clearfix"></div>
          &nbsp;&nbsp;&nbsp;
          <br />

          <router-link
            :to="{
              name: 'UpdateLocation',
              params: { locationId: loc.id },
            }"
          >
            <button class="btn btn-warning">Update</button>
          </router-link>

          <div class="clearfix"></div>
          &nbsp;&nbsp;&nbsp;
          <br />

          <router-link
            :to="{
              name: 'DeleteLocation',
              params: { locationId: loc.id },
            }"
          >
            <button class="btn btn-danger">Delete</button>
          </router-link>
          <div class="clearfix"></div>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="alert alert-warning" role="alert" style="margin-top: 15px">
    No Locations Added Yet
  </div>
</template>

<script>
export default {
  name: "UserLocations",
  props: ["allLocations"],
};
</script>
