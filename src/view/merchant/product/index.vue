<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';

import navbar from "../components/navbar.vue"
import productItem from "./productItem.vue"

var accessToken = localStorage.getItem('token');
var account = ref([])
var router = useRouter()

var products = ref([])

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

const fetchProduct = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/product')
    .then(response => {
        products.value = response.data.data
    }).catch(error => {

    });
}

onMounted(() => {
    checkToken()
    fetchProduct()
})
</script>
<template>
<div class="menu-page container-fluid d-flex flex-column align-items-center">

    <!-- header -->
    <div class="head-container d-flex px-2 mb-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4 class="mt-2 mb-1 text-dark">Menu management</h4>
        </div>
    </div>

    <div class="type-container row g-3 mt-4">
        <div class="col-12">
            <router-link type="button" to="/merchant/product/add" class="type-button rounded-4 py-3 w-100 text-center border-0 active">
                <i class="fa-solid fa-lg fa-plus me-2"></i><b>Add product</b>
            </router-link>
        </div>
    </div>

    <!-- order types -->
    <!-- <div class="type-container row g-3 mt-4">
        <div class="col-6">
            <a type="button" href="#" class="type-button rounded-4 py-3 w-100 text-center border-0 active">
                <i class="fa-solid fa-lg fa-circle-check me-2"></i><b>Active</b>
            </a>
        </div>
        <div class="col-6">
            <a type="button" href="doneOrder.html" class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-circle-xmark me-2"></i><b>Inactive</b>
            </a>
        </div>
    </div> -->

    <!-- menu cards -->
    <div class="menu-container row g-3 mt-3">
        <productItem v-if="products.length != 0" v-for="(product,index) in products" :key="index" :id="product.id"></productItem>
    </div>
</div>
<navbar></navbar>
</template>