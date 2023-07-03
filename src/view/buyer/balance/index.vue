<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from "../../../api";
import loadingBar from '../../../components/loadingBar.vue';

const router = useRouter();

var account = ref([]);
var balance = ref([]);
var balanceHistory = ref([]);
var isLoadingBalance = ref(true);
var accessToken = localStorage.getItem('token');

const fetchBalance = async () => {
    //fetch data 
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/balance')
    .then(response => {
        balance.value = response.data.data;
        isLoadingBalance.value = false;
    });
}

const checkToken = async () => {
    if(localStorage.getItem("token") != null) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/login-data')
        .then((response) => {
            account.value = response.data.data
        }).catch(error => {
            localStorage.removeItem('token')
            router.push({name:"login"})
        });
    } else {
        router.push({name:"login"})
    }
}

const fetchHistory = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/balance/history')
    .then((response) => {
        balanceHistory.value = response.data.data
    }).catch(error => {
        console.log(error)
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

onMounted(() => {
    checkToken()
    fetchBalance()
    fetchHistory()
    console.log(balanceHistory)
});
</script>

<template>
    <div class="transactions-page container-fluid d-flex flex-column align-items-center">
        <div class="transactions-container">
            <div class="head-container px-2 d-flex mt-3 mb-4">
                <router-link to="#" @click.native="router.back()" class="back-button">
                    <i class="fa-solid fa-lg fa-chevron-left"></i>
                </router-link>
                <h4 class="mx-auto">Transaction history</h4>
            </div>
            <div class="transaction-history mt-4">
                <div class="transaction-item d-flex py-3 border-bottom border-1 align-items-center" v-if="balanceHistory.length != 0" v-for="(item, indedx) in balanceHistory" :key="index">
                    <div v-if="item.desc == 'TOPUP'" class="icon-container-green p-3 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <div class="container-layer-green rounded-3 d-flex align-items-center justify-content-center p-2">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                    </div>
                    <div v-else class="icon-container p-3 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <div class="container-layer rounded-3 d-flex align-items-center justify-content-center p-2">
                            <i class="fa-solid fa-utensils"></i>
                        </div>
                    </div>
                    
                    <div class="d-flex w-100">
                        <div class="item-info">
                            <p class="fw-bold fs-5">
                                <span v-if="item.desc == 'TOPUP'">Topup</span>
                                <span v-else>Order</span>
                                <i v-if="item.status == 'SUCCESS'" class="fa-solid fa-circle-check text-success ms-2"></i>
                                <i v-else class="fa-solid fa-clock text-warning ms-2"></i>
                            </p>
                            <p class="fw-light items-list">{{ getDateTime(item.last_update) }}</p>
                        </div>
                        <div class="item-value-green ms-auto">
                            <p :class="{'text-danger' : item.debt < 0}">Rp {{ item.debt }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>