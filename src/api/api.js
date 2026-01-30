import axios from 'axios'

const url = 'https://localhost:8443'

const instance = axios.create({
    withCredentials: true, // Important for sending cookies
    baseURL: url
})

// Auth
export const loginCall = async ({ userName, password }, thunkApi) => {
    return genericApiCall(async () => {
        const loginResponse = await instance.post('/auth/login', { userName, password })
        if (loginResponse.status === 200) {
            const authResponse = await instance.get('/auth/authorize')
            return authResponse.data
        } else {
            return thunkApi.rejectWithValue(loginResponse.data.body || 'Authorization error')
        }
    }, thunkApi, 'Login error')
}

export const logoutCall = async (thunkApi) => {
    return genericApiCall(async () => {
        await instance.post('/auth/logout')
    }, thunkApi, 'Logout error')
}

// Profile
export const getLoggedUserDetails = async ({ userName }, thunkApi) => {
    return genericApiCall(async () => {
        const authResponse = await instance.get(`/contacts/byUserName/${userName}`)
        return authResponse.data
    }, thunkApi, 'User details error')
}

export const updateLoggedUserDetails = async ({ updatedUserDetails }, thunkApi) => {
    return genericApiCall(async () => {
        await instance.patch('/contacts', updatedUserDetails)
    }, thunkApi, 'User details error while updating')
}

// Records
export const getRecordsCall = async ({ path }, thunkApi) => {
    return genericApiCall(async () => {
        const response = await instance.get(path)
        return response.data
    }, thunkApi, 'Error')
}

export const createRecordCall = async ({ path, body }, thunkApi) => {
    return genericApiCall(async () => {
        const response = await instance.post(path, body)
        return response.data
    }, thunkApi, 'Error')
}

export const updateRecordCall = async ({ path, body }, thunkApi) => {
    return genericApiCall(async () => {
        const response = await instance.patch(path, body)
        return response.data
    }, thunkApi, 'Error')
}

export const deleteRecordCall = async ({ path }, thunkApi) => {
    return genericApiCall(async () => {
        const response = await instance.delete(path)
        return response.data
    }, thunkApi, 'Error')
}


const genericApiCall = async (apiFunction, thunkApi, errorMessage) => {
    try {
        return await apiFunction()
    } catch (error) {
        let message = error.response?.data?.message || error.message || errorMessage
        return thunkApi.rejectWithValue(message)
    }
}

export default instance