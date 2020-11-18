var footer = document.querySelector('#footer');
var saveIcon = document.querySelectorAll('.fa-heart');
var navIcon = document.querySelectorAll('.nav-icons');
var colorSquareSolo = document.querySelector('.row-saved-colors');
var schemesList = document.querySelector('.schemes-list');

var colorData = {
  view: 'homepage',
  currentColor: {
    name: '',
    rgb: '',
    hex: '',
    hsl: ''
  },
  currentScheme: {
    color: '',
    scheme: '',
    colors: []
  }
};

// ViewSwap function
function viewSwapDataViews(dataView) {
  var divPageList = document.querySelectorAll('div[data-view]');
  colorData.view = dataView;

  for (var i = 0; i < divPageList.length; i++) {
    var divPage = divPageList[i];
    if (dataView !== divPage.getAttribute('data-view')) {
      divPage.classList.add('hidden');
    } else if (dataView === divPage.getAttribute('data-view')) {
      divPage.classList.remove('hidden');
      footer.classList.remove('hidden');
    }

    for (var j = 0; j < navIcon.length; j++) {
      if (dataView === navIcon[j].getAttribute('data-view')) {
        navIcon[j].classList.add('currentIcon');
      } else {
        navIcon[j].classList.remove('currentIcon');
      }
    }
  }

  if (dataView === 'homepage') {
    footer.classList.add('hidden');
  }
}

// eventListener for input color select
var selectColorInput = document.forms[0].colorBox;
selectColorInput.addEventListener('input', function (event) {
  var value = event.target.value;
  colorData.currentColor.hex = value;
  getColorCode(value.slice(1));
});

// eventListener for dropdown list for schemes
var schemeInput = document.querySelector('#scheme-select');
schemeInput.addEventListener('input', function (event) {
  var value = event.target.value;
  var schemeDivColors = document.querySelectorAll('.schemecolor');
  if (event.target.value === undefined) {
    for (var i = 0; i < schemeDivColors.length; i++) {
      schemeDivColors[i].style.background = colorData.currentColor.hex;
    }
  }
  colorData.currentScheme.color = colorData.currentColor.name;
  colorData.currentScheme.scheme = event.target.value;
  getColorScheme(colorData.currentColor.hex.slice(1), value);
});

document.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'I' && !event.target.matches('.schemecolor')) {
    return;
  }

  if (event.target.matches('.schemecolor')) {
    return false;
  }

  if (event.target.className === 'icons fas fa-heart fa-3x' || event.target.id === 'saveScheme') {
    if (colorData.view === 'color-data') {
      data.savedColors.push(colorData.currentColor);
      saveIcon[0].classList.add('heart-it');
      colorSquareSolo.appendChild(colorSavedDOM(colorData.currentColor.hex));
    } else if (colorData.view === 'scheme-page') {
      data.savedSchemes.push(colorData.currentScheme);
      saveIcon[1].classList.add('heart-it');
      schemesList.appendChild(schemeSavedDOM(colorData.currentScheme));
    }
    return;
  }

  if (colorData.currentColor.name === '' && data.savedSchemes.length === [] && data.savedColors.length === []) {
    viewSwapDataViews('picker-page');
  } else {
    viewSwapDataViews(event.target.getAttribute('data-view'));
  }

  if (event.target.className === 'row select input-button') {
    var colorValue = colorData.currentColor.hex.slice(1, 7);
    if (colorData.currentColor.name === '') {
      getColorCode('000000');
    } else {
      getColorCode(colorValue);
    }
    viewSwapDataViews('color-data');
  }

  if (event.target.className === 'random input-button') {
    getRandomColor();
    viewSwapDataViews('color-data');
  }

  if (event.target.id === 'explore' || event.target.matches('.fa-palette')) {
    updateColorScheme();
    getColorScheme(colorData.currentColor.hex.slice(1), 'monochrome');
  }

});

function upDateSelectColor() {
  var colorName = document.querySelector('.color-name');
  colorName.textContent = colorData.currentColor.name;

  var rgbText = document.querySelector('.rgb-text');
  rgbText.textContent = colorData.currentColor.rgb.slice(3);
  var hexText = document.querySelector('.hex-text');
  hexText.textContent = colorData.currentColor.hex;
  var hslText = document.querySelector('.hsl-text');
  hslText.textContent = colorData.currentColor.hsl.slice(3);

  var dataColorBox = document.querySelector('.data-color-box');
  dataColorBox.style.background = colorData.currentColor.hex;

}

