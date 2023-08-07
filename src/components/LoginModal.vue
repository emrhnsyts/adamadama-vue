<template>
    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
        Login
    </button>

    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title h4" id="loginModal">Login</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="loginUsername" class="form-label">Username</label>
                        <input type="text" class="form-control" id="loginUsername" v-model="loginUsername">
                        <div class="form-text" v-if="v$.loginUsername.$error">
                            <p v-for="error in v$.loginUsername.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="loginPassword" v-model="loginPassword">
                        <div class="form-text" v-if="v$.loginPassword.$error">
                            <p v-for="error in v$.loginPassword.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" ref="closeLoginModal"
                        data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="handleLogin">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { required, minLength, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from "vue-router";
import { login } from "../services/services"
import { useAuthStore } from "../stores/authStore";
import { useToast } from "vue-toast-notification";

const loginUsername = ref("");
const loginPassword = ref("");

const closeLoginModal = ref(null)

const rules = computed(() => {
    return {
        loginUsername: { required, minLength: minLength(2), maxLength: maxLength(20) },
        loginPassword: { required, minLength: minLength(5), maxLength: maxLength(30) }
    }
})

const $toast = useToast()

const v$ = useVuelidate(rules, { loginUsername, loginPassword })
const router = useRouter()
const { changeAuthenticationStatus } = useAuthStore()

const handleLogin = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (isFormCorrect) {
        login(loginUsername.value, loginPassword.value).then((res) => {
            closeLoginModal.value.click()
            localStorage.setItem("jwt", res.data)
            changeAuthenticationStatus(true)
            router.push(`/profile/${loginUsername.value}`)

        }).catch((err) => {
            $toast.open({
                message: err.response.data.detail,
                type: "error",
                position: "bottom-right",
                duration: 3000,
                dismissible: true
            })
        })
    }
}
</script>