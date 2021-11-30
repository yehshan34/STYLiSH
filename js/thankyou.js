const orderNumber = document.querySelector('#number');
const getOrderNumber = new URLSearchParams(window.location.search).get('number');

orderNumber.appendChild(document.createTextNode(getOrderNumber));
