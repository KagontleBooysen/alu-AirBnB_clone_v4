$( document ).ready(function() {
	let list_amenities = {};
	let url_api = 'http://69ee24bd1d2d.9702fef3.hbtn-cod.io:5001/api/v1';

	$('.amenities .popover ul li input').click(function(e) {
		if (list_amenities[e.target.dataset.id] === undefined)
		{
			list_amenities[e.target.dataset.id] = e.target.dataset.name;
		}
		else
		{
			delete list_amenities[e.target.dataset.id];
		}

		let text = "";
		for (let elem in list_amenities) {
			text += list_amenities[elem] + ", ";
		}
		
		if (text === "")
			$('.amenities h4').html("&nbsp;");
		else
			$('.amenities h4').text(text.substring(0, text.length-2));
	});

	$.get(url_api+"/status/", function (data) {
		$("#api_status").addClass("available");
	});

	load();
	async function load()
	{
		let data = await ajaxConn(url_api+"/places_search/", "POST", "{}");

		let html = "";

		for (let i in data)
		{
			let user = await ajaxConn(url_api+"/users/"+data[i].user_id, "GET");

			let notS = '';
			let notS2 = '';
			let notS3 = '';

			if (data[i].max_guest != 1)
				notS = 's';

			if (data[i].number_rooms != 1)
				notS2 = 's';

			if (data[i].number_bathrooms != 1)
				notS3 = 's';

			let prefab = `
						<article>
							<div class="title_box">
								<h2>`+data[i].name+`</h2>
							<div class="price_by_night">$`+data[i].price_by_night+`</div>
						</div>
						<div class="information">
							<div class="max_guest">`+data[i].max_guest+` Guest`+notS+`</div>
							<div class="number_rooms">`+data[i].number_rooms+` Bedroom`+notS2+`</div>
							<div class="number_bathrooms">`+data[i].number_bathrooms+` Bathroom`+notS3+`</div>
						</div>
						<div class="user">
							<b>Owner:</b> `+user.first_name+` `+user.last_name+`
						</div>
						<div class="description">
							`+data[i].description+`
						</div>
					</article>
			`;
			html += prefab;
		}

		$('.places').html(html);
	}


	function ajaxConn(url, type, data = "")
	{
		return ($.ajax({
			url: url,
			type: type,
			data: data,
			contentType:"application/json",
			dataType:"json"
		}));
	}
});

