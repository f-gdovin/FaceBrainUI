export const serverUrl = process.env.REACT_APP_SERVER_URL;

export const register = (body) => (success, failure) => {
    fetch(`${serverUrl}/register`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: body,
    })
        .then(resp => resp.json())
        .then(data => success(data))
        .catch(err => failure(err))
};

export const signInWithCredentials = (email, password) => (success, failure) => {
    fetch(`${serverUrl}/signin`, {
        method: 'post',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })})
        .then(resp => resp.json())
        .then(data => success(data))
        .catch(err => failure(err))
};

export const signInWithAuthToken = (token = getSessionToken()) => (success, failure) => {
    fetch(`${serverUrl}/signin`, {
        method: 'post',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }})
        .then(resp => resp.json())
        .then(data => success(data))
        .catch(err => failure(err))
};

export const getProfile = (id, token = getSessionToken()) => (success, failure) => {
    fetch(`${serverUrl}/profile/${id}`, {
        method: 'get',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }})
        .then(resp => resp.json())
        .then(data => success(data))
        .catch(err => failure(err))
};

export const updateProfile = (id, data, token = getSessionToken()) => (success, failure) => {
    fetch(`${serverUrl}/profile/${id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ formInput: data })})
        .then(resp => resp.json())
        .then(data => success(data))
        .catch(err => failure(err));
};

export const getFacesForImage = (imageUrl, token = getSessionToken()) => (success, failure) => {
    fetch(`${serverUrl}/imageurl`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            input: imageUrl,
        })
    })
        .then(response => response.json())
        .then(data => success(data))
        .catch(err => failure(err));
};

export const updateUseCount = (id, token = getSessionToken()) => (success, failure) => {
    fetch(`${serverUrl}/image`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            id: id,
        })
    })
        .then(response => response.json())
        .then(data => success(data))
        .catch(err => failure(err));
};

export const setSessionToken = (token) => {
    // or localStorage for multiple tab sign-in
    window.sessionStorage.setItem('token', token);
};

export const getSessionToken = () => {
    // or localStorage for multiple tab sign-in
    return window.sessionStorage.getItem('token');
};