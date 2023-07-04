<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';

import navbar from "../components/navbar.vue"
import headBg from "../../merchant/components/headBg.vue"

var accessToken = localStorage.getItem('token');
var account = ref([])
var router = useRouter()

var topups = ref([])

const checkToken = async () => {
    if(accessToken != null) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/admin/login-data')
        .then(response => {
            account.value = response.data.data
        }).catch(error => {
            localStorage.removeItem('token')
            router.push({name:"admin.login"})
        });
    } else {
        router.push({name:"admin.login"})
    }
}

const fetchTopup = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/admin/topup')
    .then(response => {
        topups.value = response.data.data
    });
}

function getDate(timestamp) {
    // Create a new Date object
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'short'};
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
}

onMounted(() => {
    checkToken()
    fetchTopup()
})
</script>
<template>
<headBg></headBg>
<div class="main-page container-fluid d-flex flex-column align-items-center">

    <!-- header -->
    <div class="head-container d-flex px-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4 class="mt-2">Admin dashboard</h4>
        </div>
        <div class="notification-button rounded-circle">
            <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center p-1">
                <i class="fa-solid fa-xl fa-clock-rotate-left"></i>
            </a>
        </div>
    </div>

    <!-- order types -->
    <div class="type-container row g-3 mt-4">
        <div class="col-6">
            <a type="button" href="#" class="type-button rounded-4 py-3 w-100 text-center border-0 active">
                <i class="fa-solid fa-lg fa-circle-plus me-2"></i><b>Top-up</b>
            </a>
        </div>
        <div class="col-6">
            <a type="button" href="#" class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-circle-arrow-up me-2"></i><b>Withdraw</b>
            </a>
        </div>
    </div>

    <!-- request cards -->
    <div v-if="topups.length != 0" v-for="(topup,index) in topups" :key="index" class="request-card border border-2 border-light-subtle rounded-4 p-4 mt-3">
        <div class="d-flex card-header mb-3 pb-3 border-bottom border-2 border-light-subtle">
            <img src="../../merchant/resource/tiramisu.png" alt="" class="img-fluid rounded-circle me-2">
            <p class="fw-light me-auto">{{ topup.buyer.name }}</p>
            <p class="fw-light me-2">{{ getDate(topup.updated_at) }}</p>
            <router-link :to="{name:'admin.topup',params:{id:topup.id}}">
                <i class="fa-solid fa-chevron-right fa-xl"></i>
            </router-link>
        </div>
        <div class="request-item d-flex mt-4">
            <div class="request-title me-auto">
                <h4 class="text-dark">Top-up
                    <span v-if="topup.status != 'SUCCESS'">
                        <i class="fa-solid fa-clock fa-beat-fade text-warning"></i>
                    </span>
                    <span v-else>
                        <i class="fa-solid fa-circle-check text-success"></i>
                    </span>
                </h4>
            </div> 
            <div class="rounded-pill bg-success px-3 py-2">
                <p><b>{{ formatRupiah(topup.debt) }}</b></p>
            </div> 
        </div>
    </div>  
</div>
<navbar></navbar>
</template>