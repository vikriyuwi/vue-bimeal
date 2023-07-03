<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';

import navbar from "../components/navbar.vue"
import orderItem from "../components/orderItem.vue"
import headBg from "../components/headBg.vue"

var accessToken = localStorage.getItem('token');
var account = ref([])
var router = useRouter()

var orders = ref([])

const checkToken = async () => {
    if(accessToken != null) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/merchant/login-data')
        .then(response => {
            account.value = response.data.data
        }).catch(error => {
            localStorage.removeItem('token')
            router.push({name:"merchant.login"})
        });
    } else {
        router.push({name:"merchant.login"})
    }
}

const fetchOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order')
    .then(response => {
        orders.value = response.data.data
    });
}

onMounted(() => {
    checkToken()
    fetchOrder()
})
</script>
<template>
<headBg></headBg>
<div class="main-page container-fluid d-flex flex-column align-items-center">
    <!-- header -->
    <div class="head-container d-flex px-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4 class="mt-2">The Phoulet, BINUS@Malang</h4>
        </div>
        <div class="notification-button rounded-circle">
            <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center p-1">
                <img src="../resource/lasagna.png" alt="" class="img-fluid rounded-circle">
            </a>
        </div>
    </div>

    <!-- order types -->
    <div class="type-container row g-3 mt-4" style="{overflow-y: scroll}">
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0 active">
                <i class="fa-solid fa-lg fa-play fa-beat-fade me-2"></i><b>Active</b>
            </button>
        </div>
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-circle-check me-2"></i><b>Done</b>
            </button>
        </div>
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0">
                <b>All</b>
            </button>
        </div>
    </div>
    <!-- order cards -->
    <orderItem v-if="orders.length != 0" v-for="(order,index) in orders" :key="index" :id="order.id"></orderItem>
</div>
<navbar></navbar>
</template>