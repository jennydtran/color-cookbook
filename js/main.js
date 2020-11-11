var colorPickerForm = document.querySelector('.form-color-picker');

colorPickerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var colorValue = document.forms[0].colorBox.value;
  colorValue = colorValue.slice(1, 7);

  colorCode(colorValue);

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
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.colr.org/json/color/random');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
  });
  xhr.send();
}

function colorCode(hex) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecolorapi.com/id?hex=' + hex);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
  });
  xhr.send();
}
