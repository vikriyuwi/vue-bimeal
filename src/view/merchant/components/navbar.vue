<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

function isActive(routeName) {
  return this.route.path === routeName;
}

function isStartWith(routeName) {
  return this.route.path.startsWith(routeName)
}
</script>
<template>
<div class="footer container-fluid fixed-bottom d-flex justify-content-center">
      <div class="footer-container rounded-5 shadow-sm mb-3">
          <div class="footer-row row px-3">
              <div class="col-4 text-center" v-bind:class="{ 'active': isActive('/merchant') }">
                  <div class="col-con">
                    <router-link to="/merchant">
                      <i class="fa-solid fa-xl fa-shop"></i>
                    </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto "></div>
              </div>
              <div class="col-4 text-center" v-bind:class="{ 'active': isActive('/merchant/product') }">
                  <div class="col-con">
                    <router-link to="/merchant/product" id="search">
                        <i class="fa-solid fa-xl fa-utensils"></i>
                    </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
              <div class="col-4 text-center" v-bind:class="{ 'active': isStartWith('/merchant/profile') }">
                  <div class="col-con">
                      <router-link to="/merchant/profile">
                        <i class="fa-solid fa-xl fa-file-lines"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
          </div>
      </div>
</div>
</template>