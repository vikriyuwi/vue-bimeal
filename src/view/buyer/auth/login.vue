<script setup>
    import { ref } from "vue";

    //import router
    import { useRouter } from 'vue-router';

    //import api
    import api from "../../../api";

    //init router
    const router = useRouter();

    const username = ref("")
    const password = ref("")
    const errors = ref([]);

    const storeLogin = async () => {

        //init formData
        let formData = new FormData();

        //assign state value to formData
        formData.append("username", username.value);
        formData.append("password", password.value);

        //store data with API
        await api.post('/api/login', formData)
        .then(response => {
            localStorage.setItem('token',response.data.access_token)
            router.push({path:"/"})
        })
        .catch((error) => {
            //assign response error data to state "errors"
            errors.value = error.response.data;
        });
    };
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
        <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{errors.message}}</strong> You should check in on some of those fields below.
        </div>
        <form @submit.prevent="storeLogin()">
            <div class="mb-3">
                <label for="username">Username:</label>
                <input type="text" class="form-control rounded-4" v-model="username" placeholder="john1423">
            </div>
            <div class="mb-3">
                <label for="password">Password:</label>
                <input type="password" class="form-control rounded-4" v-model="password">
            </div>
            <button class="btn btn-success rounded-4">Login</button>
        </form>
    </div>
</div>
<div class="footer container-fluid fixed-bottom d-flex justify-content-center">
      <div class="footer-container rounded-5 shadow-sm mb-3">
          <div class="footer-row row px-3">
              <div class="col-3 text-center">
                  <div class="col-con">
                      <router-link to="/">
                        <i class="fa-solid fa-xl fa-house"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto "></div>
              </div>
              <div class="col-3 text-center">
                  <div class="col-con">
                      <a href="#" id="search">
                          <i class="fa-solid fa-xl fa-magnifying-glass"></i>
                      </a>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
              <div class="col-3 text-center">
                  <div class="col-con">
                      <a href="#" id="history">
                          <i class="fa-solid fa-xl fa-file-lines"></i>
                      </a>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
              <div class="col-3 text-center active">
                  <div class="col-con">
                      <router-link to="login">
                        <i class="fa-solid fa-xl fa-user"></i>
                      </router-link>
                  </div>
                  <div class="rounded-5 selec mx-auto"></div>
              </div>
          </div>
          <a href="#" class="cart-footer d-flex px-4 align-items-center mt-4">
              <h4 class="me-auto">Rp 23,000</h4>
              <i class="fa-solid fa-2xl fa-cart-plus me-2"></i>
          </a>
          <a href="#" class="ongoing-footer d-flex px-4 align-items-center mt-4">
              <i class="fa-solid fa-2xl fa-wallet me-2"></i>
              <h4 class="me-auto">Pay</h4>
              <h4>Rp 23,000</h4>
          </a>
          <a href="#" class="paid-footer d-flex px-4 align-items-center mt-4">
              <h4 class="me-auto">See order status</h4>
              <i class="fa-solid fa-2xl fa-file-lines me-2"></i>
          </a>
      </div>
</div>
</template>