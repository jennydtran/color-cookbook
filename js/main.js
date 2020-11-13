var footer = document.querySelector('#footer');
var colorPickerForm = document.querySelector('.form-color-picker');
var saveIcon = document.querySelector('.fa-heart');
var navIcon = document.querySelectorAll('.nav-icons');
var divDropperIcon = document.querySelector('#dropper-icon-container');
var divSchemeIcon = document.querySelector('#scheme-icon-container');

colorPickerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var colorValue = document.forms[0].colorBox.value;
  colorValue = colorValue.slice(1, 7);

  colorPickerForm.reset();
  getColorCode(colorValue);
});

function viewSwapDataViews(dataView) {
  var divPageList = document.querySelectorAll('div[data-view]');

  for (var i = 0; i < divPageList.length; i++) {
    var divPage = divPageList[i];
    if (dataView !== divPage.getAttribute('data-view')) {
      divPage.classList.add('hidden');
    } else if (dataView === divPage.getAttribute('data-view')) {
      divPage.classList.remove('hidden');
      footer.classList.remove('hidden');
    }

    for (var j = 0; j < navIcon.length; j++) {
      var icons = navIcon[i];
      if (dataView === icons.getAttribute('data-view')) {
        icons.classList.add('current');
      } else {
        icons.classList.remove('current');
      }
    }
  }

  if (dataView === 'homepage') {
    footer.classList.add('hidden');
  }

  data.view = dataView;
}

document.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'I') {
    return;
  }

  if (event.target.className === 'icons fas fa-heart fa-3x') {
    data.colors.push(data.color);
    saveIcon.classList.add('heart-it');
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

  divDropperIcon.style.background = data.color.hex;
  divSchemeIcon.style.background = data.color.hex;
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
