<template>
    <button type="button" href="#" class="menu-btn rounded-4 py-3 w-100 text-center border-0 mt-3" @click="placeOrder(id)" :disabled="isLoading">
        <span v-if="isSuccess">Success!</span>
        <span v-else-if="isLoading">Loading...</span>
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
      isSuccess: false
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
        this.isSuccess = true;
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        setTimeout(() => {
          this.isSuccess = false;
        }, 1000);
      }
    }
  }
};
</script>