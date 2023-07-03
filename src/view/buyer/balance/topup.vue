<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from "../../../api";

var accessToken = localStorage.getItem('token');
const router = useRouter();
const account = ref([])

const debt = ref("")
const errors = ref([])

const checkToken = async () => {
    if(localStorage.getItem("token") != null ) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/login-data')
        .then((response) => {
            account.value = response.data.data
        }).catch(error => {
            localStorage.removeItem('token')
            router.push({name:"login"})
        });
    } else {
        router.push({name:"login"});
    }
}

const storeTopup = async () => {
    let formData = new FormData();
    formData.append("debt", debt.value);
    await api.post('/api/balance/topup', formData)
    .then(response => {
        router.push({name:"balance"})
    })
    .catch((error) => {
        errors.value = error.response.data;
    });
}

onMounted(() => {
    checkToken()
})
</script>
<template>
    <div class="topup-page container-fluid d-flex flex-column align-items-center">
        <div class="head-container px-2 d-flex mt-3 mb-3">
            <router-link to="" @click.native="router.back()" class="back-button">
                <i class="fa-solid fa-lg fa-chevron-left"></i>
            </router-link>
            <h4 class="mx-auto">Top-up request<span class="text-white">..</span></h4>
        </div>
        <div class="info-container d-flex p-4 rounded-4 shadow-sm my-3">
            <div class="profile-info d-flex flex-column me-auto justify-content-center">
                <p class="fw-light">Transfer to:</p>
                <div class="d-flex align-items-end">
                    <h4><b>23248403 - BCA</b></h4>
                    <p class="fs-6 fw-light ms-2">(bimeal)</p>
                </div>
            </div>
        </div>
        <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{errors.message}}</strong> You should check in on some of those fields below.
        </div>
        <form @submit.prevent="storeTopup()">
            <div class="topup-card p-4 d-flex flex-column align-items-center rounded-4">            
                <div class="mb-3 w-100 my-2">
                    <label for="receipt" class="form-label fw-bold mb-1 ms-2">Amount:</label>
                    <input v-model="debt" type="number" class="form-control rounded-pill" id="receipt">
                </div>
            </div>
            <button class="btn rounded-4 w-100 fw-bold py-2 mt-4">Submit</button>
        </form>
    </div>
</template>