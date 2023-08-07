<template>
    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#sessionModal">
        Create a Session
    </button>

    <div class="modal fade" id="sessionModal" tabindex="-1" aria-labelledby="sessionModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title h4" id="sessionModal">Create a Session</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea type="text" class="form-control" id="description" v-model="description"></textarea>
                        <div class="form-text" v-if="v$.description.$error">
                            <p v-for="error in v$.description.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="city" class="form-label">City</label>
                        <select class="form-control" id="city" v-model="city">
                            <option value="TRABZON">Trabzon</option>
                            <option value="ISTANBUL">Istanbul</option>
                            <option value="ANKARA">Ankara</option>
                            <option value="IZMIR">Izmir</option>
                        </select>
                        <div class="form-text" v-if="v$.city.$error">
                            <p v-for="error in v$.city.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="district" class="form-label">District</label>
                        <input type="text" class="form-control" id="district" v-model="district" />
                        <div class="form-text" v-if="v$.district.$error">
                            <p v-for="error in v$.district.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="facilityName" class="form-label">Facility Name</label>
                        <input type="text" class="form-control" id="facilityName" v-model="facilityName" />
                        <div class="form-text" v-if="v$.facilityName.$error">
                            <p v-for="error in v$.facilityName.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="eventDate" class="form-label">Event Date</label>
                        <input type="datetime-local" class="form-control" id="eventDate" v-model="eventDate" />
                        <div class="form-text" v-if="v$.eventDate.$error">
                            <p v-for="error in v$.eventDate.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="playerLimit" class="form-label">Player Limit</label>
                        <input type="number" class="form-control" id="playerLimit" v-model="playerLimit" />
                        <div class="form-text" v-if="v$.playerLimit.$error">
                            <p v-for="error in v$.playerLimit.$errors" :key="error.$uid">{{ error.$message }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" ref="closeCreateModal"
                        data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="handleCreate">Create</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from "vue"
import { required, minLength, maxLength, minValue, maxValue, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { checkJwt } from "../utils/jwtHelper";
import { useAuthStore } from "../stores/authStore";
import { useSessionStore } from "../stores/sessionStore";
import { useToast } from "vue-toast-notification";

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const { createSession } = sessionStore
const { changeAuthenticationStatus } = authStore

const description = ref("");
const city = ref("ISTANBUL");
const district = ref("");
const facilityName = ref("");
const eventDate = ref("");
const playerLimit = ref("");

const closeCreateModal = ref(null)

const validateEventDate = (value) => {
    return new Date(value) > Date.now()
}

const rules = computed(() => {
    return {
        description: { minLength: minLength(2), maxLength: maxLength(255) },
        city: { required, minLength: minLength(2), maxLength: maxLength(30) },
        district: { minLength: minLength(2), maxLength: maxLength(255) },
        facilityName: { required, minLength: minLength(2), maxLength: maxLength(30) },
        eventDate: { required, validateEventDate: helpers.withMessage("Given date can not be past.", validateEventDate) },
        playerLimit: { required, minValue: minValue(2), maxValue: maxValue(22) }
    }
})

const v$ = useVuelidate(rules, { description, city, district, facilityName, eventDate, playerLimit })

const $toast = useToast()


const handleCreate = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (isFormCorrect) {
        if (checkJwt()) {
            try {
                createSession(description.value, city.value, district.value, facilityName.value, eventDate.value, playerLimit.value)
                $toast.open({
                    message: 'Session created.',
                    type: "success",
                    position: "bottom-right",
                    duration: 3000,
                    dismissible: true
                })
                resetForm()
                closeCreateModal.value.click()
            }
            catch (err) {
                $toast.open({
                    message: err.response.data.detail,
                    type: "error",
                    position: "bottom-right",
                    duration: 3000,
                    dismissible: true
                })
            }
        }
        else {
            changeAuthenticationStatus(false)
            router.push("/")
        }
    }
}

const resetForm = () => {
    description.value = "";
    city.value = "ISTANBUL";
    district.value = "";
    facilityName.value = "";
    eventDate.value = "";
    playerLimit.value = "";
    v$.value.$reset()
}
</script>