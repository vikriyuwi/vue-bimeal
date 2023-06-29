<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from "../../../api";
import addOrderButton from './addOrderButton.vue';
import modal from '../components/errorModal.vue';
import loadingBar from '../../../components/loadingBar.vue';

const router = useRouter();

var account = ref([]);
var products = ref([]);
var balance = ref([]);
var orderNow = ref([]);
var orderProgress = '0%';
var orderErrors = ref([]);
var accessToken = localStorage.getItem('token');

let isLoadingBalance = true;
let isLoadingOrder = true;

const fetchBalance = async () => {
    //fetch data 
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/balance')
    .then(response => {
        isLoadingBalance = false;
        balance.value = response.data.data;
    });
}

const fetchOrder = async () => {
    //fetch data 
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/order/now')
    .then(response => {
        isLoadingOrder = false
        orderNow.value = response.data.data
        switch (orderNow.value.status) {
            case 'PAID':
                orderProgress = '25%'
                break;
            case 'PROCESS':
                orderProgress = '50%'
                break;
            case 'PICKUP':
                orderProgress = '75%'
                break;
            case 'DONE':
                orderProgress = '100%'
                break;
            default:
                break;
        }
    })
    .catch(error => {
        console.log(error.data)
    });
}

const fetchDataProducts = async () => {
    //fetch data 
    await api.get('/api/product')
    .then(response => {
        products.value = response.data.data
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

const afterAddOrder = (data) => {
    orderNow.value = data
}

// const addOrder = async (id) => {
//     const [isLoading, setLoading] = useState(false);
//     const [isSuccess, setSuccess] = useState(false);

//     let formData = new FormData();

//     formData.append("product_id", id);
//     formData.append("quantity", 1);

//     api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//     try {
//         // Set loading state to true before making the API call
//         setLoading(true);

//         await api.post('/api/order/add', formData);

//         // Set success state to true upon successful response
//         setSuccess(true);
//     } catch (error) {
//         // Handle error if needed
//     } finally {
//         // Set loading state back to false regardless of success or failure
//         setLoading(false);
//     }
// }

onMounted(() => {
    checkToken()
    fetchDataProducts()
    fetchBalance()
    fetchOrder()
});
</script>

<template>
<modal v-if="orderErrors.length != 0"></modal>
<div class="main-page container-fluid d-flex flex-column align-items-center">
    <div class="head-container d-flex px-2">
        <div class="profile-info d-flex flex-column text-light me-auto">
            <h4>Hi 
                <b v-if="account.length == 0"></b>
                <b v-else>, {{ account.name }}</b>
                👋</h4>
            <p class="fw-light">What do you crave for?</p>
        </div>
        <div class="notification-button rounded-circle">
            <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-xl fa-bell"></i>
            </a>
        </div>
    </div>
    <div class="balance-container d-flex p-4 rounded-4 shadow-sm">
        <div class="profile-info d-flex flex-column me-auto justify-content-center">
            <p class="fw-light">Balance 💵</p>
            <h4>
                <loadingBar v-if="isLoadingBalance" class="mx-auto"></loadingBar>
                <b v-else>Rp {{ balance.balance }}</b>
            </h4>
        </div>
        <div class="topup-btn-container d-flex flex-column align-items-center me-3">
            <div class="notification-button rounded-4">
                <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                    <i class="fa-regular fa-xl fa-plus"></i>
                    
                </a>
            </div>
        </div>
        <div class="topup-btn-container d-flex flex-column align-items-center">
            <div class="notification-button rounded-4">
                <a href="#" class="w-100 h-100 d-flex justify-content-center align-items-center">
                    <i class="fa-regular fa-xl fa-clock"></i>
                </a>
            </div>

        </div>
    </div>
    <div>
        <div v-if="orderNow" class="status-container p-4 rounded-4 mt-4 m-0">
            <div v-if="!isLoadingOrder">
                <div class="position-relative m-4">
                    <div class="progress" role="progressbar" aria-label="Progress" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="{width:orderProgress}"></div>
                    </div>
                    <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : orderNow.status == 'NEW' }" id="state-1">
                        <i class="fa-solid fa-lg fa-house"></i>
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : orderNow.status == 'PAID' }" id="state-2">
                        <i class="fa-solid fa-lg fa-wallet"></i>
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : orderNow.status == 'PROCESS' }" id="state-3">
                        <i class="fa-solid fa-lg fa-house"></i>
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="position-absolute top-0 translate-middle rounded-pill d-flex align-items-center justify-content-center" v-bind:class="{ 'active' : orderNow.status == 'PICKUP' }" id="state-4">
                        <i class="fa-solid fa-lg fa-house"></i>
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <div class="p-0 position-absolute top-0 translate-middle  rounded-pill d-flex align-items-center justify-content-center" id="state-5">
                        <i class="fa-solid fa-lg fa-house"></i>
                    </div>
                </div>
                <div class="row status-info p-3">
                <div class="col-6">
                    <p class="fw-light mb-2">Your active order status</p>
                    <h4>
                        <b v-if="orderNow.status == 'NEW'">Waiting payment</b>
                        <b v-else-if="orderNow.status == 'PAID'">Waiting merchant</b>
                        <b v-else-if="orderNow.status == 'PROCESS'">Order is processing</b>
                        <b v-else-if="orderNow.status == 'PICKUP'">Ready to pickup</b>
                    </h4>
                </div>
                <div class="col-6 d-flex align-items-end justify-content-center">
                    <router-link :to="{name:'order.detail',params:{id:orderNow.id}}" class="btn btn-dark rounded-4 py-3 w-100 text-center">
                        <b>View more</b>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    </div>

    <div class="type-container row g-3 mt-3">
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-burger me-2" style="color: #F28A21;"></i><b>Foods</b>
            </button>
        </div>
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-mug-hot me-2" style="color: #003585;"></i><b>Drinks</b>
            </button>
        </div>
        <div class="col-4">
            <button class="type-button rounded-4 py-3 w-100 text-center border-0">
                <i class="fa-solid fa-lg fa-cookie me-2" style="color: #673100;"></i><b>Snacks</b>
            </button>
        </div>
    </div>
    <div class="menu-container row g-3 mt-3">
        <div class="col-12" v-if="products.length == 0">
            <div class="rounded-4 p-3 border border-2 border-light-subtle">
                <div class="menu-info text-center my-5">
                    <p><b>Product belum tersedia</b></p>
                    <p class="fw-light"></p>
                </div>
            </div>
        </div>
        <div class="col-6" v-else v-for="(product,index) in products" :key="index">
            <div class="rounded-4 p-3 border border-2 border-light-subtle">
                <div class="card-img">
                    <img :src="'https://fikriyuwi.com/bimeal/assets/products/'+product.image" alt="" class="img-fluid">
                    <i class="fa-solid fa-lg ${x.type} me-2"></i>
                </div>
                <div class="menu-info text-center mt-3">
                    <p><b>{{ product.name }}</b></p>
                    <p class="fw-light">IDR {{ product.price }}</p>
                    <addOrderButton :id="product.id" :access-token="accessToken" @order-now="afterAddOrder"></addOrderButton>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="footer container-fluid fixed-bottom d-flex justify-content-center">
      <div class="footer-container rounded-5 shadow-sm mb-3">
          <div class="footer-row row px-3">
              <div class="col-3 text-center active">
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
              <div class="col-3 text-center">
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