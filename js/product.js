function ajax(src, callback) {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        callback(data);
      }
    }
  };
  request.open('GET', src);
  request.send();
}

function render(data) {
  const productData = data.data;
  const mainImg = document.querySelector('.main_img');
  mainImg.src = `${productData.main_image}`;
  const productTitle = document.querySelector('.product_title');
  productTitle.textContent = `${productData.title}`;
  const productId = document.querySelector('.product_id');
  productId.textContent = `${productData.id}`;
  const productPrice = document.querySelector('.product_price');
  productPrice.textContent = `TWD.${productData.price}`;
  const color = document.querySelector('.color');
  productData.colors.forEach((dataColor) => {
    const productColor = document.createElement('div');
    productColor.classList.add('product_color');
    productColor.style.backgroundColor = `#${dataColor.code}`;
    color.appendChild(productColor);
  });
  const size = document.querySelector('.size');
  productData.sizes.forEach((dataSize) => {
    const productSize = document.createElement('div');
    productSize.classList.add('product_size');
    productSize.textContent = dataSize;
    size.appendChild(productSize);
  });
  const productNote = document.querySelector('.product_note');
  productNote.textContent = `${productData.note}`;
  const productTexture = document.querySelector('.product_texture');
  productTexture.textContent = `${productData.texture}\r\n清洗：${productData.description}`;
  const productWash = document.querySelector('.product_wash');
  productWash.textContent = `${productData.wash}\r\n產地：${productData.place}`;
  const productStory = document.querySelector('.product_story');
  productStory.textContent = `${productData.story}`;
  const productMoreImg = document.querySelector('.more_img');
  productData.images.forEach((dataImg) => {
    const productImage = document.createElement('img');
    productImage.className = 'product_img';
    productImage.src = dataImg;
    productImage.alt = 'clothes';
    productMoreImg.appendChild(productImage);
  });

  const productVariantData = productData.variants;
  const productColors = document.querySelectorAll('.product_color');
  const productSizes = document.querySelectorAll('.product_size');
  const productAmount = document.querySelector('.amount');
  const productQuantityId = document.querySelector('#quantity');
  const colorArray = [...productColors];
  const sizeArray = [...productSizes];
  let numberOfProduct = Number(productQuantityId.textContent);
  colorArray[0].classList.add('product_color_selected');
  sizeArray[0].classList.add('product_size_selected');

  function toHex(int) {
    const hex = int.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
  function RGBToHex(colors) {
    const arr = [];
    colors.replace(/[\d+.]+/g, (v) => {
      arr.push(parseFloat(v));
    });
    return `${arr.slice(0, 3).map(toHex).join('').toUpperCase()}`;
  }

  for (let i = 0; i < colorArray.length; i += 1) {
    if (colorArray[i].classList.contains('product_color_selected')) {
      productVariantData.forEach((variant) => {
        if (RGBToHex(colorArray[i].style.backgroundColor)
        === variant.color_code && variant.stock === 0) {
          sizeArray.forEach((sizeData) => {
            if (variant.size === sizeData.textContent) {
              sizeData.classList.add('product_size_disabled');
              sizeArray.forEach((sizeSelect) => {
                sizeSelect.classList.remove('product_size_selected');
              });
              const canSelect = sizeArray.filter((sizeNew) => !sizeNew.classList.contains('product_size_disabled'));
              canSelect[0].classList.add('product_size_selected');
            }
          });
        } else if (RGBToHex(colorArray[i].style.backgroundColor)
        === variant.color_code && variant.stock !== 0) {
          sizeArray.forEach((sizeNew) => {
            if (variant.size === sizeNew.textContent) {
              sizeNew.classList.remove('product_size_disabled');
            }
          });
        }
      });
    }
  }
  const colorSizeSelected = function () {
    colorArray.forEach((colorProduct) => {
      colorProduct.addEventListener('click', () => {
        if (colorProduct.classList.contains('product_color_selected')) {
          productQuantityId.textContent = numberOfProduct;
        } else {
          colorArray.forEach((colorNew) => {
            colorNew.classList.remove('product_color_selected');
          });
          colorProduct.classList.add('product_color_selected');
          numberOfProduct = 1;
          productQuantityId.textContent = numberOfProduct;
        }
        colorProduct.classList.contains('product_color_selected');
        if (colorProduct.classList.contains('product_color_selected')) {
          productVariantData.forEach((variant) => {
            if (
              RGBToHex(colorProduct.style.backgroundColor)
              === variant.color_code && variant.stock === 0) {
              sizeArray.forEach((sizeInfo) => {
                if (variant.size === sizeInfo.textContent) {
                  sizeInfo.classList.add('product_size_disabled');
                  const canSelect = sizeArray.filter((sizeNew) => !sizeNew.classList.contains('product_size_disabled'));
                  if (sizeInfo.classList.contains('product_size_selected')) {
                    sizeInfo.classList.remove('product_size_selected');
                    canSelect[0].classList.add('product_size_selected');
                  }
                }
              });
            } else if (RGBToHex(colorProduct.style.backgroundColor)
            === variant.color_code && variant.stock !== 0) {
              sizeArray.forEach((sizeContent) => {
                if (variant.size === sizeContent.textContent) {
                  sizeContent.classList.remove('product_size_disabled');
                }
              });
            }
          });
        }
      });
    });
  };
  const chooseSize = function () {
    sizeArray.forEach((sizeData) => {
      sizeData.addEventListener('click', () => {
        if (!sizeData.classList.contains('product_size_disabled')) {
          if (sizeData.classList.contains('product_size_selected')) {
            productQuantityId.textContent = numberOfProduct;
          } else {
            sizeArray.forEach((sizeNew) => {
              sizeNew.classList.remove('product_size_selected');
            });
            sizeData.classList.add('product_size_selected');
            numberOfProduct = 1;
            productQuantityId.textContent = numberOfProduct;
          }
        }
      });
    });
  };
  const colorSelected = document.getElementsByClassName('product_color_selected');
  const sizesSelected = document.getElementsByClassName('product_size_selected');

  function sizeSelected() {
    productAmount.addEventListener('click', (event) => {
      if (event.target.matches('.add')) {
        productVariantData.forEach((variant) => {
          if (RGBToHex(colorSelected[0].style.backgroundColor)
          === variant.color_code && (sizesSelected[0].textContent === variant.size)) {
            if (numberOfProduct < variant.stock) {
              numberOfProduct += 1;
            }
          }
        });
      } else if (event.target.matches('.minus')) {
        numberOfProduct -= 1;
        if (numberOfProduct < 1) {
          numberOfProduct = 1;
        }
      }
      productQuantityId.textContent = numberOfProduct;
    });
  }

  const addToCartButton = document.getElementById('add_to_cart');
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  const counts = document.querySelectorAll('.count');
  const cartId = productData.id;
  const cartImage = productData.main_image;
  const cartTitle = productData.title;
  const cartPrice = productData.price;
  const cartColors = productData.colors;

  function addItems() {
    if (!addToCartButton.classList.contains('disable')) {
      const cartColor = RGBToHex(colorSelected[0].style.backgroundColor);
      const colorSelectedName = cartColors.filter((colorName) => {
        if (cartColor === colorName.code) {
          return colorName.name;
        }
        return false;
      });
      const cartColorName = colorSelectedName[0].name;
      const stockSelect = productVariantData.filter((variant) => {
        if (
          RGBToHex(colorSelected[0].style.backgroundColor)
              === variant.color_code
              && sizesSelected[0].textContent
              === variant.size
        ) {
          return variant.stock;
        }
        return false;
      });
      const itemStock = stockSelect[0].stock;
      const addedProduct = {
        colorName: cartColorName,
        colorCode: RGBToHex(colorSelected[0].style.backgroundColor),
        id: cartId,
        image: cartImage,
        title: cartTitle,
        price: cartPrice,
        size: sizesSelected[0].textContent,
        qty: numberOfProduct,
        stock: itemStock,
      };
      const oneItem = cartItems.filter((item) => item.id === addedProduct.id
                    && item.colorCode === addedProduct.colorCode
                    && item.size === addedProduct.size);
      if (oneItem.length === 0) {
        cartItems.push(addedProduct);
        window.alert('已加入購物車囉 ٩(✿∂‿∂✿)۶');
        if (numberOfProduct > 0) {
          productQuantityId.textContent = numberOfProduct;
        }
      }
      if (oneItem.length !== 0) {
        window.alert('沒問題！已更新該商品最新數量 ٩(๑❛ᴗ❛๑)۶');
        cartItems.forEach((event) => {
          const target = event;
          if (
            target.id === addedProduct.id
            && target.colorCode === addedProduct.colorCode
            && target.size === addedProduct.size
          ) {
            target.qty = Number(addedProduct.qty);
          }
        });
        if (numberOfProduct > 0) {
          productQuantityId.textContent = numberOfProduct;
        }
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
      for (let i = 0; i < counts.length; i += 1) {
        counts[i].innerHTML = cartItems.length;
      }
    }
  }
  function addItemsToCart() {
    addToCartButton.addEventListener('click', () => {
      addItems();
    });
  }
  colorSizeSelected();
  chooseSize();
  sizeSelected();
  addItemsToCart();
}

const url = 'https://api.appworks-school.tw/api/1.0/products/details';

const paramsString = window.location.search;

if (paramsString.split('=')[0] === '?id') {
  ajax(`${url}${paramsString}`, render);
}

if (paramsString.split('=')[0] === '?keyword') {
  window.location.href = `index.html${paramsString}`;
}
