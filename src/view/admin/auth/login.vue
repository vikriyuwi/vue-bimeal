<script setup>
    import { ref,onMounted } from "vue";
    import { useRouter } from 'vue-router';
    import api from '../../../api';
    import loadingBar from "../../../components/loadingBar.vue"

    var accessToken = localStorage.getItem('token');

    const router = useRouter();
    const username = ref("")
    const password = ref("")
    const errors = ref([]);
    var isLoading = ref(false)

    const checkToken = async () => {
        if(localStorage.getItem("token") != null) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await api.get('/api/admin/login-data')
            .then(response => {
                router.push({name:"admin.home"})
            }).catch(error => {
                localStorage.removeItem('token')
                router.push({name:"admin.login"})
            });
        }
    }

    const storeLogin = async () => {
        isLoading.value = true
        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("username", username.value);
        formData.append("password", password.value);

        //store data with API
        await api.post('/api/admin/login', formData)
        .then(response => {
            localStorage.setItem('token',response.data.access_token)
            router.push({name:"admin.home"})
        })
        .catch((error) => {
            //assign response error data to state "errors"
            errors.value = error.response.data;
        })
        .then(() => {
            isLoading.value = false
        })
    };
    
    onMounted(() => {
        checkToken(accessToken);
    })
</script>

<template>
<div class="main-page container-fluid d-flex flex-column align-items-center">
    <div class="head-container d-flex px-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4>Hi! 👋</h4>
            <p class="fw-light">Looks like you did not login yet</p>
        </div>
        <div class="notification-button rounded-circle">
            <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-xl fa-bell"></i>
            </a>
        </div>
    </div>
    <div class="status-container p-4 rounded-4 mt-4 text-dark">
        <h1 class="fw-bolder">
            Login Admin
        </h1>
        <p class="mb-4">Want to make a new account? <router-link to="">Register here</router-link></p>
        <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{errors.message}}</strong> You should check in on some of those fields below.
        </div>
        <form @submit.prevent="storeLogin()">
            <div class="mb-3">
                <label for="username">Username:</label>
                <input type="text" class="form-control rounded-4" id="username" v-model="username" placeholder="john1423">
            </div>
            <div class="mb-3">
                <label for="password">Password:</label>
                <input type="password" class="form-control rounded-4" id="password" v-model="password">
            </div>
            <button class="btn btn-success rounded-4">
                <span v-if="isLoading != true">
                    Login
                </span>
                <span v-else>
                    <loadingBar></loadingBar>
                </span>
            </button>
        </form>
    </div>
</div>
</template>