<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

import { ref, onMounted } from 'vue';

import api from "../../../api";

var accessToken = localStorage.getItem('token');
var account = ref();

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

onMounted(() => {
    checkToken();
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
                <div class="balance-container d-flex p-4 rounded-4 w-100 mt-3">
                    <div class="profile-info d-flex flex-column me-auto justify-content-center">
                        <p class="fw-light">Balance 💵</p>
                        <h4><b>Rp 100,000</b></h4>
                    </div>
                    <div class="topup-button rounded-4 me-3">
                        <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                            <i class="fa-regular fa-xl fa-plus"></i>   
                        </a>
                    </div>
                    <div class="history-button rounded-4">
                        <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                            <i class="fa-regular fa-xl fa-clock"></i>
                        </a>
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
                <router-link to="logout">
                    <div class="profile-option-item d-flex p-3 border-bottom border-2 align-items-center">
                        <div class="icon-container p-2 rounded-3 d-flex align-items-center justify-content-center me-3">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <p class="fw-light me-auto">Log out</p>
                        <i class="fa-solid fa-lg fa-chevron-right"></i>
                    </div>
                </router-link>
            </div>
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
                      <router-link to="profile">
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