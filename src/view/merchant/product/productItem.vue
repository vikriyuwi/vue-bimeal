<script setup>
import { ref,onMounted } from "vue";
import { useRouter } from 'vue-router';
import api from '../../../api';
import loadingBar from '../../../components/loadingBar.vue'

var router = useRouter()
var accessToken = localStorage.getItem('token');
var product = ref([])

const props = defineProps({
  id: String,
});

var id = props.id
var isLoading = ref(false)

const fetchProduct = async () => {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.get('/api/merchant/product/'+props.id)
    .then(response => {
        product.value = response.data.data
    }).catch(error => {

    });
}

const availableToggle = async () => {
    isLoading.value = true

    var data = 0

    if(product.value.is_available == 0) {
        data = 1
    }

    let formData = new FormData();

    formData.append('_method','PUT')
    formData.append('is_available', data)

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await api.post('/api/merchant/product/'+id,formData)
    .then(response => {
        fetchProduct()
    }).finally(() => {
        isLoading.value = false
    })
}

onMounted(() => {
    fetchProduct()
})

</script>
<template>
<div class="col-6" v-if="product.length != 0">
    <div class="rounded-4 p-3 border border-2 border-light-subtle">
        <div class="card-img">
            <img :src="'https://fikriyuwi.com/bimeal/assets/products/'+product.image" alt="" class="img-fluid">
            <i class="fa-solid fa-lg fa-cookie me-2"></i>
        </div>
        <div class="menu-info text-center mt-3">
        <p><b>{{ product.name }}</b><a href="editMenu.html"><i class="ms-2 fa-solid fa-square-pen"></i></a></p>
        <p class="fw-light mb-3">Rp {{ product.price }}</p>
        <button class="btn rounded-4 py-2 w-100 text-center" v-on:click="availableToggle()" v-bind:class="{ 'btn-danger': product.is_available == 1 , 'btn-dark': product.is_available == 0}">
            <b>
                <loadingBar v-if="isLoading == true" class="mx-auto"></loadingBar>
                <span v-else>
                    <span v-if="product.is_available == 1">
                        withhold
                    </span>
                    <span v-else>
                        provide
                    </span>
                </span>
            </b>
        </button>
        </div>
    </div>
</div>
</template>