<template>
    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
        Register
    </button>

    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title h4" id="registerModal">Login</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="registerUsername" class="form-label">Username</label>
                        <input type="text" class="form-control" id="registerUsername" v-model="registerUsername">
                        <div class="form-text" v-if="v$.registerUsername.$error">
                            <p v-for="error in v$.registerUsername.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="registerPassword" v-model="registerPassword">
                        <div class="form-text" v-if="v$.registerPassword.$error">
                            <p v-for="error in v$.registerPassword.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="registerName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="registerName" v-model="registerName">
                        <div class="form-text" v-if="v$.registerName.$error">
                            <p v-for="error in v$.registerName.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="registerSurname" class="form-label">Surname</label>
                        <input type="text" class="form-control" id="registerSurname" v-model="registerSurname">
                        <div class="form-text" v-if="v$.registerSurname.$error">
                            <p v-for="error in v$.registerSurname.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="registerPhoneNumber" class="form-label">Phone Number</label>
                        <input type="number" class="form-control" id="registerPhoneNumber" v-model="registerPhoneNumber">
                        <div class="form-text" v-if="v$.registerPhoneNumber.$error">
                            <p v-for="error in v$.registerPhoneNumber.$errors" :key="error.$uid">{{ error.$message }}
                            </p>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="registerEmail" v-model="registerEmail">
                        <div class="form-text" v-if="v$.registerEmail.$error">
                            <p v-for="error in v$.registerEmail.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" ref="closeRegisterModal"
                        data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="handleRegister">Register</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { required, minLength, maxLength, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { register } from "../services/services";
import { useToast } from 'vue-toast-notification';

const registerUsername = ref("");
const registerPassword = ref("");
const registerName = ref("");
const registerSurname = ref("");
const registerPhoneNumber = ref("");
const registerEmail = ref("");

const closeRegisterModal = ref(null)

const rules = computed(() => {
    return {
        registerUsername: { required, minLength: minLength(2), maxLength: maxLength(20) },
        registerPassword: { required, minLength: minLength(5), maxLength: maxLength(30) },
        registerName: { required, minLength: minLength(2), maxLength: maxLength(30) },
        registerSurname: { required, minLength: minLength(2), maxLength: maxLength(30) },
        registerPhoneNumber: { required, minLength: minLength(8), maxLength: maxLength(12) },
        registerEmail: { required, email }
    }
})

const $toast = useToast()


const v$ = useVuelidate(rules, {
    registerUsername, registerPassword,
    registerName, registerSurname, registerPhoneNumber, registerEmail
})

const handleRegister = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (isFormCorrect) {
        register(registerUsername.value,
            registerPassword.value,
            registerEmail.value,
            registerPhoneNumber.value,
            registerName.value,
            registerSurname.value)
            .then((res) => {
                closeRegisterModal.value.click()
                resetForm()
                $toast.open({
                    message: 'Successfully registered, you can now login.',
                    type: "success",
                    position: "bottom-right",
                    duration: 3000,
                    dismissible: true
                })
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

const resetForm = () => {
    registerUsername.value = "";
    registerPassword.value = "";
    registerName.value = "";
    registerSurname.value = "";
    registerEmail.value = "";
    registerPhoneNumber.value = "";
    v$.value.$reset()
}
</script>