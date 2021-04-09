const error = document.querySelector('.div-error');
const loading = document.querySelector('.div-loading');

const saveIcon = document.querySelectorAll('.fa-heart');
const navIcon = document.querySelectorAll('.nav-icons');
const paletteIcon = document.querySelector('.nav-icons.fas.fa-palette.fa-3x');

const main = document.querySelector('main');
const footer = document.querySelector('#footer');

const colorSquareSolo = document.querySelector('.row-saved-colors');
const schemesList = document.querySelector('.schemes-list');
const currentColorField = document.querySelector('#current-color-field');
const currentColorText = document.querySelector('#current-color')
const colorSelectOption = document.querySelectorAll('.option-item');

const colorModeInput = document.querySelector('#select-color-value-opts');
const colorModeValueField = document.querySelector('#selected-color-mode');

let colorData = {
  view: window.location.hash.slice(1),
  currentColor: {
    name: '', rgb: '', hex: '', hsl: '', cmyk: ''
  },
  currentScheme: {
    color: '', scheme: '', colors: []
  }
};

let optionItemWidth = colorSelectOption[1].clientWidth;
let colorPickerSize = optionItemWidth * 0.7;
let colorPicker;
let tallest;

document.addEventListener('DOMContentLoaded', function (event) {
  colorData.saved = {
    colors: data.savedColors,
    schemes: data.savedSchemes
  }

  colorPicker = new window.iro.ColorPicker('#picker', {
    color: '#f00',
    borderWidth: 1.5,
    margin: 10,
    layout: [
      {
        component: window.iro.ui.Wheel,
        options: {
          borderColor: '#bbb'
        }
      },
      {
        component: window.iro.ui.Slider,
        options: {
          borderColor: '#ddd'
        }
      }
    ]
  });

  colorPicker.on('input:end', function (color) {
    colorData.currentColor.hex = color.hexString.toUpperCase();
    currentColorField.style.background = color.hexString;
    getColorCode('hex', color.hexString.slice(1));
  });

  if (!colorData.currentColor.name) {
    currentColorField.style.background = '#f00000';
    getColorCode('hex', 'f00000');
    getColorScheme('f00000', 'monochrome');
  }

  for (var i = 0; i < data.savedColors.length; i++) {
    colorSquareSolo.appendChild(colorSavedDOM(colorData.saved.colors[i].hex));
  }

  for (var j = 0; j < data.savedSchemes.length; j++) {
    for (var j = 0; j < data.savedSchemes.length; j++) {
      schemesList.appendChild(schemeSavedDOM(colorData.saved.schemes[j]));
    }
  }

  updateColorModeValues();
  viewSwapDataViews();
});

window.addEventListener('resize', function (event) {
  if (colorSelectOption[1].classList.contains('active')) {
    tallest = document.querySelectorAll('.option-item')[1].clientHeight;
  } else if (colorSelectOption[0].classList.contains('active')) {
    tallest = (document.querySelectorAll('.option-item')[1].clientHeight / 0.75);
    colorSelectOption[0].style.height = tallest + 'px';
  } else if (colorSelectOption[2].classList.contains('active')) {
    tallest = (document.querySelectorAll('.option-item')[1].clientHeight / 0.75);
    colorSelectOption[2].style.height = tallest + 'px';
  }

  optionItemWidth = document.querySelector('.active').clientWidth;
  colorPickerSize = optionItemWidth * 0.65;
  colorPicker.resize(colorPickerSize);

});

window.onhashchange = viewSwapDataViews;
function viewSwapDataViews(dataView) {
  var theHash = window.location.hash;
  if (theHash === '' || theHash === '#') {
    dataView = 'homepage';
  } else {
    dataView = theHash.slice(1);
  }
  colorData.view = dataView;
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

  if (dataView === 'picker-page') {
    optionItemWidth = colorSelectOption[1].clientWidth;
    colorPickerSize = optionItemWidth * 0.7;

    tallest = colorSelectOption[1].clientHeight;
    colorSelectOption[0].style.height = tallest + 'px';
    colorSelectOption[2].style.height = tallest + 'px';

    colorPicker.resize(colorPickerSize);
    colorPicker.forceUpdate(function() {
      colorPicker.color.hexString = colorData.currentColor.hex
    });
    updateColorModeValues();
  }

}

