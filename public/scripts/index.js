axios.defaults.baseURL = document.baseURI;
const signInURLs = [
  `${document.baseURI}auth/signin`,
  `${document.baseURI}auth/signup`,
  `${document.baseURI}auth/refresh`,
  `/auth/signin`,
  `/auth/signup`,
  `/auth/refresh`,
];

// axios setting
axios.interceptors.request.use(
  async function (config) {
    if (config.url === '/auth/refresh') {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        config.headers.authorization = `Bearer ${refreshToken}`;
      }
      console.log('refresh token request');
      return config;
    } else {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
      }
      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  async function (response) {
    if (
      signInURLs.includes(response.config.url) &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
      await saveTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response;
  },
  async function (error) {
    if (error.response.data.message === 'Access token has expired') {
      try {
        await sendGetRequest('/auth/refresh');
        const originalRequest = error.config;
        console.log('originalRequest is ', originalRequest);
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        return Promise.reject(error);
      }
    }
    if (error.response.data.message === 'Refresh token has expired') {
      await deleteTokens();
      if (
        window.location.href !== document.baseURI &&
        window.location.href !== `${document.baseURI}about/`
      ) {
        window.location.href = '/sign';
      }
    }
    return Promise.reject(error);
  },
);

// IndexedDB setting / functions
async function initializeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TokenDB', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore('tokens');
    };
    request.onsuccess = function () {
      resolve();
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getAccessToken() {
  await initializeDB();
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('TokenDB', 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tokens'], 'readonly');
      const objectStore = transaction.objectStore('tokens');
      const getRequest = objectStore.get('accessToken');
      getRequest.onsuccess = function (event) {
        const accessToken = event.target.result;
        resolve(accessToken);
      };
      getRequest.onerror = function (event) {
        reject(event.target.error);
      };
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function getRefreshToken() {
  await initializeDB();
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('TokenDB', 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tokens'], 'readonly');
      const objectStore = transaction.objectStore('tokens');
      const getRequest = objectStore.get('refreshToken');
      getRequest.onsuccess = function (event) {
        const accessToken = event.target.result;
        resolve(accessToken);
      };
      getRequest.onerror = function (event) {
        reject(event.target.error);
      };
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function saveTokens(accessToken, refreshToken) {
  await initializeDB();
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('TokenDB', 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tokens'], 'readwrite');
      const objectStore = transaction.objectStore('tokens');
      objectStore.put(accessToken, 'accessToken');
      objectStore.put(refreshToken, 'refreshToken');
      transaction.oncomplete = function () {
        resolve();
      };
      transaction.onerror = function (event) {
        reject(event.target.error);
      };
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

async function deleteTokens() {
  await initializeDB();
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('TokenDB', 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['tokens'], 'readwrite');
      const objectStore = transaction.objectStore('tokens');
      let deleteATRequest = objectStore.delete('accessToken');
      deleteATRequest.onsuccess = function () {
        resolve();
      };
      deleteATRequest.onerror = function () {
        reject(error);
      };
      let deleteRTRequest = objectStore.delete('refreshToken');
      deleteRTRequest.onsuccess = function () {
        resolve();
      };
      deleteRTRequest.onerror = function () {
        reject(error);
      };
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

// axios functions
// GET request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendGetRequest(url, data = {}) {
  return await new Promise((resolve, reject) => {
    console.log(url);
    console.log(data);

    axios
      .get(url, { params: data })
      .then((response) => {
        console.log('GET: ', response.data);
        return resolve(response.data);
      })
      .catch((error) => {
        console.log('GET ERROR: ', error.response.data.message);
        return reject(error);
      });
  });
}

async function getFile(url) {
  return await new Promise((resolve, reject) => {
    console.log(url);
    axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer',
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

async function setImage(url, elementId, alt = 'Alternative text') {
  const response = await getFile(url);
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  const imageUrl = URL.createObjectURL(blob);
  const imgElement = document.getElementById(elementId);
  imgElement.setAttribute('src', imageUrl);
  imgElement.setAttribute('alt', alt);
}

//POST request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendPostRequest(url, data = {}) {
  console.log('url: ', url);
  console.log('data: ', data);
  return await new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((response) => {
        console.log('POST: ', response.data);
        return resolve(response.data);
      })
      .catch((error) => {
        console.log('POST: ', error.response.data.message);
        return reject(error);
      });
  });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendPostRequestWithForm(url, data = {}) {
  console.log('url: ', url);
  console.log('data: ', data);
  return await new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('POST: ', response.data);
        return resolve(response.data);
      })
      .catch((error) => {
        console.log('POST: ', error.response.data.message);
        return reject(error);
      });
  });
}

//PUT request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendPutRequest(url, data = {}) {
  console.log('url: ', url);
  console.log('data: ', data);
  return await new Promise((resolve, reject) => {
    axios
      .put(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('PUT: ', response.data);
        return resolve(response.data);
      })
      .catch((error) => {
        console.log('PUT: ', error.response.data.message);
        return reject(error);
      });
  });
}

//DELETE request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendDeleteRequest(url, data = {}) {
  console.log('url: ', url);
  console.log('data: ', { data });
  return await new Promise((resolve, reject) => {
    axios
      .delete(url, { data })
      .then((response) => {
        console.log('DELETE: ', response.data);
        return resolve(response.data);
      })
      .catch((error) => {
        console.log('DELETE: ', error.response.data.message);
        return reject(error);
      });
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendFile(url, elementId) {
  return await new Promise((resolve, reject) => {
    const fileInput = document.getElementById(elementId);
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('profile-picture', file);
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: function (progressEvent) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          document.getElementById('progress').innerText =
            `Progress: ${progress}%`;
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Navbar settings
function hideElements(className) {
  const elementsToHide = document.querySelectorAll(`.${className}`);
  elementsToHide.forEach((element) => {
    element.style.display = 'none';
  });
}

function showElements(className, disp = 'block') {
  const elementsToShow = document.querySelectorAll(`.${className}`);
  elementsToShow.forEach((element) => {
    element.style.display = disp;
  });
}

function userExists(data) {
  if (data) {
    showElements('user-exists');
    showElements('user-exists-widget-link', 'flex');
    hideElements('user-not-exists');
  } else {
    showElements('user-not-exists');
    hideElements('user-exists-widget-link');
    hideElements('user-exists');
  }
}

async function sendVerificationEmail() {
  try {
    showLoading();
    await sendGetRequest('auth/resend-verification-email');
    messagePopup('재전송 완료');
  } catch (error) {
    alertPopup(error.response.data.message);
  } finally {
    hideLoading();
    window.location.href = '/email-verification';
  }
}

async function setNavbar() {
  // check if user is email confirmed or not
  // if not, show a button to send email verification
  const navbarNav = document.getElementById('navbarNav');
  if (navbarNav) {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    if (accessToken && refreshToken) {
      try {
        const payload = await getPayloadAccessToken();
        const user = await sendPostRequest('/user', {
          id: payload.id,
          userFields: ['username', 'tastes'],
        });
        if (user) {
          setImage(
            `/user/get-profile-picture?id=${payload.id}`,
            'user-profile-circle',
            'profile-picture',
          );
          userExists(true);
          const token = await getPayloadAccessToken();
          if (!token.emailConfirmed) {
            const button = document.getElementById('email-confirm-button');
            button.style.display = 'inline';
            button.addEventListener('click', sendVerificationEmail);
          }
          return;
        }
      } catch (error) {
        userExists(false);
      }
    } else {
      userExists(false);
    }
  } else {
    userExists(false);
  }
}

// auth settings
async function checkCookies() {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());

  let accessToken = undefined;
  let refreshToken = undefined;

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=');
    const cookieName = name.trim();
    const cookieValue = decodeURIComponent(value);

    if (cookieName === 'accessToken') {
      accessToken = cookieValue;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    if (cookieName === 'refreshToken') {
      refreshToken = cookieValue;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
  if (accessToken && refreshToken) {
    await saveTokens(accessToken, refreshToken);
    return;
  }
}

//popups
function removeAllEventListeners(element) {
  var newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  return newElement;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorPopup(message) {
  var modal = new bootstrap.Modal(
    document.getElementById('exampleModalCenter'),
  );
  document.getElementsByClassName('modal-title')[0].textContent = '--ERROR--';
  document.getElementsByClassName('modal-body')[0].textContent = message;
  modal.show();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function alertPopup(message) {
  var modal = new bootstrap.Modal(
    document.getElementById('exampleModalCenter'),
  );
  document.getElementsByClassName('modal-title')[0].textContent = '--ALERT--';
  document.getElementsByClassName('modal-body')[0].textContent = message;
  modal.show();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function messagePopup(message, func = () => {}) {
  var modal = new bootstrap.Modal(
    document.getElementById('exampleModalCenter'),
  );
  document.getElementsByClassName('modal-title')[0].textContent = '--Message--';
  document.getElementsByClassName('modal-body')[0].textContent = message;
  document
    .getElementsByClassName('modal-button')[0]
    .addEventListener('click', func);
  modal.show();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function questionPopup(message, choice1, choice2, func1, func2) {
  var modal = new bootstrap.Modal(document.getElementById('choiceModalCenter'));
  document.getElementsByClassName('modal-title')[1].textContent = '--Message--';
  document.getElementsByClassName('modal-body')[1].innerHTML = message;

  var button1 = document.getElementById('choice1');
  var button2 = document.getElementById('choice2');

  // Remove existing event listeners
  button1 = removeAllEventListeners(button1);
  button2 = removeAllEventListeners(button2);

  // Update button text
  button1.innerText = choice1;
  button2.innerText = choice2;

  // Add new event listeners
  button1.addEventListener('click', func1);
  button2.addEventListener('click', func2);

  modal.show();
}

//loading
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showLoading() {
  const loading = document.getElementById('loading-screen');
  loading.style.display = 'block';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hideLoading() {
  const loading = document.getElementById('loading-screen');
  loading.style.display = 'none';
}

// get payloads
function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getPayloadAccessToken() {
  try {
    const token = await getAccessToken();
    const payload = parseJwt(token);
    return payload;
  } catch (error) {
    console.log(error.response.data.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getPayloadRefreshToken() {
  try {
    const token = await getRefreshToken();
    const payload = parseJwt(token);
    return payload;
  } catch (error) {
    console.log(error.response.data.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isAccessTokenExpired() {
  const payload = await getPayloadAccessToken();

  // Get the current time (in seconds)
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if the token is expired
  return payload.exp < currentTime;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isRefreshTokenExpired() {
  const payload = await getPayloadRefreshToken();

  // Get the current time (in seconds)
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if the token is expired
  return payload.exp < currentTime;
}

//auto refreshing
async function checkExpired() {
  const payload = await getPayloadAccessToken();
  const expirationTime = payload.exp * 1000 - 10000;
  if (Date.now() >= expirationTime) {
    console.log('refreshed');
    await sendGetRequest('/auth/refresh');
  }
}
async function autoRefreshing() {
  const token = await getAccessToken();
  if (token) {
    setInterval(checkExpired, 100);
  }
}

//etc
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function redirectUser(url) {
  window.location.href = url;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function defenseXSS() {
  const text = document.querySelector('input[name=todo]');
  const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |]+$/;

  if (!regex.test(text.value)) {
    errorPopup('특수 문자는 입력할 수 없습니다.');
    return false;
  }
  return true;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeLanguage() {
  const currentLanguage = getCookie('language');
  if (!currentLanguage) {
    document.cookie = `language=korean`;
  }
  let elementsToHide = null;
  let elementsToShow = null;
  switch (currentLanguage) {
    case 'korean':
      elementsToHide = document.querySelectorAll('.english');
      elementsToHide.forEach((element) => {
        element.style.display = 'none';
      });
      elementsToShow = document.querySelectorAll('.korean');
      elementsToShow.forEach((element) => {
        element.style.display = 'inline';
      });
      break;
    case 'english':
      elementsToHide = document.querySelectorAll('.korean');
      elementsToHide.forEach((element) => {
        element.style.display = 'none';
      });
      elementsToShow = document.querySelectorAll('.english');
      elementsToShow.forEach((element) => {
        element.style.display = 'inline';
      });
      break;
  }
}

function setDefaultLanguage() {
  const currentLanguage = getCookie('language');
  if (!currentLanguage) {
    document.cookie = `language=korean`;
  }
}

// whole setting
setDefaultLanguage();
changeLanguage();
checkCookies();
setNavbar();
autoRefreshing();
