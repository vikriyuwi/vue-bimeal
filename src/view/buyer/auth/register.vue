<script setup>
    import { ref,onMounted } from "vue";

    //import router
    import { useRouter } from 'vue-router';

    //import api
    import api from "../../../api";

    var accessToken = localStorage.getItem('token');

    //init router
    const router = useRouter();

    const username = ref("")
    const password = ref("")
    const password_confirmation = ref("")
    const email = ref("")
    const phone = ref("")
    const name = ref("")
    const group = ref("")
    const group_id = ref("")
    const errors = ref([]);
    const errors_data = ref([]);

    const checkToken = async () => {
        if(localStorage.getItem("token") != null) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await api.get('/api/login-data')
            .then(response => {
                router.push({name:"home"});
            }).catch(error => {
                localStorage.removeItem('token')
                router.push({name:"login"});
            });
        }
    }

    const storeRegister = async () => {

        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("username", username.value);
        formData.append("password", password.value);
        formData.append("password_confirmation", password_confirmation.value);
        formData.append("email", email.value);
        formData.append("phone", phone.value);
        formData.append("name", name.value);
        formData.append("group", group.value);
        formData.append("group_id", group_id.value);

        //store data with API
        await api.post('/api/register', formData)
        .then(() => {
            router.push({name:"login"})
        })
        .catch((error) => {
            //assign response error data to state "errors"
            errors.value = error.response.data;
            errors_data.value = error.response.data.data;
        });
    };
    
    onMounted(() => {
        checkToken();
    })
</script>

<template>
<div class="main-page container-fluid d-flex flex-column align-items-center">
    <div class="head-container d-flex px-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4>Hi! 👋</h4>
            <p class="fw-light">Make a new account to get the service</p>
        </div>
        <div class="notification-button rounded-circle">
            <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-xl fa-bell"></i>
            </a>
        </div>
    </div>
    <div class="status-container p-4 rounded-4 mt-4 text-dark">
        <h1 class="fw-bolder">
            Register
        </h1>
        <p class="mb-4">Already have account? <router-link to="login">Login here</router-link></p>
        <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{errors.message}}</strong> You should check in on some of those fields below.
        </div>
        <form @submit.prevent="storeRegister()">
            <div class="mb-2">
                <label for="username">Username:</label>
                <input type="text" class="form-control rounded-4" id="username" v-model="username" placeholder="john1423">
                <div v-if="errors_data.username" class="alert alert-danger mt-2">
                    <span>{{ errors_data.username[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="password">Password:</label>
                <input type="password" class="form-control rounded-4" id="password" v-model="password">
                <div v-if="errors_data.password" class="alert alert-danger mt-2">
                    <span>{{ errors_data.password[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="password_confirmation">Confirmation Password:</label>
                <input type="password" class="form-control rounded-4" id="password_confirmation" v-model="password_confirmation">
                <div v-if="errors_data.password_confirmation" class="alert alert-danger mt-2">
                    <span>{{ errors_data.password_confirmation[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="email">Email:</label>
                <input type="email" class="form-control rounded-4" id="email" v-model="email" placeholder="example@email.com">
                <div v-if="errors_data.email" class="alert alert-danger mt-2">
                    <span>{{ errors_data.email[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="phone">Phone:</label>
                <input type="text" class="form-control rounded-4" id="phone" v-model="phone" placeholder="082XXXXXXXXX">
                <div v-if="errors_data.phone" class="alert alert-danger mt-2">
                    <span>{{ errors_data.phone[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="name">Name:</label>
                <input type="text" class="form-control rounded-4" id="name" v-model="name" placeholder="Nick Nelson">
                <div v-if="errors_data.name" class="alert alert-danger mt-2">
                    <span>{{ errors_data.name[0] }}</span>
                </div>
            </div>
            <div class="mb-2">
                <label for="group">Group:</label>
                <select class="form-select" id="group" v-model="group">
                    <option selected>Open this select menu</option>
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="STAFF">Staff</option>
                    <option value="OTHER">Other</option>
                </select>
                <div v-if="errors_data.group" class="alert alert-danger mt-2">
                    <span>{{ errors_data.group[0] }}</span>
                </div>
            </div>
            <div class="mb-3">
                <label for="group_id">Group ID number:</label>
                <input type="text" class="form-control rounded-4" id="group_id" v-model="group_id" placeholder="250XXXXXXX">
                <div v-if="errors_data.group_id" class="alert alert-danger mt-2">
                    <span>{{ errors_data.group_id[0] }}</span>
                </div>
            </div>
            <button class="btn btn-success rounded-4">Register</button>
        </form>
    </div>
</div>
</template>