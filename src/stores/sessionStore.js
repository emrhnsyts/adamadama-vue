import { defineStore } from "pinia";
import { ref } from "vue";
import { addSession, deleteSession, getSessionsByCity, getUserByUsername, joinSession, leaveSession } from "../services/services"
import { extractUsername } from "../utils/jwtHelper"
import { useRoute } from "vue-router";

export const useSessionStore = defineStore("sessionStore", () => {
    const city = ref("DEFAULT")
    const sessions = ref([])
    const totalElements = ref(0)

    const route = useRoute()

    function changeCity(newCity) {
        city.value = newCity
    }

    async function createSession(description, cityParam, district, facilityName, eventDate, playerLimit) {
        try {
            const editedEventDate = eventDate.replace("T", " ")
            const res = await addSession(
                description === "" ? null : description,
                cityParam,
                district === "" ? null : district,
                facilityName,
                editedEventDate,
                playerLimit
            )
            if (city.value === cityParam) {
                if (sessions.value.length >= 10) {
                    sessions.value.pop()
                }
                sessions.value.unshift(res.data)
                totalElements.value++
            }
            else if (route.params.username && route.params.username === extractUsername()) {
                res.data.owner = null
                res.data.city = city
                sessions.value.unshift(res.data)
            }
        }
        catch (err) {
            throw err
        }
    }

    async function fetchSessionsByCity(city, page) {
        const res = await getSessionsByCity(city, page)
        sessions.value = res.data.content
        totalElements.value = res.data.totalElements
    }
    async function fetchSessionByUsername(username) {
        try {
            const res = await getUserByUsername(username)
            sessions.value = res.data.sessions
            return {
                username: res.data.username,
                email: res.data.email,
                nameAndSurname: res.data.nameAndSurname,
                phoneNumber: res.data.phoneNumber
            }
        }
        catch (error) {
            throw error
        }
    }
    function setTotalElements(elements) {
        totalElements.value = elements
    }

    function resetSessions() {
        sessions.value = []
    }

    function setSessions(sessions) {
        sessions.value = sessions
    }

    async function deleteSessionBySessionId(sessionId) {
        try {
            await deleteSession(sessionId)
            sessions.value = sessions.value.filter((s) => s.id !== sessionId)
            totalElements.value--
        }
        catch (error) {
            throw error
        }
    }

    async function addUserToSession(session) {
        try {
            await joinSession(session.id)
            const index = sessions.value.indexOf(session)
            sessions.value[index].users.push(extractUsername())
        }
        catch (error) {
            throw error
        }
    }
    async function leaveSessionBySessionId(session) {
        try {
            await leaveSession(session.id)
            const index = sessions.value.indexOf(session)
            const userIndex = sessions.value[index].users.indexOf(extractUsername());
            sessions.value[index].users.splice(userIndex, 1)
        }
        catch (error) {
            throw error
        }
    }

    return {
        city, changeCity, sessions, totalElements, createSession, setSessions,
        fetchSessionByUsername,
        deleteSessionBySessionId,
        fetchSessionsByCity,
        addUserToSession, resetSessions, setTotalElements, leaveSessionBySessionId
    }
})