const schemeInput = document.querySelector('#scheme-select');
schemeInput.addEventListener('input', function (event) {
  const schemeDivColors = document.querySelectorAll('.schemecolor');
  console.log('event', event.target.value)
  colorData.currentScheme.scheme = event.target.value;
  getColorScheme(colorData.currentColor.hex.slice(1), event.target.value);
});

function updateColorModeValues (mode) {
  const colorMode = mode;
  let value;
  if (colorMode === 'hex') {
    value = colorData.currentColor.hex;
  } else if (colorMode === 'rgb') {
    value = colorData.currentColor.rgb.slice(3)
  } else if (colorMode === 'hsl') {
    value = colorData.currentColor.hsl.slice(3)
  } else if (colorMode === 'cmyk') {
    value = colorData.currentColor.cmyk.slice(4)
  }
  colorModeValueField.setAttribute('name', colorMode);
  colorModeValueField.setAttribute('value', value);
  colorModeValueField.value = value;
}

colorModeInput.addEventListener('input', function (event) {
  updateColorModeValues(event.target.value);
})

colorModeValueField.addEventListener('input', function (event) {
  let regex1;
  let regex2;
  let value;
  const colorModeSelectBtn = document.querySelector('#color-mode-submit-btn');
  const colorModeSelectLink = document.querySelector('#color-mode-submit-link');

  if (colorModeInput.value === 'hex') {
    regex1 = new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
    regex2 = new RegExp('^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
    if (!event.target.value.match(regex1) && !event.target.value.match(regex2) ) {
      colorModeSelectBtn.setAttribute('disabled', '');
      colorModeSelectLink.removeAttribute('href');
      handleHexError();
    } else {
      colorModeSelectBtn.removeAttribute('disabled');
      colorModeSelectLink.setAttribute('href', '#color-data-page');
      if (event.target.value.match(regex1)) {
        value = event.target.value.slice(1);
        colorModeValueField.setAttribute('value', value);
        console.log('regex1', event.target.value)
      } else if (event.target.value.match(regex2)) {
        value = event.target.value;
        colorModeValueField.setAttribute('value', value);
        console.log('regex2', event.target.value)
      }
      getColorCode('hex', value);
    }
  } else if (colorModeInput.value === 'rgb') {
    regex1 = new RegExp(`^\\(\\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\s*,\\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\s*,\\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\s*\\)$`);
    if (!event.target.value.match(regex1)) {
      colorModeSelectBtn.setAttribute('disabled', '');
      colorModeSelectLink.removeAttribute('href');
      handleRgbError();
    } else if (event.target.value.match(regex1)) {
      colorModeSelectBtn.removeAttribute('disabled');
      colorModeSelectLink.setAttribute('href', '#color-data-page');
      value = event.target.value.replaceAll(/\s/g, '');
      colorModeValueField.setAttribute('value', value);
      getColorCode('rgb', value)
    }
  } else if (colorModeInput.value === 'hsl') {
    regex1 = new RegExp(`^\\(\\s*(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\s*,\\s*([0-9]{1,2}|100)%\\s*,\\s*([0-9]{1,2}|100)%\\s*\\)$`);
    if (!event.target.value.match(regex1)) {
      colorModeSelectBtn.setAttribute('disabled', '');
      colorModeSelectLink.removeAttribute('href');
      handleHslError();
    } else if (event.target.value.match(regex1)) {
      colorModeSelectBtn.removeAttribute('disabled');
      colorModeSelectLink.setAttribute('href', '#color-data-page');
      value = event.target.value.replaceAll(/\s/g, '');
      colorModeValueField.setAttribute('value', value);
      getColorCode('hsl', value)
    }
  } 
})

document.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'I' && event.target.tagName !== 'SPAN') {
    return;
  }

  var newColor = {
    name: colorData.currentColor.name,
    rgb: colorData.currentColor.rgb,
    hex: colorData.currentColor.hex,
    hsl: colorData.currentColor.hsl,
    cmyk: colorData.currentColor.cmyk
  };

  var newScheme = {
    color: colorData.currentScheme.color,
    scheme: colorData.currentScheme.scheme,
    colors: colorData.currentScheme.colors
  };

  if ((event.target.matches('.fa-palette') || event.target === paletteIcon.closest('a') || event.target.id === 'explore') && colorData.currentColor.name === '') {
    viewSwapDataViews('picker-page');
  } else if (event.target.matches('.fa-palette') || event.target.id === 'explore') {
    getColorScheme(colorData.currentColor.hex.slice(1), colorData.currentScheme.scheme);
    updateColorScheme();
    viewSwapDataViews(event.target.getAttribute('data-view'));
  } else if (event.target.id === 'saveColor') {
    saveIcon[0].classList.add('heart-it');
    colorSquareSolo.appendChild(colorSavedDOM(colorData.currentColor.hex));
    data.savedColors.push(newColor);
    return;
  } else if (event.target.id === 'saveScheme') {
    saveIcon[1].classList.add('heart-it');
    schemesList.appendChild(schemeSavedDOM(colorData.currentScheme));
    data.savedSchemes.push(newScheme);
    return;
  } else {
    error.classList.add('hidden');
    main.classList.remove('avoid-clicks');
    viewSwapDataViews(event.target.getAttribute('data-view'));
  }

  if (event.target.className.includes('select')) {
    getColorCode('hex', colorData.currentColor.hex.slice(1, 7));
  }

  if (event.target.className.includes('random')) {
    getRandomColor();
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
  var cmykText = document.querySelector('.cmyk-text');
  cmykText.textContent = colorData.currentColor.cmyk.slice(4);

  var dataColorBox = document.querySelector('.data-color-box');
  dataColorBox.style.background = colorData.currentColor.hex;
  currentColorField.style.background = colorData.currentColor.hex;
  currentColorText.textContent = colorData.currentColor.name;

  if (data.savedColors.length !== 0) {
    if (colorData.currentColor.hex !== data.savedColors[data.savedColors.length - 1].hex) {
      saveIcon[0].classList.remove('heart-it');
    } else {
      saveIcon[0].classList.add('heart-it');
    }
  }
}

