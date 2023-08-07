<template>
    <div class="row">
        <div class="mb-2 col-xl-6" v-for="session in  sessions ">
            <div class="text-center card bg-dark text-light">

                <div class="card-header">
                    <div v-if="session.owner !== undefined && session.owner !== null">
                        <router-link :style="{ textDecoration: 'none' }" :to="`/profile/${session.owner}`">{{ session.owner
                        }}</router-link>
                    </div>
                    <div v-else>{{ session.city }}</div>
                </div>


                <div class="card-body">
                    <div class="card-title h5">Facility Name: {{ session.facilityName }}</div>
                    <p class="card-text">District: {{ session.district }}</p>
                    <p class="card-text">Description: {{ session.description }}</p>
                    <p class="card-text">Event date: {{ session.eventDate }} </p>
                    <p class="card-text">Player limit: {{ session.playerLimit }}</p>
                    <p class="card-text">Players joined: </p>
                    <div class="row">
                        <div class="col-md-2" v-for="user in session.users" :key="user">
                            <router-link :style="{ textDecoration: 'none' }" :to="`/profile/${user}`">{{ user
                            }}</router-link>
                        </div>
                    </div>
                    <div v-if="Date.parse(session.eventDate) > Date.now() && isAuthenticated">
                        <button :disabled="disabled" class="btn btn-danger"
                            v-if="session.owner === extractUsername() || $route.params.username"
                            @click="handleCancel(session.id)">Cancel</button>
                        <div v-else>
                            <button class="btn btn-danger" :disabled="disabled" @click="handleLeave(session)"
                                v-if="session.users.includes(extractUsername())">Leave</button>
                            <button class="btn btn-primary" :disabled="disabled" @click="handleJoin(session)"
                                v-else>Join</button>
                        </div>
                    </div>
                </div>
                <div class="card-footer">Created at: {{ session.createdAt }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import router from '../router';
import { useAuthStore } from '../stores/authStore';
import { useSessionStore } from '../stores/sessionStore';
import { checkJwt, extractUsername } from '../utils/jwtHelper';
import { ref } from "vue"
import { useToast } from 'vue-toast-notification';

const authStore = useAuthStore()
const sessionStore = useSessionStore()

const { deleteSessionBySessionId, addUserToSession, leaveSessionBySessionId } = sessionStore
const { changeAuthenticationStatus } = authStore

const { isAuthenticated } = storeToRefs(authStore)
const { sessions } = storeToRefs(sessionStore)

const disabled = ref(false)

const $toast = useToast()

const handleCancel = (sessionId) => {
    if (checkJwt()) {
        try {
            disabled.value = true
            deleteSessionBySessionId(sessionId)
            $toast.open({
                message: "Session deleted",
                type: "error",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
        catch (err) {
            $toast.open({
                message: err.response.data.detail,
                type: "error",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
    }
    else {
        changeAuthenticationStatus(false)
        router.push("/")
    }
}
const handleLeave = (session) => {
    if (checkJwt()) {
        try {
            disabled.value = true
            leaveSessionBySessionId(session)
            $toast.open({
                message: "Left the session.",
                type: "success",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
        catch (err) {
            $toast.open({
                message: err.response.data.detail,
                type: "error",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
    }
    else {
        changeAuthenticationStatus(false)
        router.push("/")
    }
}
const handleJoin = (session) => {
    if (checkJwt()) {
        try {
            disabled.value = true
            addUserToSession(session)
            $toast.open({
                message: "Joined the session.",
                type: "success",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
        catch (err) {
            $toast.open({
                message: err.response.data.detail,
                type: "error",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
            disabled.value = false
        }
    }
    else {
        changeAuthenticationStatus(false)
        router.push("/")
    }
}
</script>
