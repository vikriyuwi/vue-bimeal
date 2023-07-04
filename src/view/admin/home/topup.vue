<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '../../../api';
import loadingBar from "../../../components/loadingBar.vue"

const router = useRouter()
const route = useRoute()
var accessToken = localStorage.getItem('token')
var account = ref([])
var topup = ref([])
var isLoading = ref(false)

const fetchTopup = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/admin/topup/'+route.params.id)
    .then(response => {
        topup.value = response.data.data;
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

const storeVerify = async () => {
    isLoading.value = true
    let formData = new FormData();

    formData.append("id", topup.value.id);

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.post('/api/admin/topup-verify',formData)
    .then(response => {
        fetchTopup()
    })
    .finally(() => {
        isLoading.value = false
    })
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
}

onMounted(() => {
    fetchTopup()
})
</script>
<template>
    <div class="request-page container-fluid d-flex flex-column align-items-center">
        <!-- header -->
        <div class="head-container px-2 d-flex mt-3 mb-3">
            <router-link to="/admin" class="back-button">
                <i class="fa-solid fa-lg fa-chevron-left"></i>
            </router-link>
            <h4 class="mx-auto">Top-up request<span class="text-white"></span></h4>
        </div>
        <div class="request-container mb-5" v-if="topup.length != 0">
            <div class="request-card p-4 d-flex flex-column align-items-center rounded-4 mb-4">
                <img src="../../merchant/resource/lasagna.png" alt="" class="img-fluid rounded-circle">
                <h4 class="mt-3 mb-4"><b>{{ topup.buyer.name }}</b></h4>
                <div class="request-infos w-100  pb-3">
                    <div class="request-info d-flex my-2">
                        <p class="fw-light me-auto">Date:</p>
                        <p class="fw-bold">{{ getDateTime(topup.updated_at) }}</p>
                    </div>
                    <div class="request-info my-2">
                        <p class="fw-light me-auto">Top-up ID:</p>
                        <p class="fw-bold">{{ topup.id }}.</p>
                    </div>
                    <div class="request-info d-flex my-2">
                        <p class="fw-light me-auto">Notify to:</p>
                        <p class="fw-bold">{{ topup.buyer.phone }}</p>
                    </div>
                </div>
                <!-- <div class="request-infos w-100 py-4 text-center">
                    <p class="mb-2 fw-bold">Receipt</p>
                    <button class="btn rounded-4 py-3 px-4 fw-bold"><i class="fa-solid fa-eye me-2"></i>View</button>
                </div> -->
                <div class="request-infos w-100 py-3">
                    <div class="request-info d-flex my-2">
                        <p class="fw-light me-auto">Amount:</p>
                        <p class="fw-bold">{{ formatRupiah(topup.debt) }}</p>
                    </div>
                    <div class="request-info d-flex my-2">
                        <p class="fw-light me-auto">Fees:</p>
                        <p class="fw-bold">Rp 1,000</p>
                    </div>
                </div>
                <div class="request-total d-flex mt-3 w-100">
                    <p class="fw-bold me-auto mt-1">Total:</p>
                    <h4>{{ formatRupiah(+topup.debt + 1000) }}</h4>
                </div>
            </div>
            <div class="row btn-row gx-4">
                <div class="col-12">
                    <button v-if="topup.status == 'PROCESS'" @click="storeVerify()" class="btn btn-lg btn-dark rounded-4 w-100">
                        <span v-if="isLoading">
                            <loadingBar class="mx-auto"></loadingBar>
                        </span>
                        <span v-else>
                            Accept
                        </span>
                    </button>
                    <button class="btn btn-lg btn-success rounded-4 w-100">
                        Accepted
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>