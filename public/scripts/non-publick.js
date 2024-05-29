// check if user has tokens
// check

async function check() {
  const AT = await getAccessToken();
  const RT = await getAccessToken();
  if (AT && RT) {
    const decodedAT = await getPayloadAccessToken();
    const decodedRT = await getPayloadRefreshToken();
    if (decodedAT.emailConfirmed && decodedRT.emailConfirmed) {
      // check if user has non expired token (access, send refresh) refresh, redirect to '/sign'
      const isATExpired = await isAccessTokenExpired();
      const isRTExpired = await isRefreshTokenExpired();
      if (isRTExpired) {
        window.location.href = '/sign';
      } else if (isATExpired) {
        try {
          await sendGetRequest('/auth/refresh');
          return;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          window.location.href = '/sign';
          return;
        }
      }
    } else {
      window.location.href = '/email-verification-notification';
    }
  } else {
    window.location.href = '/sign';
  }
}

check();
