/* exported data */
var data = {
  savedColors: [],
  savedSchemes: []
};

var userColorData = localStorage.getItem('ajax-project');

if (userColorData !== null) {
  data = JSON.parse(userColorData);
}

window.addEventListener('beforeunload', function (event) {
  var dataJson = JSON.stringify(data, null, 1);
  localStorage.setItem('ajax-project', dataJson);
});
