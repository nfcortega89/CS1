$(function() {
    $('.flight-getter').submit(function(e) {
        e.preventDefault();
        var departure = $(this).find("input[name='from']").val();
        var arrival = $(this).find("input[name='to']").val();
        var date = $(this).find("input[name='date']").val();
        getResults(departure, arrival, date);
        console.log(getResults);
    })

    $('.clear').on('click', function(e) {
        e.preventDefault();
        $('.results').empty();
        $('.search-results').empty();
    })
    $("#NYC").on('click', function(e) {
        e.preventDefault();
        $("input[name='to']").val("JFK");
    })

    $("#SFO").on('click', function(e) {
        e.preventDefault();
        $("input[name='to']").val("SFO");
    })
    $("#MIA").on('click', function(e) {
        e.preventDefault();
        $("input[name='to']").val("MIA");
    })
    $("#HOU").on('click', function(e) {
        e.preventDefault();
        $("input[name='to']").val("HOU");
    })
})

var getResults = function(dept, arr, date) {
    var url = "http://terminal2.expedia.com/x/mflights/search";
    var params = {
        apikey: 'Uyg714nBLezX9YjKGkmNGDuI5kJi9xUB',
        departureAirport: dept,
        arrivalAirport: arr,
        departureDate: date
    }
    $.ajax({
        url: url,
        data: params,
        dataType: 'json',
        type: 'GET',
    }).done(function(data) {
        console.log(data);
        for (var i = 0; i < data.legs.length; i++) {
            var offer = data.offers[i];
            var segments = data.legs[i].segments;
            var flights = new Flight(segments, offer,[]);
            flights.showResults();
            $('.results').append(flights);
            $('.results').append('<hr>');
        }
    }).fail(function() {
        alert('error');
    })
}

// Object Contstructor that have three paramaters. "segment", "offer", "flights"
function Flight(segment, offer, flights) {
    this.segment.airlineName = airline;
    this.segment.airlineCode = airCode;
    this.segment.flightNumber = flightNumber;
    this.segment.departureAirportCode = deptPort;
    this.segment.arrivalAirportCode = undefined;
    this.segment.arrivalTimeRaw = arrivalTime;
    this.segment.departureTimeRaw = departureTime;
    this.offer.totalFare;
    
    for (var i = 0; i < segment.length; i++) {
        if (segment.length > 1) {
            this.segment[i].arrivalAiportCode = arrPort;
            this.segment[i].arrivalTimeRaw = arrivalTime;

        } else {
            this.segment[0].arrivalAirportCode = arrPort;
            this.segment[0].arrivalTimeRaw = arrivalTime;
        }
    }
};
// setting a prototype for every object created through "Flight"
// to display time in 12Hr format
Flight.prototype.getTime = function(segment) {
    var currDate = new Date(segment);
    var hours = currDate.getMonth();
    var min = curDate.getMinutes();
    var amPm = "AM";
    var copyH = hours;
    if (copyH >= 12) {
        hours = copyH - 12;
        amPm = "PM";
    }
    if (copyh == 0) {
        h = 12;
    }

    min = min < 10 ? "0" + min : min
    return hours + ":" + min + " " + amPm;
};
// create a prototype to append the flight information onto the webpage
Flight.prototype.showResults = function(segments, offer) {
    var results = $('.templates .search').clone();
    var arrTime = getTime(this.segment.arrivalTimeRaw);
    var deptTime = getTime(this.segment.departureTimeRaw);
    var airline = results.find('.airline-name').text(this.segment.airlineName);
    var flightNumber = results.find('.flight-number').text(this.segment.airlineCode + " " + this.segment.flightNumber);
    var deptPort = results.find('.deptPort').text(this.segment.departureAirportCode);
    var arrPort = results.find('.arrPort').text(this.segment.arrivalAirportCode);
    var arrivalTime = results.find('.arrival-time').text(arrTime);
    var departureTime = results.find('.departure-time').text(deptTime);
    var price = results.find('.price').text(this.offer.totalFare);
    return results;
};
