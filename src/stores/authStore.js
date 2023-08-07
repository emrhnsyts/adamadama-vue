import { defineStore } from "pinia";
import { ref } from "vue";


export const useAuthStore = defineStore("authStore", () => {
    const isAuthenticated = ref(false)

    const changeAuthenticationStatus = (status) => {
        isAuthenticated.value = status
    }
    return {
        isAuthenticated, changeAuthenticationStatus
    }
})