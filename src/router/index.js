import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Product from '../views/Product.vue';
import Cart from '../views/Cart.vue';
import Location from '../views/Location.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/location',
    name: 'Location',
    component: Location,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/product/:productId',
    name: 'ProductDetails',
    component: Product,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