function getColorCode(mode, y) {
  let value;
  if (mode === 'hex') {
    value = y;
  } else if (mode === 'rgb') {
    value = 'rgb' + y
  } else if (mode === 'hsl') {
    value = 'hsl' + y
  } else if (mode === 'cmyk') {
    value = 'cmyk' + y
  }

  var selectedColor = new XMLHttpRequest();
  selectedColor.open('GET', `https://www.thecolorapi.com/id?${mode}=` + value);
  selectedColor.responseType = 'json';
  selectedColor.addEventListener('error', handleError);
  selectedColor.addEventListener('loadstart', handleLoading);
  selectedColor.addEventListener('load', function () {
    main.classList.remove('avoid-clicks');
    loading.classList.add('hidden');
    if (selectedColor.response.code === 400) {
      handleError();
    } else {
      colorData.currentColor.name = selectedColor.response.name.value;
      colorData.currentColor.rgb = selectedColor.response.rgb.value;
      colorData.currentColor.hex = selectedColor.response.hex.value;
      colorData.currentColor.hsl = selectedColor.response.hsl.value;
      colorData.currentColor.cmyk = selectedColor.response.cmyk.value;
      upDateSelectColor();
    }
  });
  selectedColor.send();
}

function getRandomColor() {
  var randomColor = new XMLHttpRequest();
  randomColor.open('GET', 'https://api.codetabs.com/v1/proxy?quest=https://www.colr.org/json/color/random?time=' + Date.now());
  randomColor.responseType = 'json';
  randomColor.addEventListener('error', handleError);
  randomColor.addEventListener('loadstart', handleLoading);
  randomColor.addEventListener('load', function () {
    main.classList.remove('avoid-clicks');
    loading.classList.add('hidden');
    getColorCode('hex', randomColor.response.new_color);
    upDateSelectColor();
  });
  randomColor.send();
}

