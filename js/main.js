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

const productList = document.querySelector('.section_contents');
let paging;

function render(data) {
  paging = data.next_paging;
  data.data.forEach((dataList) => {
    const content = document.createElement('div');
    const productLinks = document.createElement('a');
    const productImg = document.createElement('img');
    const contentColor = document.createElement('div');
    const productColor = document.createElement('div');
    const productInfo = document.createElement('p');
    const productPrice = document.createElement('p');
    content.className = 'content';
    productLinks.className = 'product_links';
    productImg.src = dataList.main_image;
    productImg.alt = 'clothes_img';
    contentColor.className = 'content_color';
    productColor.className = 'product_color';
    productInfo.className = 'product_info';
    productPrice.className = 'product_price';

    productLinks.href = '#';

    const info = document.createTextNode(dataList.title);
    const price = document.createTextNode(`TWD. ${dataList.price}`);

    dataList.colors.forEach((dataColor) => {
      const productColors = document.createElement('div');
      productColors.classList.add('product_color');
      productColors.style.backgroundColor = `#${dataColor.code}`;
      contentColor.appendChild(productColors);
    });

    productInfo.appendChild(info);
    productPrice.appendChild(price);
    productLinks.appendChild(productImg);
    productLinks.appendChild(contentColor);
    productLinks.appendChild(productInfo);
    productLinks.appendChild(productPrice);
    content.appendChild(productLinks);
    productList.appendChild(content);

    productLinks.href = `./product.html?id=${dataList.id}`;
  });
}

const url = 'https://api.appworks-school.tw/api/1.0/products/';

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

const category = searchParams.get('tag');

if (paramsString === '') {
  ajax(`${url}all`, render);
} else if (category === 'women') {
  ajax(`${url}women`, render);
} else if (category === 'men') {
  ajax(`${url}men`, render);
} else if (category === 'accessories') {
  ajax(`${url}accessories`, render);
}

window.addEventListener('scroll', () => {
  const { scrollTop } = document.documentElement;
  const { clientHeight } = document.documentElement;
  const { scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    let lazyLoading;
    if (paramsString === '') {
      lazyLoading = `${url}all?paging=${paging}`;
    } else {
      lazyLoading = `${url}${category}?paging=${paging}`;
    }
    if (paging === undefined) {
      return;
    }
    ajax(lazyLoading, render);
  }
});
const keyword = searchParams.get('keyword');
if (keyword !== null) {
  ajax(`${url}search?keyword=${keyword}`, render);
}
const bannerMain = document.querySelector('#main_banner');
const bannerTime = 5000;
let bannerIndex = 0;
function rotateImage() {
  const banner = document.querySelectorAll('.banner');
  const dot = document.querySelectorAll('.dot');

  for (let i = 0; i < banner.length; i += 1) {
    banner[i].classList.remove('banner--active');
    dot[i].classList.remove('dot--active');
  }
  bannerIndex += 1;
  if (bannerIndex > banner.length) {
    bannerIndex = 1;
  }
  banner[bannerIndex - 1].classList.add('banner--active');
  dot[bannerIndex - 1].classList.add('dot--active');

  const clickButton = () => {
    for (let i = 0; i < dot.length; i += 1) {
      dot[i].addEventListener('click', () => {
        const activeImg = document.querySelector('.banner--active');
        const activeDot = document.querySelector('.dot--active');

        activeImg.classList.remove('banner--active');
        activeDot.classList.remove('dot--active');

        banner[i].classList.add('banner--active');
        dot[i].classList.add('dot--active');
      });
    }
  };
  setTimeout(rotateImage, bannerTime);
  clickButton();
}

function renderBanner(data) {
  data.data.forEach((dataInfo) => {
    const bannerLinks = document.createElement('a');
    const bannerStory = document.createElement('div');

    bannerLinks.style.backgroundImage = `url(${dataInfo.picture})`;
    bannerLinks.href = `https://api.appworks-school.tw/product.html?id=${data.product_id}`;
    const storyText = document.createTextNode(`${dataInfo.story}`);

    bannerLinks.className = 'banner';
    bannerStory.className = 'banner_story';

    bannerStory.appendChild(storyText);
    bannerLinks.appendChild(bannerStory);
    bannerMain.appendChild(bannerLinks);

    bannerLinks.href = `./product.html?id=${dataInfo.product_id}`;
  });
  rotateImage();
}

ajax('https://api.appworks-school.tw/api/1.0/marketing/campaigns', renderBanner);
