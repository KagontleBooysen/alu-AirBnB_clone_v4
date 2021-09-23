$( document ).ready(function() {
	let list_amenities = {};

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

	$.get("http://0.0.0.0:5001/api/v1/status/", function (data) {
        	console.log(data);
		$("#api_status").addClass("available");
        });
});
