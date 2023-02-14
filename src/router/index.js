import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import Login_Page from "../views/Login_Page.vue";
import Profile_Page from "../views/Profile_Page.vue";
import ErrorPage from "../views/ErrorPage.vue";
import UpdateProfile from "../components/Profile/UpdateProfile.vue";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import DeleteLocation from "../components/Locations/DeleteLocation.vue";
import DeleteAllLocations from "../components/Locations/DeleteAllLocations.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import Menu from "../components/Menu/Menu.vue";
import AddNewCategory from "../components/Menu/AddNewCategory.vue";
import ViewCategories from "../components/Menu/ViewCategories.vue";
import UpdateCategory from "../components/Menu/UpdateCategory.vue";
import DeleteCategory from "../components/Menu/DeleteCategory.vue";
import DeleteAllCategories from "../components/Menu/DeleteAllCategories.vue";
import AddNewItem from "../components/Menu/AddNewItem.vue";
import UpdateItem from "../components/Menu/UpdateItem.vue";
import DeleteItem from "../components/Menu/DeleteItem.vue";
import DeleteAllItems from "../components/Menu/DeleteAllItems.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/SignUp",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/Login_Page",
    name: "Login_Page",
    component: Login_Page,
  },
  {
    path: "/Profile_Page",
    name: "Profile_Page",
    component: Profile_Page,
  },
  {
    path: "/UpdateProfile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/AddNewLocation",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/UpdateLocation/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/DeleteAllLocations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/Menu/location/:locationId",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/Menu/categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/Menu/item/update/:itemId/loc/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/Menu/item/:itemId/delete/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/Menu/items/delete-all/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
  },
  {
    path: "/Menu/categories/update/loc/:locationId/item/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/Menu/categories/delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/Menu/categories/delete/all/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategories,
  },
  {
    path: "/Menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/Menu/add/new/item/loc/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/DeleteLocation/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  //If the user performs the steps on a page that does not exist
  // Stays last
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name == null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE} `;
    } else {
      document.title = `${to.name}`;
    }
  }
  next();
});
export default router;
