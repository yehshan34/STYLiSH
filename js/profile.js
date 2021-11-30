function login() {
  FB.login(
    (response) => {
      if (response.status === 'connected') {
        alert('恭喜你成功登入 ｡^‿^｡');
      } else {
        alert('Oops 登入失敗！請重新登入 (＞﹏＜)');
        window.location.href = './index.html';
      }
    },
    {
      scope: 'public_profile, email',
    },
  );
}

// Log out function
function logout() {
  FB.logout((response) => {
    console.log(response);
  });
  alert('成功登出囉！下次見拉 ٩(●ᴗ●)۶');
  window.location.href = './index.html';
}

// Logout when logout button clicked
document.getElementById('member_logout').addEventListener('click', logout);

// Post access token or ask user to login based on log in status
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    fetch('https://api.appworks-school.tw/api/1.0/user/signin', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'facebook',
        access_token: response.authResponse.accessToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((res) => {
        document.getElementById('member_img').src = res.data.user.picture;
        document.getElementById('member_name').textContent = res.data.user.name;
        document.getElementById('member_email').textContent = res.data.user.email;
      });
  } else if (response.status === 'not_authorized' || response.status === 'unknown') {
    alert('尚未登入Facebook帳號(＞﹏＜)');
    window.location.href = './';
    login();
  }
}

window.fbAsyncInit = function () {
  FB.init({
    appId: '1513998958953744',
    cookie: true,
    xfbml: true,
    version: 'v11.0',
  });

  FB.getLoginStatus((response) => {
    statusChangeCallback(response);
  });
};
(function (d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Send message when member icon clicked
document.getElementsByClassName('member')[0].addEventListener('click', () => {
  alert('已在會員頁面');
});

document.getElementsByClassName('member')[1].addEventListener('click', () => {
  alert('已在會員頁面');
});
