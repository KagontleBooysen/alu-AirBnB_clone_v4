$(document).ready(function () {
  const listAmenities = {};

  $('.amenities .popover ul li input').click(function (e) {
    if (listAmenities[e.target.dataset.id] === undefined) {
      listAmenities[e.target.dataset.id] = e.target.dataset.name;
    } else {
      delete listAmenities[e.target.dataset.id];
    }

    let text = '';
    for (const elem in listAmenities) {
      text += listAmenities[elem] + ', ';
    }

    if (text === '') { $('.amenities h4').html('&nbsp;'); } else { $('.amenities h4').text(text.substring(0, text.length - 2)); }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    $('#api_status').addClass('available');
  });
});
