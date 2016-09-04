$(function() {
    $('.flight-getter').submit(function(e) {
        e.preventDefault();
        var departure = $(this).find("input[name='from']").val();
        var arrival = $(this).find("input[name='to']").val();
        var date = $(this).find("input[name='date']").val();
        getResults(departure, arrival, date);
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
    $("#from").autocomplete({
        source: airports
    });
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
        for (var i = 0; i < data.legs.length; i++) {
            var offer = data.offers[i];
            var segments = data.legs[i].segments;
            var airlinesArr = [];
            var airArr = [];
            var timeArr = [];
            for (var j = 0; j < segments.length; j++) {
                var airlineNames = segments[j].airlineName;
                var arrivalPorts = segments[j].arrivalAirportCode;
                var arrTime = segments[j].arrivalTimeRaw;
                airlinesArr.push(airlineNames)
                timeArr.push(arrTime)
                airArr.push(arrivalPorts)
            }
            var flightNumb = segments[0].airlineCode + " " + segments[0].flightNumber;
            var depAir = segments[0].departureAirportCode;
            var depTime = segments[0].departureTimeRaw;
            var price = offer.totalFare;
            var numTic = offer.numberOfTickets;
            var seats = offer.seatsRemaining;
            var allFlights = new Flight(price, airlinesArr, flightNumb, depAir, depTime, airArr, timeArr, numTic, seats);
            var output = allFlights.print();
            $('.results').append(output);
            $('.results').append("<hr>");
        }
    }).fail(function() {
        alert('error');
    })
}
function Flight(price, airlines, flightNum, deptPort, departureTime, arrivalPort, arrivalTime, tickets, seatsRemaining) {
    this.price = price;
    this.airlines = airlines;
    this.flightNum = flightNum;
    this.deptPort = deptPort;
    this.departureTime = departureTime;
    this.arrivalPort = arrivalPort;
    this.arrivalTime = arrivalTime;
    this.tickets = tickets;
    this.seatsRemaining = seatsRemaining;
    this.print = function() {
        var results = $('.templates .search').clone();
        var flightPrice = results.find('.price').text(this.price);
        var flightAirline = results.find('.airline-name').text(this.airlines[0]);
        var flightNumbers = results.find('.flight-number').text(this.flightNum);
        var aTime = getTime(this.arrivalTime.pop());
        var dTime = getTime(this.departureTime);
        var flightArriveTime = results.find('.arrival-time').text(aTime);
        var flightArrivePort = results.find('.arrPort').text(this.arrivalPort.pop());
        var flightDepartPort = results.find('.deptPort').text(this.deptPort);
        var flightDepartTime = results.find('.departure-time').text(dTime);
        var seatsRemaining = results.find('.seatsRemaning').text("Seats Reamaining: " + this.seatsRemaining);
        return results;
    }
};
var getTime = function(time) {
    var currDate = new Date(time);
    var hours = currDate.getMonth();
    var min = currDate.getMinutes();
    var amPm = "AM";
    var copyH = hours;
    if (copyH >= 12) {
        hours = copyH - 12;
        amPm = "PM";
    }
    if (copyH == 0) {
        h = 12;
    }

    min = min < 10 ? "0" + min : min
    return hours + ":" + min + " " + amPm;
};

jQuery(document).ready(function($) {
    var slidesWrapper = $('.cd-hero-slider');

    //check if a .cd-hero-slider exists in the DOM 
    if (slidesWrapper.length > 0) {
        var primaryNav = $('.cd-primary-nav'),
            sliderNav = $('.cd-slider-nav'),
            navigationMarker = $('.cd-marker'),
            slidesNumber = slidesWrapper.children('li').length,
            visibleSlidePosition = 0,
            autoPlayId,
            autoPlayDelay = 5000;

        //upload videos (if not on mobile devices)
        // uploadVideo(slidesWrapper);

        //autoplay slider
        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

        //on mobile - open/close primary navigation clicking/tapping the menu icon
        primaryNav.on('click', function(event) {
            if ($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
        });

        //change visible slide
        sliderNav.on('click', 'li', function(event) {
            event.preventDefault();
            var selectedItem = $(this);
            if (!selectedItem.hasClass('selected')) {
                // if it's not already selected
                var selectedPosition = selectedItem.index(),
                    activePosition = slidesWrapper.find('li.selected').index();

                if (activePosition < selectedPosition) {
                    nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
                } else {
                    prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, selectedPosition);
                }

                //this is used for the autoplay
                visibleSlidePosition = selectedPosition;

                updateSliderNavigation(sliderNav, selectedPosition);
                updateNavigationMarker(navigationMarker, selectedPosition + 1);
                //reset autoplay
                setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
            }
        });
    }

    function nextSlide(visibleSlide, container, pagination, n) {
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
    }

    function prevSlide(visibleSlide, container, pagination, n) {
        visibleSlide.removeClass('selected from-left from-right').addClass('is-moving').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
            visibleSlide.removeClass('is-moving');
        });

        container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
    }

    function updateSliderNavigation(pagination, n) {
        var navigationDot = pagination.find('.selected');
        navigationDot.removeClass('selected');
        pagination.find('li').eq(n).addClass('selected');
    }

    function setAutoplay(wrapper, length, delay) {
        if (wrapper.hasClass('autoplay')) {
            clearInterval(autoPlayId);
            autoPlayId = window.setInterval(function() { autoplaySlider(length) }, delay);
        }
    }

    function autoplaySlider(length) {
        if (visibleSlidePosition < length - 1) {
            nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, visibleSlidePosition + 1);
            visibleSlidePosition += 1;
        } else {
            prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, 0);
            visibleSlidePosition = 0;
        }
        updateNavigationMarker(navigationMarker, visibleSlidePosition + 1);
        updateSliderNavigation(sliderNav, visibleSlidePosition);
    }


    function updateNavigationMarker(marker, n) {
        marker.removeClassPrefix('item').addClass('item-' + n);
    }

    $.fn.removeClassPrefix = function(prefix) {
        //remove all classes starting with 'prefix'
        this.each(function(i, el) {
            var classes = el.className.split(" ").filter(function(c) {
                return c.lastIndexOf(prefix, 0) !== 0;
            });
            el.className = $.trim(classes.join(" "));
        });
        return this;
    };
});

