<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';

import navbar from "../components/navbar.vue"

var accessToken = localStorage.getItem('token');
var account = ref([])
var router = useRouter()

const checkToken = async () => {
    if(accessToken != null) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/admin/login-data')
        .then(response => {
            account.value = response.data
            console.log(account)
        }).catch(error => {
            localStorage.removeItem('token')
            router.push({name:"admin.login"})
        });
    } else {
        router.push({name:"admin.login"})
    }
}

const logout = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/admin/logout')
    .then(response => {
        router.push({name:"admin.login"});
    })
}

onMounted(() => {
    checkToken();
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