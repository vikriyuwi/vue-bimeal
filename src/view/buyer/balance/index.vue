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
    <div class="main-page container-fluid d-flex flex-column align-items-center">
        <div class="head-container px-2 position-relative">
            <router-link to="#" @click.native="router.back()" class="back-button link-dark">
                <i class="fa-solid fa-lg fa-chevron-left"></i>
            </router-link>
            <h4 class="position-absolute top-0 text-center w-100 text-dark">Balance</h4>
        </div>
        <div class="ongoing-container mt-3">
            <div class="balance-container d-flex p-4 rounded-4 shadow-sm">
                <div class="profile-info d-flex flex-column me-auto justify-content-center">
                    <p class="fw-light">Balance 💵</p>
                    <h4>
                        <b v-if="!isLoadingBalance">Rp {{ balance.balance }}</b>
                        <loadingBar v-else  class="mx-auto"></loadingBar>
                    </h4>
                </div>
                <div class="topup-btn-container d-flex flex-column align-items-center me-3">
                    <div class="notification-button rounded-4">
                        <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                            <i class="fa-regular fa-xl fa-plus"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container text-dark py-4">
            <div class="row mb-4">
                <h4 class="text-bolder"><b>History</b></h4>
            </div>
            <div class="row" v-if="balanceHistory.length != 0" v-for="(item, indedx) in balanceHistory" :key="index">
                <div class="col-12 d-flex">
                    <b class="m-0 p-0">
                        <span v-if="item.desc != 'TOPUP'">
                            Payment Order
                        </span>
                        <span v-else>TOPUP</span>
                    </b>
                    <b class="ms-2">
                        <i v-if="item.status == 'SUCCESS'" class="fa-solid fa-circle-check fa-beat text-success"></i>
                    </b>
                    <h4 class="ms-auto fw-bolder" :class="{'text-danger' : item.debt < 0}">Rp {{ item.debt }}</h4>
                </div>
                <div class="col-12">
                    <span>{{ getDateTime(item.last_update) }}</span>
                </div>
                <div class="col-12">
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>