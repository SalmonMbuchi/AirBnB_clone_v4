$(document).ready(function() {
  const url = 'http://' + window.location.hostname;
  $.get(url + ':5001/api/v1/status/', function(data){
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  let amenities = {};
  $("input[type='checkbox']").click( function() {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenities).join(', '));
  });
  
  $('button').click(function(){
    $.ajax({
      type: 'POST',
      url: url + ':5001/api/v1/places_search/',
      dataType: 'json',
      data: JSON.stringify({'amenities': Object.keys(amenities)}),
      success: fetchPlaces
    });
  });

  $.ajax({
    type: 'POST',
    url: url + ':5001/api/v1/places_search/',
    data: {},
    dataType: 'json',
    success: fetchPlaces
  });
});

function fetchPlaces (data) {
  $('section.places').empty();
  $('section.places').append(data.map(place => {
    return `<article>
              <div class="title_box">
                <h2>{{ place.name }}</h2>
                <div class="price_by_night">{{ place.price_by_night }}</div>
              </div>
              <div class="information">
                <div class="max_guest">{{ place.max_guest }} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
                <div class="number_rooms">{{ place.number_rooms }} Bedroom{% if place.number_rooms != 1 %}s{% endif %}</div>
                <div class="number_bathrooms">{{ place.number_bathrooms }} Bathroom{% if place.number_bathrooms != 1 %}s{%
                  endif %}</div>
              </div>
              <div class="user">
                <b>Owner:</b> {{ place.user.first_name }} {{ place.user.last_name }}
              </div>
              <div class="description">
                {{ place.description | safe }}
              </div>
            </article>`;
  }));
}
