<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '../../../api';

const props = defineProps({
  id: String,
});

var accessToken = localStorage.getItem('token');
var router = useRouter()

var id = props.id
var order = ref([])
var orderDetails = ref([])

const fetchOrderDetail = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order/'+id+'/detail')
    .then(response => {
        orderDetails.value = response.data.data;
        // bill.value = countBill();
    })
}

const fetchOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/order/'+id)
    .then(response => {
        order.value = response.data.data
        fetchOrderDetail()
    });
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

function statusClass(status) {
    var result
    switch (status) {
        case 'NEW':
            result = 'text-bg-dark'
            break;
        case 'PICKUP':
            result = 'text-bg-dark'
            break;
        case 'DONE':
            result = 'text-bg-success'
            break;
        case 'EXPIRED':
            result = 'text-bg-danger'
            break;
        default:
            result = 'text-bg-primary'
            break;
    }
    return result
}

onMounted(() => {
    fetchOrder()
})
</script>
<template>
    <div v-if="order.length != 0" class="order-card border border-2 border-light-subtle rounded-4 p-4 mt-3">
        <div class="d-flex card-header mb-4">
            <p class="fw-light me-auto">{{ order.buyer.name }}
            <br><span class="badge rounded-pill" :class="statusClass(order.status)">{{ order.status }}</span></p>
            <p class="fw-light me-2">{{ getDateTime(order.updated_at) }}</p>
            <router-link :to="{name:'merchant.order.detail',params:{id:order.id}}">
                <i class="fa-solid fa-chevron-right fa-xl"></i>
            </router-link>
        </div>
        <div class="order-items mb-4">
            <div v-if="orderDetails.length != 0" v-for="(item,index) in orderDetails" :key="index" class="order-item rounded-pill my-2 px-3 py-2 d-flex">
                <p class="fw-light me-auto">{{ item.product.name }}</p>
                <p class="fw-light">{{ item.quantity }}x</p>   
            </div>
        </div>
        <div class="row action-buttons g-5">
            <div class="col-12 mx-0">
                <button class="btn btn-lg btn-accept fw-bold rounded-4 w-100 text-center">View more</button>
            </div>
        </div>
    </div>  
</template>