$(document).ready(function () {
  const listAmenities = {};
  const listStates = {};
  const listCities = {};
  const urlApi = 'http://0.0.0.0:5001/api/v1';

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

  $('.locations .popover ul li h2 input').click(function (e) {
    if (listStates[e.target.dataset.id] === undefined) {
      listStates[e.target.dataset.id] = e.target.dataset.name;
    } else {
      delete listStates[e.target.dataset.id];
    }

    printSC();
  });

  $('.locations .popover ul li ul li input').click(function (e) {
    if (listCities[e.target.dataset.id] === undefined) {
      listCities[e.target.dataset.id] = e.target.dataset.name;
    } else {
      delete listCities[e.target.dataset.id];
    }

    printSC();
  });

  function printSC () {
    let text = '';
    for (const elem in listStates) {
      text += listStates[elem] + ', ';
    }

    let text2 = '';
    for (const elem2 in listCities) {
      text2 += listCities[elem2] + ', ';
    }

    text = text.substring(0, text.length - 2);
    text2 = text2.substring(0, text2.length - 2);

    if (text2 !== '') {
      if (text !== '') { text += ', '; }
      text += text2;
    }

    $('.locations h4').html(text);
  }

  $.get(urlApi + '/status/', function (data) {
    $('#api_status').addClass('available');
  });

  $('.filters button').click(function (e) {
    load(true);
  });

  load(false);
  async function load (isFiltersAplicated) {
    let dataSend = '{}';

    if (isFiltersAplicated) {
      const amenitiesList = [];
      const statesList = [];
      const citiesList = [];

      for (const i in listAmenities) {
        amenitiesList.push(i);
      }

      for (const i in listStates) {
        statesList.push(i);
      }

      for (const i in listCities) {
        citiesList.push(i);
      }

      dataSend = JSON.stringify({
        states: statesList,
        cities: citiesList,
        amenities: amenitiesList
      });
    }

    const data = await ajaxConn(urlApi + '/places_search/', 'POST', dataSend);

    let html = '';

    for (const i in data) {
      const user = await ajaxConn(urlApi + '/users/' + data[i].user_id, 'GET');

      let notS = '';
      let notS2 = '';
      let notS3 = '';

      if (data[i].max_guest !== 1) { notS = 's'; }

      if (data[i].number_rooms !== 1) { notS2 = 's'; }

      if (data[i].number_bathrooms !== 1) { notS3 = 's'; }

      const prefab = `
        <article>
        <div class="title_box">
        <h2>` + data[i].name + `</h2>
        <div class="price_by_night">$` + data[i].price_by_night + `</div>
        </div>
        <div class="information">
        <div class="max_guest">` + data[i].max_guest + ' Guest' + notS + `</div>
        <div class="number_rooms">` + data[i].number_rooms + ' Bedroom' + notS2 + `</div>
        <div class="number_bathrooms">` + data[i].number_bathrooms + ' Bathroom' + notS3 + `</div>
        </div>
        <div class="user">
        <b>Owner:</b> ` + user.first_name + ' ' + user.last_name + `
        </div>
        <div class="description">
        ` + data[i].description + `
        </div>
        </article>
      `;
      html += prefab;
    }

    $('.places').html(html);
  }

  function ajaxConn (url, type, data = '') {
    return ($.ajax({
      url: url,
      type: type,
      data: data,
      contentType: 'application/json',
      dataType: 'json'
    }));
  }
});
