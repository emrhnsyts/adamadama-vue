<template>
  <div class="col-lg-4 offset-lg-4">
    <select class="mb-4 form-select form-select-lg" :value="city" @change="handleCityChange">
      <option value="DEFAULT">Please choose a city to see the sessions.</option>
      <option value="TRABZON">Trabzon</option>
      <option value="ISTANBUL">Istanbul</option>
      <option value="ANKARA">Ankara</option>
      <option value="IZMIR">Izmir</option>
    </select>
  </div>
  <div className="d-flex justify-content-center mb-4" v-if="totalElements > 10">
    <button class="me-2 btn btn-dark" :class="{ active: selectedPageNumber === n - 1 }" v-for="n in arrayFunc" :key="n"
      @click="handlePageClick(n)">{{ n }}</button>
  </div>
  <div class="row">
    <div v-if="sessions.length === 0 && city !== 'DEFAULT'">not found</div>
    <div v-else>
      <Sessions />
    </div>
  </div>
</template>

<script setup>
import Sessions from "../components/Sessions.vue";
import { watch, ref, computed, onMounted, onUnmounted } from "vue";
import { useSessionStore } from "../stores/sessionStore"
import { storeToRefs } from "pinia"

const sessionStore = useSessionStore()
const { city, totalElements, sessions } = storeToRefs(sessionStore)
const { changeCity, fetchSessionsByCity, setTotalElements, resetSessions } = sessionStore;
const selectedPageNumber = ref(0)

const handleCityChange = (e) => {
  changeCity(e.target.value)
}

onUnmounted(() => {
  changeCity("DEFAULT")
  resetSessions()
  selectedPageNumber.value = 0
  setTotalElements(0)
})

onMounted(() => {
  changeCity("DEFAULT")
  setTotalElements(0)
})

watch(city, (city) => {
  if (city !== "DEFAULT") {
    fetchSessionsByCity(city)
  }
})

const handlePageClick = (p) => {
  if (city.value !== "DEFAULT") {
    selectedPageNumber.value = p - 1
    fetchSessionsByCity(city.value, p - 1)
  }
}

const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

const arrayFunc = computed(() => {
  return arrayRange(1, Number.isInteger(totalElements.value / 10)
    ? Math.trunc(totalElements.value / 10)
    : Math.trunc(totalElements.value / 10) + 1, 1)
})

</script>