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
    <div class="footer container-fluid fixed-bottom d-flex align-items-center flex-column">
        <!-- main footer -->
        <div class="footer-container rounded-5 shadow-sm mb-3">
            <div class="footer-row row px-3">
                <div class="col-6 text-center" v-bind:class="{ 'active': isActive('/admin') }">
                    <div class="col-con">
                        <router-link to="/admin">
                            <i class="fa-solid fa-xl fa-file-lines"></i>
                        </router-link>
                    </div>
                    <div class="rounded-5 selec mx-auto "></div>
                </div>
                <div class="col-6 text-center" v-bind:class="{ 'active': isActive('/admin/profile') }">
                    <div class="col-con">
                        <router-link to="/admin/profile">
                            <i class="fa-solid fa-xl fa-user-gear"></i>
                        </router-link>
                    </div>
                    <div class="rounded-5 selec mx-auto"></div>
                </div>
            </div>
        </div>
    </div>
</template>