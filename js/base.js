if (localStorage.getItem('cart') === null) {
  localStorage.setItem('cart', JSON.stringify([]));
}
const count = document.getElementsByClassName('count');
const itemList = JSON.parse(localStorage.getItem('cart'));
count[0].textContent = itemList.length;
count[1].textContent = itemList.length;
