<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from "../../../api";
import navbar from './../components/navbar.vue';
import orderitem from './orderItem.vue';

var orders = ref([])
var orderDetails = ref([])
var details
var account = ref([])
const router = useRouter()
const accessToken = localStorage.getItem('token');

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

const fetchOrderDetail = async (id) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/order/'+id+'/detail')
    .then(response => {
        orderDetails.value.push(response.data.data)
    })
}

const orderDetail = async () => {
    const orderss = orders.value
    orderss.forEach((order) => {
        fetchOrderDetail(order.id)
    });
}

const fetchOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/order')
    .then(response => {
        orders.value = response.data.data
        orderDetail().then(() => {
            details = Array.from(orderDetails)
        })
        
    })
    .catch(error => {
        
    });
}

function getDate(timestamp) {
    // Create a new Date object
    const date = new Date(timestamp);

    const options = { day: 'numeric', month: 'short'};
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate
}

function statusClass(status) {
    var result
    switch (status) {
        case 'PICKUP':
            result = 'bg-primary'
            break;
        case 'DONE':
            result = 'bg-success'
            break;
        case 'EXPIRED':
            result = 'bg-danger'
            break;
        default:
            result = 'bg-dark'
            break;
    }
    return result
}

onMounted(() => {
    checkToken()
    fetchOrder()
})
</script>
<template>
    <div class="history-page container-fluid d-flex flex-column align-items-center">
        <div class="history-container">
            <div class="history-header d-flex px-2">
                <div class="me-auto">
                    <h4><b>Order History</b>  🕰</h4>
                </div>
                <div class="notification-button">
                    <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-xl fa-bell"></i>
                    </a>
                </div>
            </div>

            <router-link :to="{name:'order.detail',params:{id:order.id}}" v-if="orders.length != 0" v-for="(order, index) in orders" :key="index">
                <orderitem :id="order.id"></orderitem>
                <!-- <div class="history-card bg-white border border-2 border-light-subtle rounded-4 w-100 px-2 mt-3">
                    <div class="row h-100">
                        <div class="col-6 position-relative">
                            <img src="src/data/orangeJuice.png" alt="" class="order-img img-fluid rounded-circle position-absolute" id="order-1">
                            <div class="order-img img-fluid rounded-circle position-absolute" id="order-2"></div>
                            <div class="order-img img-fluid rounded-circle position-absolute" id="order-3"></div>
                            <div class="order-txt position-absolute">
                                <p class="fw-light lh-sm text-nowrap">Orange Juice, Tiramisu,<br> and more</p>
                            </div>
                        </div>
                        <div class="col-6 d-flex flex-column">
                            <div class="ms-auto mb-auto">
                                <p class="fw-light">{{ getDate(order.updated_at) }}</p>
                            </div>
                            <div class="rounded-pill ms-auto px-3 py-2"
                                :class="statusClass(order.status)"
                                >
                                <p>{{ order.status }}</p>
                            </div>
                        </div>
                    </div>
                </div> -->
            </router-link>
            <a href="#">
                
            </a>
        </div>
    </div> 
<navbar></navbar>
</template>