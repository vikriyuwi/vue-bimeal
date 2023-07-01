<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import api from "../../../api";
import navbar from './../components/navbar.vue';
import addOrderButton from '../home/addOrderButton.vue';


var accessToken = localStorage.getItem('token')
var account = ref([])
var products = ref([])
var filteredProducts = ref([])
var search = ref('')

const checkToken = async () => {
    if(localStorage.getItem("token")) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/login-data')
        .then((response) => {
            account.value = response.data.data
        }).catch(error => {
            router.push({name:"login"});
        });
    } else {
        router.push({name:"login"});
    }
}

const fetchDataProducts = async () => {
    //fetch data 
    await api.get('/api/product')
    .then(response => {
        products.value = response.data.data
    });
}

function performSearch() {
    filteredProducts.value = products.value.filter(item =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
}

onMounted(() => {
    checkToken()
    fetchDataProducts()
    performSearch()
})

watch(search, () => {
    performSearch()
})

</script>
<template>
    <div class="search-page container-fluid d-flex flex-column align-items-center">
        <div class="search-container">
            <div class="search-header d-flex px-2">
                <div class="me-auto">
                    <h4><b>What would you have?</b> 🤷</h4>
                </div>
                <div class="notification-button">
                    <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-xl fa-bell"></i>
                    </a>
                </div>
            </div>
            <div class="search-bar border border-3 rounded-pill w-100 px-2 mt-3">
                <form class="d-flex" role="search">
                    <div class="form-floating w-100">
                        <input v-model="search" type="text" class="form-control border-0" id="floatingInput" placeholder="Poulet">
                        <label for="floatingInput"><p class="fw-light">Search</p></label>
                    </div>
                    <button type="submit" class="bg-white border-0"><i class="fa-solid fa-xl fa-magnifying-glass"></i></button>
                </form>
            </div>
        </div>
        <div class="menu-container row g-3 mt-3 text-dark">
            <div class="col-12" v-if="products.length == 0">
                <div class="rounded-4 p-3 border border-2 border-light-subtle">
                    <div class="menu-info text-center my-5">
                        <p><b>Product belum tersedia</b></p>
                        <p class="fw-light"></p>
                    </div>
                </div>
            </div>
            <div class="col-6" v-else v-for="(product,index) in filteredProducts" :key="index">
                <div class="rounded-4 p-3 border border-2 border-light-subtle">
                    <div class="card-img">
                        <img :src="'https://fikriyuwi.com/bimeal/assets/products/'+product.image" alt="" class="img-fluid">
                        <i class="fa-solid fa-lg ${x.type} me-2"></i>
                    </div>
                    <div class="menu-info text-center mt-3">
                        <p><b>{{ product.name }}</b></p>
                        <p class="fw-light">IDR {{ product.price }}</p>
                        <addOrderButton :id="product.id" :access-token="accessToken" @order-now=""></addOrderButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <navbar></navbar>
</template>