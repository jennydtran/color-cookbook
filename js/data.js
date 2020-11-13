/* exported data */
var data = {
  view: 'homepage',
  color: {
    name: '',
    rgb: '',
    hex: '',
    hsl: ''
  },
  colors: [],
  schemes: []
};

var userColorData = localStorage.getItem('javascript-local-storage2');

if (userColorData !== null) {
  data = JSON.parse(userColorData);
}

window.addEventListener('beforeunload', function (event) {
  var dataJson = JSON.stringify(data, null, 1);
  localStorage.setItem('javascript-local-storage2', dataJson);
});
