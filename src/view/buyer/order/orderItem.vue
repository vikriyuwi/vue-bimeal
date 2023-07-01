<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '../../../api';
import loadingBar from '../../../components/loadingBar.vue';

const props = defineProps({
  id: String,
});

const id = props.id
var accessToken = localStorage.getItem('token')
var order = ref([])
var orderDetails = ref([])
var bill = ref([])
let isItemLoading = true;

const fetchOrderDetail = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/order/'+id+'/detail')
    .then(response => {
        orderDetails.value = response.data.data;
        bill.value = countBill();
    })
}

const fetchOrder = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/order/'+id)
    .then(response => {
        order.value = response.data.data
        fetchOrderDetail()
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
    fetchOrder()
})
</script>
<template>
    <div v-if="order.length != 0" class="history-card bg-white border border-2 border-light-subtle rounded-4 w-100 px-2 mt-3">
            <div class="row h-100">
                <div class="col-6 position-relative">
                    <img v-if="orderDetails.length != 0" :src="'https://fikriyuwi.com/bimeal/assets/products/'+orderDetails[0].product.image" alt="" class="order-img img-fluid rounded-circle position-absolute" id="order-1">
                    <div class="order-img img-fluid rounded-circle position-absolute" id="order-2"></div>
                    <div class="order-img img-fluid rounded-circle position-absolute" id="order-3"></div>
                    <div class="order-txt position-absolute">
                        <p class="fw-light lh-sm text-nowrap">
                            <span v-if="orderDetails.length != 0">{{ orderDetails[0].product.name }}</span>
                            <br> and more</p>
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
    </div>
    <div v-else class="history-card bg-white border border-2 border-light-subtle rounded-4 w-100 px-2 mt-3">
        <loadingBar></loadingBar>
    </div>
</template>