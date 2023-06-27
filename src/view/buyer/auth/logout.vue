<script setup>
    import { ref,onMounted } from "vue";

    //import router
    import { useRouter } from 'vue-router';

    //import api
    import api from "../../../api";

    var accessToken = localStorage.getItem('token');

    //init router
    const router = useRouter();

    const logout = async () => {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await api.get('/api/logout')
        .then(() => {
            router.push({name:"login"});
        }).catch(() => {
            router.push({name:"login"});
        });
    }
    
    onMounted(() => {
        logout();
    })
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
            <div class="status-container p-4 text-center rounded-4 mt-4 text-dark">
                Processing logout
            </div>
        </div>
</div>
</template>