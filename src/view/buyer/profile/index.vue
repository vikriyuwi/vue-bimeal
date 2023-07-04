<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from "../../../api";
import navbar from './../components/navbar.vue';

const router = useRouter();

var accessToken = localStorage.getItem('token');
var account = ref();
var balance = ref([]);
var isLoadingBalance = ref(true)

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

const logout = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/logout')
    .then(response => {
        router.push({name:"login"});
    })
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
}

onMounted(() => {
    checkToken();
    fetchBalance();
    //call method "fetchDataProducts"
});
</script>

<template>
<div class="profile-page container-fluid d-flex flex-column align-items-center">
        <div class="profile-container">
            <div class="profile-header d-flex px-2">
                <div class="me-auto">
                    <h4><b>Profile</b>  👤</h4>
                </div>
                <div class="notification-button">
                    <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-xl fa-bell"></i>
                    </a>
                </div>
            </div>
            <div v-if="account != null" class="profile-card p-4 d-flex flex-column align-items-center rounded-4">
                <img src="https://fikriyuwi.com/assets/img/skill/swift.png" alt="" class="img-fluid rounded-circle">
                <h4 class="mt-3"><b>{{ account.name }}</b></h4>
                <div class="balance-container w-100 mt-4 d-flex p-4 rounded-4 shadow-sm">
                    <div class="profile-info d-flex flex-column me-auto justify-content-center">
                        <p class="fw-light">Balance 💵</p>
                        <h4>
                            <loadingBar v-if="isLoadingBalance" class="mx-auto"></loadingBar>
                            <b v-else>{{ formatRupiah(balance.balance) }}</b>
                        </h4>
                    </div>
                    <div class="topup-btn-container d-flex flex-column align-items-center me-3">
                        <div class="notification-button rounded-4">
                            <router-link to="balance/topup" class="w-100 h-100 d-flex justify-content-center align-items-center">
                                <i class="fa-regular fa-xl fa-plus"></i>
                            </router-link>
                        </div>
                    </div>
                    <div class="topup-btn-container d-flex flex-column align-items-center">
                        <div class="notification-button rounded-4">
                            <router-link to="balance" class="w-100 h-100 d-flex justify-content-center align-items-center">
                                <i class="fa-regular fa-xl fa-clock"></i>
                            </router-link>
                        </div>

                    </div>
                </div>
            </div>
            <div class="profile-option mt-3">
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-user fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Profile</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-lock fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Password</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-key fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Pin</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
            </div>
            <div class="profile-option mt-4">
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-shield-heart fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Privacy</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-file-lines fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Terms of services</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
                <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-ellipsis fa-sm"></i>
                    </div>
                    <p class="fw-light me-auto">Contact us</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
            </div>
            <div class="profile-option mt-4">
                <div @click="logout()" class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                    <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </div>
                    <p class="fw-light me-auto">Log out</p>
                    <i class="fa-solid fa-lg fa-chevron-right"></i>
                </div>
            </div>
        </div>
</div>
<navbar></navbar>
</template>