<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';
import router from "../../../router";

var accessToken = localStorage.getItem('token');
var types = ref([])
var selectedImage = ref()
var isLoading = ref(false)
var errors = ref([])

var name = ref()
var price = ref()
var product_type_id = ref()
var selectedImage = ref()

const fetchType = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/product-type')
    .then(response => {
        types.value = response.data.data
    })
}

function handleImageChange(event) {
    selectedImage.value = event.target.files[0];
    console.log(selectedImage.value)
}

function previewImage() {
    if (selectedImage != null) {
        return URL.createObjectURL(this.selectedImage);
    }
    return null;
}

const storeProduct = async () => {
    isLoading.value = true

    let formData = new FormData();

    formData.append('name',name.value)
    formData.append('price', price.value)
    formData.append('product_type_id', product_type_id.value)
    formData.append('image', selectedImage.value)

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.post('/api/merchant/product',formData)
    .then(response => {
        
    }).finally(() => {
        router.push({name:'merchant.product'})
    })
}

onMounted(() => {
    fetchType()
})

</script>
<template>
    <div class="edit-menu-container container-fluid d-flex flex-column align-items-center">
        <div class="head-container px-2 d-flex mt-3 mb-3">
            <router-link to="/merchant/product" class="back-button">
                <i class="fa-solid fa-lg fa-chevron-left"></i>
            </router-link>
            <h4 class="mx-auto">Add menu</h4>
        </div>
        <form  @submit.prevent="storeProduct()">
            <div class="profile-card p-4 d-flex flex-column align-items-center rounded-4">
                <span>
                    <img v-if="selectedImage == null" src="../resource/lasagna.png" alt="" class="img-fluid rounded-circle">
                    <img v-else :src="previewImage()" alt="" class="img-fluid rounded-circle">
                </span>
                <h4 class="mt-3"><b>Phoulet keju</b></h4>
                <div v-if="errors.length != 0" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>{{ errors.message }}</strong> You should check in on some of those fields below.
                </div>
                <div class="mb-3 w-100 my-2">
                    <label for="name" class="form-label fw-bold mb-1 ms-2">Name:</label>
                    <input type="text" class="form-control rounded-pill" id="name" v-model="name">
                </div>
                <div class="mb-3 w-100 my-2">
                    <label for="price" class="form-label fw-bold mb-1 ms-2">Price:</label>
                    <input type="text" class="form-control rounded-pill" id="price" v-model="price">
                </div>
                <div class="mb-3 w-100 my-2">
                    <label for="type" class="form-label fw-bold mb-1 ms-2">Type:</label>
                    <select class="form-select rounded-pill" id="type" v-model="product_type_id">
                        <option>Select Type</option>
                        <option v-if="types.length != 0" v-for="(type,index) in types" :key="index" :value="type.id">{{ type.name }}</option>
                    </select>
                </div>
                <div class="mb-3 w-100 my-2">
                    <label for="image" class="form-label fw-bold mb-1 ms-2">image:</label>
                    <input type="file" class="form-control rounded-pill" id="image" accept="image/jpeg, image/png" @change="handleImageChange">
                </div>
            </div>
            <div class="row g-3 mt-4">
                <div class="col-12">
                    <button class="btn rounded-4 w-100 fw-bold py-2">Submit</button>
                </div>
            </div>
        </form>
    </div>
</template>