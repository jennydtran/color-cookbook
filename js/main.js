var body = document.querySelector('body');
if (data.view !== 'homepage') {
  body.setAttribute('style', 'background-color: #FFF;');
} else {
  body.setAttribute('style', 'background-color: #000;');
}

var colorPickerForm = document.querySelector('.form-color-picker');

colorPickerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var colorValue = document.forms[0].colorBox.value;
  colorValue = colorValue.slice(1, 7);

  getColorCode(colorValue);

});

function viewSwapDataViews(dataView) {
  var divPageList = document.querySelectorAll('div[data-view]');
  var i;

  for (i = 0; i < divPageList.length; i++) {
    var divPage = divPageList[i];
    if (dataView !== divPage.getAttribute('data-view')) {
      divPage.classList.add('hidden');
    } else if (dataView === divPage.getAttribute('data-view')) {
      divPage.classList.remove('hidden');
      data.view = dataView;
    }
  }

  if (data.view !== 'homepage') {
    body.setAttribute('style', 'background-color: #FFF;');
  }
}

document.addEventListener('click', function (event) {

  if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON' && !event.target.closest('a')) {
    return;
  }

  viewSwapDataViews(event.target.getAttribute('data-view'));

  if (event.target.className === 'random input-button') {
    getRandomColor();
  }

});

function getRandomColor() {
  var randomColor = new XMLHttpRequest();
  randomColor.open('GET', 'http://www.colr.org/json/color/random');
  randomColor.responseType = 'json';
  randomColor.addEventListener('load', function () {
    console.log(randomColor.status);
    console.log(randomColor.response);
    getColorCode(randomColor.response.new_color);
    upDateSelectColor();
  });
  randomColor.send();
}

function upDateSelectColor() {
  var colorName = document.querySelector('.color-name');
  colorName.textContent = data.color.name;
  
  var rgbText = document.querySelector('.rgb-text');
  rgbText.textContent = data.color.rgb.slice(3);
  var hexText = document.querySelector('.hex-text');
  hexText.textContent = data.color.hex;
  var hslText = document.querySelector('.hsl-text');
  hslText.textContent = data.color.hsl.slice(3);

  var dataColorBox = document.querySelector('.data-color-box');
  dataColorBox.style.background = data.color.hex;
}

function getColorCode(hex) {
  var selectedColor = new XMLHttpRequest();
  selectedColor.open('GET', 'https://www.thecolorapi.com/id?hex=' + hex);
  selectedColor.responseType = 'json';
  selectedColor.addEventListener('load', function () {
    console.log(selectedColor.status);
    console.log(selectedColor.response);
    data.color.name = selectedColor.response.name.value;
    data.color.rgb = selectedColor.response.rgb.value;
    data.color.hex = selectedColor.response.hex.value;
    data.color.hsl = selectedColor.response.hsl.value;
    upDateSelectColor();
  });
  selectedColor.send();
}
