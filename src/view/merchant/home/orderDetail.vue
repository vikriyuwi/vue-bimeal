<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '../../../api';

const router = useRouter()
const route = useRoute()
var accessToken = localStorage.getItem('token')
var account = ref([])

var isLoading = true
var balance = ref([])
var order = ref([])
var orderProgress = '0%';
var orderDetails = ref([])
var bill = ref([])

const errors = ref([])
const code = ref([])

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

const fetchOrderDetail = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order/'+route.params.id+'/detail')
    .then(response => {
        isLoading = false;
        orderDetails.value = response.data.data;
        bill.value = countBill();
    })
}

const fetchOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order/'+route.params.id)
    .then(response => {
        isLoading = false;
        order.value = response.data.data;
        switch (order.value.status) {
            case 'PAID':
                orderProgress = '25%'
                break;
            case 'PROCESS':
                orderProgress = '50%'
                break;
            case 'PICKUP':
                orderProgress = '75%'
                break;
            case 'DONE':
                orderProgress = '100%'
                break;
            default:
                break;
        }
    });
}

function countBill() {
    const details = orderDetails.value
    var total = 0;
    for (let i = 0; i < details.length; i++) {
        total += Number(details[i].total_price)
        // console.log(details[i].total_price)
    }
    return total
}

const updateOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order/'+route.params.id+'/update')
    .then(response => {
        fetchOrder()
        fetchOrderDetail()
    })
}

function getDateTime(timestamp) {
    // Create a new Date object
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    // Format the result
    const result = `${formattedDate} ${formattedTime}`;

    return result
}

const storeServeOrder = async () => {
    let formData = new FormData();
    
    formData.append('_method', 'PUT')
    formData.append("code", code.value);

    await api.post('/api/merchant/order/'+route.params.id+'/serve', formData)
    .then(response => {
        fetchOrder()
        fetchOrderDetail()
    })
    .catch((error) => {
        errors.value = error.response.data;
    });
};

onMounted(() => {
    checkToken()
    fetchOrder()
    fetchOrderDetail()
})
</script>
<template>
    <div class="ongoing-page container-fluid d-flex flex-column align-items-center">
        <div class="head-container px-2 position-relative">
            <router-link to="" @click.native="router.back()" class="back-button">
                <i class="fa-solid fa-lg fa-chevron-left"></i>
            </router-link>
            <h4 class="position-absolute top-0 text-center w-100">Your order</h4>
        </div>
        <div class="ongoing-container mt-3">
            <div class="order-detail text-center mt-3 mb-4">
                <p class="fw-semibold">{{ order.id }}</p>
                <p class="fw-light mb-5">{{ getDateTime(order.updated_at) }}</p>
                <div class="status-container my-5">
                    <div class="position-relative m-4">
                        <div class="progress" role="progressbar" aria-label="Progress" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar" :style="{width:orderProgress}"></div>
                        </div>
                        <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : order.status == 'NEW' }" id="state-1">
                            <i class="fa-solid fa-lg fa-wallet fa-beat-fade"></i>
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : order.status == 'PAID' }" id="state-2">
                            <i class="fa-solid fa-lg fa-shop fa-beat-fade"></i>
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : order.status == 'PROCESS' }" id="state-3">
                            <i class="fa-solid fa-lg fa-fan fa-spin fa-spin-reverse"></i>
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : order.status == 'PICKUP' }" id="state-4">
                            <i class="fa-solid fa-lg fa-boxes-packing fa-bounce"></i>
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="p-0 position-absolute top-0 translate-middle  rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : order.status == 'DONE' }" id="state-5">
                            <i class="fa-solid fa-lg fa-circle-check fa-beat-fade"></i>
                            <i class="fa-solid fa-check"></i>
                        </div>
                    </div>
                </div>
                <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>{{errors.message}}</strong> You should check in on some of those fields below.
                </div>
                <p class="your-order fw-light mt-5 mb-3">Your active order status</p>
                <div v-if="order.status == 'NEW'">
                    <p class="status-text lh-1">Waiting <br>payment</p>
                </div>
                <div v-if="order.status == 'PAID'">
                    <p class="status-text lh-1">Order ready <br>to process</p>
                    <button @click="updateOrder" class="btn btn-dark rounded-4 p-3 mt-3"><b>Update</b></button>
                </div>
                <div v-if="order.status == 'PROCESS'">
                    <p class="status-text lh-1">Order is<br>processing</p>
                    <button @click="updateOrder" class="btn btn-dark rounded-4 p-3 mt-3"><b>Update</b></button>
                </div>
                <div v-if="order.status == 'PICKUP'">
                    <p class="status-text lh-1">Ready <br>to pick up</p>
                    <div class="row mt-4">
                        <div class="col-3"></div>
                        <div class="col-6 text-center">
                            <form class="d-flex border border-2 rounded-pill border-dark px-4" @submit.prevent="storeServeOrder()">
                                <div class="form-floating w-100">
                                    <input v-model="code" type="text" class="form-control border-0" id="floatingInput" placeholder="xxxxxx">
                                    <label for="floatingInput"><p class="fw-light">Enter code</p></label>
                                </div>
                                <button type="submit" class="bg-white border-0"><i class="fa-solid fa-lg fa-circle-arrow-right"></i></button>
                            </form> 
                        </div>
                    </div>
                </div>
                <div v-if="order.status == 'DONE'">
                    <p class="status-text lh-1">Order is<br>done</p>
                </div>
            </div>
            <div v-if="order.length == 0"></div>
            <div v-else v-for="(detail,index) in orderDetails" class="order-list d-flex align-items-center py-3" :key="index">
                <img :src="'https://fikriyuwi.com/bimeal/assets/products/'+detail.product.image" alt="" class="img-fluid rounded-3 me-4">
                <div class="order-info d-flex flex-column">
                    <p class="fw-light mt-auto mb-2">{{ detail.product.name }}</p>
                    <div class="plus-minus p-2 text-center rounded-4 mb-auto">
                        <p class="counter mx-4">{{ detail.quantity }}</p>
                    </div>
                </div>
                <p class="ms-auto fw-semibold">Rp {{ detail.total_price }}</p>
            </div>
            <div class="promo-code rounded-4 p-4 d-flex align-items-center my-4">
                <p class="fw-semibold me-auto">Promo code</p>
                <i class="fa-solid fa-lg fa-plus "></i>
            </div>
            <div class="price-card rounded-4 p-4 my-3">
                <div class="d-flex align-items-center mb-3">
                    <p class="fw-light me-auto">Item total</p>
                    <p class="fw-semibold">Rp 
                        <span v-if="order.payment != null">{{ order.payment.bill }}</span>
                        <span v-else>{{ bill }}</span>
                    </p>
                </div>
                <div class="d-flex align-items-center mb-4">
                    <p class="fw-light me-auto">Discount</p>
                    <p class="fw-semibold">Rp 0</p>
                </div>
                <p class="fw-light">Total</p>
                <h4 class="fw-bold">Rp 
                    <span v-if="order.payment != null">{{ order.payment.bill }}</span>
                    <span v-else>{{ bill }}</span>
                </h4>
                <p v-if="order.payment != null" class="fw-light text-sm"><span v-if="order.length != 0">{{ order.payment.id }}</span></p>
                <p v-if="order.payment != null" class="fw-light text-sm">Paid at : <span v-if="order.length != 0">{{ getDateTime(order.payment.updated_at) }}</span></p>
            </div>
        </div>
    </div>
</template>
