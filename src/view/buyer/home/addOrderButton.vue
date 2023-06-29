<script setup>
import loadingBar from "../../../components/loadingBar.vue"
</script>
<template>
    <button type="button" href="#" class="menu-btn text-center rounded-4 py-3 px-auto w-100 text-center border-0 mt-3" @click="placeOrder(id)" :disabled="isLoading">
        <span v-if="isSuccess">
          <i class="fa-solid fa-check me-2"></i><b>Success!</b>
        </span>
        <loadingBar v-else-if="isLoading" class="mx-auto"></loadingBar>
        <span v-else>
            <i class="fa-solid fa-lg fa-cart-plus me-2"></i><b>add to cart</b>
        </span>
    </button>
</template>
<script>
import api from "../../../api";

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      isSuccess: false,
      orderNow: null,
    };
  },
  methods: {
    async placeOrder() {
      this.isLoading = true;

      let formData = new FormData();
      formData.append("product_id", this.id);
      formData.append("quantity", 1);

      api.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
      try {
        await api.post('/api/order/add', formData);
        this.isLoading = true;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        setTimeout(() => {
          this.isSuccess = false;
        }, 1000);
        await api.get('/api/order/now')
        .then(response => {
            this.orderNow = response.data.data
        })
        this.$emit('order-now', this.orderNow);
      }
    }
  }
};
</script>