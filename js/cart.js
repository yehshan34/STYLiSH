const itemsInCart = JSON.parse(localStorage.getItem('cart'));

const items = document.getElementById('items');

const paramsString = window.location.search;

if (paramsString.split('=')[0] === '?keyword') {
  window.location.href = `index.html${paramsString}`;
}

function updateCount() {
  const count = document.getElementsByClassName('count');
  const cartCount = document.querySelector('#title');
  cartCount.textContent = `購物車(${itemsInCart.length})`;
  count[0].textContent = itemsInCart.length;
  count[1].textContent = itemsInCart.length;
}

function emptyCart() {
  const message = document.createElement('div');
  const emptyMessage = document.createElement('div');
  emptyMessage.textContent = '(ఠ్ఠ ˓̭ ఠ్ఠ) 空空如也，快來選個商品吧！(ఠ్ఠ ˓̭ ఠ్ఠ)';
  message.classList.add('item');
  message.appendChild(emptyMessage);
  items.appendChild(message);
}
function calculate() {
  const allTotalPrice = document.querySelectorAll('.total_number');
  let finalPayment = 0;
  if (allTotalPrice.length === 0) {
    document.getElementsByClassName('subtotal_value')[0].textContent = 0;
    document.getElementsByClassName('freight_value')[0].textContent = 0;
    document.getElementsByClassName('total_value')[0].textContent = 0;
  } else {
    for (let i = 0; i < allTotalPrice.length; i += 1) {
      finalPayment += Number(allTotalPrice[i].textContent.split('NT.')[1]);
      document.getElementsByClassName('subtotal_value')[0].textContent = finalPayment;
      document.getElementsByClassName('freight_value')[0].textContent = 60;
      document.getElementsByClassName('total_value')[0].textContent = finalPayment + 60;
    }
  }
  // !!! when refreshing the page , the new data needs to be stored in local storage again !!!
  const newitemsInCart = itemsInCart;
  localStorage.setItem('cart', JSON.stringify(newitemsInCart));
}
function removeItem() {
  items.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart_remove')) {
      const item = document.getElementsByClassName('item');
      const deleteIcon = document.querySelectorAll('.cart_remove');
      const index = Array.from(deleteIcon).indexOf(e.target);
      itemsInCart.splice(index, 1);
      item[index].remove();
      localStorage.setItem('cart', JSON.stringify(itemsInCart));
      document.getElementsByClassName('title')[0].textContent = `購物車(${itemsInCart.length})`;
      alert('已從購物車移除! (ఠ్ఠ ˓̭ ఠ్ఠ)');
      if (itemsInCart.length === 0) {
        emptyCart();
      }
      calculate(itemsInCart);
      updateCount();
    }
  });
}
function itemTotalQuantity() {
  items.addEventListener('change', (event) => {
    if (event.target.classList.contains('select')) {
      const allTotalNumber = document.querySelectorAll('.total_number');
      const selectedCount = document.querySelectorAll('select');
      const index = Array.from(selectedCount).indexOf(event.target);
      allTotalNumber[index].textContent = `NT.${itemsInCart[index].price * event.target.value}`;
      const quantityIndex = selectedCount[index].selectedIndex;
      itemsInCart[index].qty = Number(selectedCount[index].options[quantityIndex].text);
      calculate(itemsInCart);
    }
  });
}

function render(cartItems) {
  if (cartItems.length === 0) {
    emptyCart();
  }
  cartItems.forEach((item) => {
    // parent
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    // image
    const itemImage = document.createElement('img');
    itemImage.className = 'item_image';
    itemImage.src = `${item.image}`;
    itemDiv.appendChild(itemImage);

    // inside item detail:
    const itemDetail = document.createElement('div');
    itemDetail.className = 'item_detail';
    // item name
    const itemName = document.createElement('div');
    itemName.className = 'item_name';
    itemName.textContent = item.title;
    // item id
    const itemId = document.createElement('div');
    itemId.className = 'item_id';
    itemId.textContent = item.id;
    // item color
    const itemColor = document.createElement('div');
    const itemSize = document.createElement('div');
    itemColor.className = 'item_color';
    itemColor.textContent = `顏色｜${item.colorName}`;
    itemSize.className = 'item_color';
    itemSize.textContent = `尺寸｜${item.size}`;
    itemDetail.appendChild(itemName);
    itemDetail.appendChild(itemId);
    itemDetail.appendChild(itemColor);
    itemDetail.appendChild(itemSize);
    itemDiv.appendChild(itemDetail);

    // Inside item quantity:
    const itemQuantity = document.createElement('div');
    itemQuantity.className = 'item_quantity';
    // mobile text Quantity + select
    const mobileTextQuantity = document.createElement('div');
    mobileTextQuantity.textContent = '數量';
    mobileTextQuantity.className = 'mobile_text';
    // option & select
    const selectedCount = document.createElement('select');
    selectedCount.className = 'select';
    // console.log(stock);
    const option = function (stock, qty) {
      for (let i = 0; i < stock; i += 1) {
        const qtyOption = document.createElement('option');
        qtyOption.value = i + 1;
        qtyOption.textContent = i + 1;
        if (i + 1 === qty) {
          qtyOption.selected = 'selected';
        }
        selectedCount.appendChild(qtyOption);
      }
    };
    option(item.stock, item.qty);

    itemQuantity.appendChild(mobileTextQuantity);
    itemQuantity.appendChild(selectedCount);
    itemDiv.appendChild(itemQuantity);

    // item price
    const itemPrice = document.createElement('div');
    itemPrice.className = 'item_price';
    // mobile text Price + single price
    const mobileTextPrice = document.createElement('div');
    mobileTextPrice.className = 'mobile_text';
    mobileTextPrice.textContent = '單價';
    const singlePrice = document.createElement('div');
    singlePrice.textContent = `NT.${item.price}`;
    itemPrice.appendChild(mobileTextPrice);
    itemPrice.appendChild(singlePrice);
    itemDiv.appendChild(itemPrice);

    // item subtotal
    const itemSubtotal = document.createElement('div');
    itemSubtotal.className = 'item_subtotal';
    // mobile text subtotal + subtotal price
    const mobileTextSubtotal = document.createElement('div');
    mobileTextSubtotal.className = 'mobile_text';
    mobileTextSubtotal.textContent = '小計';
    const totalAmount = document.createElement('div');
    totalAmount.className = 'total_number';
    totalAmount.textContent = `NT.${item.price * item.qty}`;
    itemSubtotal.appendChild(mobileTextSubtotal);
    itemSubtotal.appendChild(totalAmount);
    itemDiv.appendChild(itemSubtotal);

    // add item remove Image
    const itemRemove = document.createElement('div');
    itemRemove.className = 'item_remove';
    const removeIcon = document.createElement('img');
    removeIcon.src = './images/cart-remove.png';
    removeIcon.className = 'cart_remove';
    itemRemove.appendChild(removeIcon);
    itemDiv.appendChild(itemRemove);
    items.appendChild(itemDiv);
  });
  itemTotalQuantity();
  calculate();
  updateCount();
  removeItem();
}
render(itemsInCart);