function getColorCode(hex) {
  var selectedColor = new XMLHttpRequest();
  selectedColor.open('GET', 'https://www.thecolorapi.com/id?hex=' + hex);
  selectedColor.responseType = 'json';
  selectedColor.addEventListener('load', function () {
    console.log(selectedColor.status);
    console.log(selectedColor.response);
    colorData.currentColor.name = selectedColor.response.name.value;
    colorData.currentColor.rgb = selectedColor.response.rgb.value;
    colorData.currentColor.hex = selectedColor.response.hex.value;
    colorData.currentColor.hsl = selectedColor.response.hsl.value;
    upDateSelectColor();
    updateColorScheme();
  });
  selectedColor.send();
}

function getRandomColor() {
  var randomColor = new XMLHttpRequest();
  randomColor.open('GET', 'http://www.colr.org/json/color/random?time=' + Date.now());
  randomColor.responseType = 'json';
  randomColor.addEventListener('load', function () {
    console.log(randomColor.status);
    console.log(randomColor.response);
    getColorCode(randomColor.response.new_color);
    upDateSelectColor();
  });
  randomColor.send();
}

function getColorScheme(hex, scheme) {
  var colorScheme = new XMLHttpRequest();
  colorScheme.open('GET', 'http://www.thecolorapi.com/scheme?hex=' + hex + '&mode=' + scheme + '&count=5');
  colorScheme.responseType = 'json';
  colorScheme.addEventListener('load', function () {
    console.log(colorScheme.status);
    console.log(colorScheme.response.colors);
    colorData.currentScheme.colors = colorScheme.response.colors;
    updateColorScheme();
  });
  colorScheme.send();
}

function updateColorScheme() {
  var colorName = document.querySelector('.scheme-color-name');
  var schemeDivColors = document.querySelectorAll('.schemecolor');
  var schemeNameTexts = document.querySelectorAll('.scheme-name');

  colorName.textContent = colorData.currentColor.name;

  for (var i = 0; i < schemeDivColors.length; i++) {
    if (colorData.currentScheme.colors[i] === undefined) {
      return;
    }
    schemeDivColors[i].style.background = colorData.currentScheme.colors[i].hex.value;
    schemeNameTexts[i].textContent = colorData.currentScheme.colors[i].name.value;
  }
}

// functions to render a DOM tree for data model
function colorSavedDOM(data) {
  var li = document.createElement('li');

  var div = document.createElement('div');
  div.setAttribute('class', 'color-square solo');
  li.appendChild(div);

  div.style.background = data;

  return li;
}

function schemeSavedDOM(scheme) {
  var schemeItem = document.createElement('li');
  schemeItem.setAttribute('class', 'row scheme-item');

  var ol = document.createElement('ol');
  ol.setAttribute('class', 'row-scheme-colors');
  schemeItem.appendChild(ol);

  var li1 = document.createElement('li');
  li1.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li1);
  var li2 = document.createElement('li');
  li2.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li2);
  var li3 = document.createElement('li');
  li3.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li3);
  var li4 = document.createElement('li');
  li4.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li4);
  var li5 = document.createElement('li');
  li5.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li5);

  var div1 = document.createElement('div');
  div1.setAttribute('class', 'color-square');
  li1.appendChild(div1);
  var div2 = document.createElement('div');
  div2.setAttribute('class', 'color-square');
  li2.appendChild(div2);
  var div3 = document.createElement('div');
  div3.setAttribute('class', 'color-square');
  li3.appendChild(div3);
  var div4 = document.createElement('div');
  div4.setAttribute('class', 'color-square');
  li4.appendChild(div4);
  var div5 = document.createElement('div');
  div5.setAttribute('class', 'color-square');
  li5.appendChild(div5);

  div1.style.background = scheme.colors[0].hex.value;
  div2.style.background = scheme.colors[1].hex.value;
  div3.style.background = scheme.colors[2].hex.value;
  div4.style.background = scheme.colors[3].hex.value;
  div5.style.background = scheme.colors[4].hex.value;

  return schemeItem;
}

// eventListener for DOMContentLoaded; append entry data model to page
document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.savedColors.length; i++) {
    colorSquareSolo.appendChild(colorSavedDOM(data.savedColors[i].hex));
  }

  for (var j = 0; j < data.savedSchemes.length; j++) {
    schemesList.appendChild(schemeSavedDOM(data.savedSchemes[j]));
  }
});
