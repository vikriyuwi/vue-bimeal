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
              <div class="col-3 text-center" v-bind:class="{ 'active': isActive('/') }">
                  <div class="col-con">
                      <router-link to="/">
                        <i class="fa-solid fa-xl fa-house"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto "></div>
              </div>
              <div class="col-3 text-center" v-bind:class="{ 'active': isActive('/search') }">
                  <div class="col-con">
                    <router-link to="search" id="search">
                        <i class="fa-solid fa-xl fa-magnifying-glass"></i>
                    </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
              <div class="col-3 text-center" v-bind:class="{ 'active': isStartWith('/order') }">
                  <div class="col-con">
                      <router-link to="order">
                        <i class="fa-solid fa-xl fa-file-lines"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
              <div class="col-3 text-center" v-bind:class="{ 'active': isStartWith('/profile') }">
                  <div class="col-con">
                      <router-link to="profile">
                        <i class="fa-solid fa-xl fa-user"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
          </div>
      </div>
</div>
</template>