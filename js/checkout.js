TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');

let token;
const cartItems = JSON.parse(localStorage.getItem('cart'));
const checkOutDetails = {
  order: {},
};

const fields = {
  number: {
    element: '#card-number',
    placeholder: '**** **** **** ****',
  },
  expirationDate: {
    element: '#card-expiration-date',
    placeholder: 'MM / YY',
  },
  ccv: {
    element: '#card-ccv',
    placeholder: '後三碼',
  },
};

TPDirect.card.setup({
  fields,

  styles: {
    input: {
      color: 'gray',
    },
    ':focus': {
      color: 'black',
    },
    '.valid': {
      color: 'green',
    },
    '.invalid': {
      color: 'red',
    },
  },
});

function checkOrderForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const timeChoice = document.getElementsByClassName('choose_time');

  checkOutDetails.order.recipient = {};

  if (cartItems.length === 0) {
    alert('購物車空空，請先選擇商品 o(^▽^)o');
    window.location = './';
    return false;
  }

  if (name === '') {
    alert('請輸入姓名，讓我們知道您是誰 ʘ‿ʘ');
    return false;
  }
  checkOutDetails.order.recipient.name = name;

  if (email === '') {
    alert('請輸入信箱，我們才能寄信聯絡您喔！(´∀`)');
    return false;
  } if (email !== '' && !/^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/.test(email)) {
    alert('不要害羞，請輸入正確信箱啦 (￣▽￣)~*');
    return false;
  }
  checkOutDetails.order.recipient.email = email;

  if (phoneNumber === '') {
    alert('請輸入電話號碼，到貨才能通知您喔！(•‿•)');
    return false;
  } if (phoneNumber !== '' && !/^\d{10}$/.test(phoneNumber)) {
    alert('不要害羞，請輸入有效的電話號碼啦 (๑˘ ₃˘๑) ');
    return false;
  }
  checkOutDetails.order.recipient.phone = phoneNumber;

  if (address === '') {
    alert('請輸入地址，才能準確送貨給您喔！｡^‿^｡');
    return false;
  }
  checkOutDetails.order.recipient.address = address;

  for (let i = 0; i < timeChoice.length; i += 1) {
    if (timeChoice[i].checked === true) {
      checkOutDetails.order.recipient.time = timeChoice[i].value;
      return true;
    }
  }
  return true;
}
function postCheckOutData() {
  fetch('https://api.appworks-school.tw/api/1.0/order/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(checkOutDetails),
  })
    .then((res) => res.json())
    .then((res) => {
      window.location.href = `./thankyou.html?number=${res.data.number}`;
      localStorage.removeItem('cart');
    })
    .catch((error) => console.error('Error:', error));
}
function statusChangeCheckoutCallback(response) {
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
      .then((res) => {
        token = res.data.access_token;
      })
      .then(() => {
        postCheckOutData();
      })
      .catch((error) => console.error('Error:', error));
  } else {
    alert('請先登入會員帳號(≧▽≦)');
  }
}

function checkOut() {
  const checkInfoComplete = checkOrderForm();
  if (checkInfoComplete) {
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    if (tappayStatus.canGetPrime === false) {
      if (tappayStatus.status.number === 1
        && tappayStatus.status.expiry === 1
        && tappayStatus.status.ccv === 1) {
        alert('請輸入信用卡資料');
      } else if (tappayStatus.status.number !== 0) {
        alert('信用卡號碼有誤');
      } else if (tappayStatus.status.expiry !== 0) {
        alert('有效期限有誤');
      } else if (tappayStatus.status.ccv !== 0) {
        alert('CCV 安全碼有誤');
      }
      return;
    }

    for (let i = 0; i < cartItems.length; i += 1) {
      delete cartItems[i].stock;
    }

    checkOutDetails.order.list = cartItems;
    checkOutDetails.order.shipping = 'delivery';
    checkOutDetails.order.payment = 'credit_card';
    checkOutDetails.order.subtotal = parseInt(document.getElementsByClassName('subtotal_value')[0].textContent, 10);
    checkOutDetails.order.freight = 60;
    checkOutDetails.order.total = parseInt(document.getElementsByClassName('total_value')[0].textContent, 10);
    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        alert(`信用卡資料取得異常：${result.msg}`);
        return;
      }
      checkOutDetails.prime = result.card.prime;
    });
    FB.getLoginStatus((response) => {
      statusChangeCheckoutCallback(response);
    });
  }
}

window.fbAsyncInit = function () {
  FB.init({
    appId: '1513998958953744',
    cookie: true,
    xfbml: true,
    version: 'v11.0',
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

document.getElementById('checkout').addEventListener('click', checkOut);