function getColorScheme(hex, scheme) {
  var colorScheme = new XMLHttpRequest();
  colorScheme.open('GET', 'https://www.thecolorapi.com/scheme?hex=' + hex + '&mode=' + scheme + '&count=5');
  colorScheme.responseType = 'json';
  colorScheme.addEventListener('error', handleError);
  colorScheme.addEventListener('loadstart', handleLoading);
  colorScheme.addEventListener('load', function () {
    main.classList.remove('avoid-clicks');
    loading.classList.add('hidden');
    colorData.currentScheme.color = colorScheme.response.seed.name.value;
    colorData.currentScheme.scheme = colorScheme.response.mode;
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

  if (data.savedSchemes.length !== 0) {
    if (colorData.currentScheme.color !== data.savedSchemes[data.savedSchemes.length - 1].color || colorData.currentScheme.scheme !== data.savedSchemes[data.savedSchemes.length - 1].scheme) {
      saveIcon[1].classList.remove('heart-it');
    } else {
      saveIcon[1].classList.add('heart-it');
    }
  }
}

function colorSavedDOM(data) {
  var li = document.createElement('li');

  var div = document.createElement('div');
  div.setAttribute('class', 'color-square solo');
  li.appendChild(div);

  div.style.background = data;

  return li;
}

function schemeSavedDOM(scheme) {
  const schemeItem = document.createElement('li');
  schemeItem.setAttribute('class', 'row scheme-item');

  const ol = document.createElement('ol');
  ol.setAttribute('class', 'row-scheme-colors');
  schemeItem.appendChild(ol);

  const li1 = document.createElement('li');
  li1.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li1);
  const li2 = document.createElement('li');
  li2.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li2);
  const li3 = document.createElement('li');
  li3.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li3);
  const li4 = document.createElement('li');
  li4.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li4);
  const li5 = document.createElement('li');
  li5.setAttribute('class', 'colorbook-scheme-list');
  ol.appendChild(li5);

  const div1 = document.createElement('div');
  div1.setAttribute('class', 'color-square');
  li1.appendChild(div1);
  const div2 = document.createElement('div');
  div2.setAttribute('class', 'color-square');
  li2.appendChild(div2);
  const div3 = document.createElement('div');
  div3.setAttribute('class', 'color-square');
  li3.appendChild(div3);
  const div4 = document.createElement('div');
  div4.setAttribute('class', 'color-square');
  li4.appendChild(div4);
  const div5 = document.createElement('div');
  div5.setAttribute('class', 'color-square');
  li5.appendChild(div5);

  if (schemesList.length !== 0) {
    div1.style.background = scheme.colors[0].rgb.value;
    div2.style.background = scheme.colors[1].rgb.value;
    div3.style.background = scheme.colors[2].rgb.value;
    div4.style.background = scheme.colors[3].rgb.value;
    div5.style.background = scheme.colors[4].rgb.value;
  }
  return schemeItem;
}

// Error Handling
function handleLoading(event) {
  error.classList.add('hidden');
  loading.classList.remove('hidden');
  main.classList.add('avoid-clicks');
}

function handleError() {
  main.classList.remove('avoid-clicks');
  loading.classList.add('hidden');
  error.classList.remove('hidden');
}

function handleHexError () {
  console.log("Invalid color HEX code.")
}

function handleRgbError() {
  console.log("Invalid color RGB code.")
}

function handleHslError() {
  console.log("Invalid color HSL code.")
}

function handleCmykError() {
  console.log("Invalid color CMYK code.")
}

// Toggle left/right between the 3 options of color selecting
var optionsList = document.querySelectorAll('.options-item-container');
var left = document.querySelector('#left');
var right = document.querySelector('#right');
var activeIndex = 1;

function displayOption(index) {
  activeIndex = index;
  optionsList[activeIndex].classList.add('active');
  optionsList[activeIndex].classList.remove('left');
  optionsList[activeIndex].classList.remove('right');

  optionsList[getNextIndex()].classList.add('right');
  optionsList[getNextIndex()].classList.remove('active');
  optionsList[getNextIndex()].classList.remove('left');

  optionsList[getPreviousIndex()].classList.add('left');
  optionsList[getPreviousIndex()].classList.remove('active');
  optionsList[getPreviousIndex()].classList.remove('right');
}

function getNextIndex() {
  if (activeIndex === 2) { return 0; }
  return activeIndex + 1;
}

function getPreviousIndex() {
  if (activeIndex === 0) { return 2; }
  return activeIndex - 1;
}

function clickRight(event) { displayOption(getNextIndex()); }
right.addEventListener('click', clickRight);

function clickLeft(event) { displayOption(getPreviousIndex()); }
left.addEventListener('click', clickLeft);
