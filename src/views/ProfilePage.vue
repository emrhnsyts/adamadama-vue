<template>
    <div class="d-flex justify-content-center mb-4 row">
        <div class="card" :style="{ width: '18rem' }">
            <div class="card-body">
                <div class="card-title h5">{{ user.username }}</div>
                <div class="mb-2 text-muted card-subtitle h6">{{ user.email }}</div>
                <p class="card-text">{{ user.nameAndSurname }} </p>
                <p class="card-text">{{ user.phoneNumber }} </p>
            </div>
        </div>
    </div>
    <h3 class="d-flex justify-content-center mb-4">Owned Sessions</h3>
    <div v-if="sessions.length !== 0">
        <Sessions />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useRouter, useRoute } from "vue-router";
import { useSessionStore } from "../stores/sessionStore"
import Sessions from "../components/Sessions.vue";
import { storeToRefs } from "pinia";

const sessionStore = useSessionStore()
const { sessions } = storeToRefs(sessionStore)
const { fetchSessionByUsername, resetSessions } = sessionStore
const router = useRouter()
const route = useRoute()
const user = ref({})

onMounted(async () => {
    try {
        user.value = await fetchSessionByUsername(route.params.username)
    }
    catch (error) {
        router.push("/notFound")
    }

})

onUnmounted(() => {
    resetSessions()
})
</script>