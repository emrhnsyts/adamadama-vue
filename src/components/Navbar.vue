<template>
    <nav class="mb-4 navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
            <span class="navbar-brand" @click="router.push('/')">AdamAdama</span>
            <div class="me-end navbar-nav">
                <div class="mx-2 navbar-nav" v-if="isAuthenticated">
                    <SessionCreateModal />
                    <button class="mx-2 btn btn-outline-primary">
                        <router-link :style="{ textDecoration: 'none' }"
                            :to="`/profile/${extractUsername()}`">Profile</router-link>
                    </button>
                    <button class="btn btn-outline-danger" @click="handleLogout">Logout</button>
                </div>
                <div v-else class="navbar-nav">
                    <div class="mx-2 navbar-nav">
                        <LoginModal />
                    </div>
                    <div class="navbar-nav">
                        <RegisterModal />
                    </div>
                </div>

            </div>
        </div>
    </nav>
</template>

<script setup>
import { extractUsername } from "../utils/jwtHelper"
import SessionCreateModal from "../components/SessionCreateModal.vue"
import LoginModal from "../components/LoginModal.vue"
import RegisterModal from "../components/RegisterModal.vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStore"
import { storeToRefs } from "pinia"

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore);
const { changeAuthenticationStatus } = authStore

const handleLogout = () => {
    localStorage.clear()
    changeAuthenticationStatus(false)
    router.push("/")
}


</script>