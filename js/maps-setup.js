// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
var my_map; // this will hold the map
var my_map_options; // this will hold the options we'll use to create the map
var my_center = new google.maps.LatLng(57.300314,-48.181197); // center of map
var my_markers = []; // we use this in the main loop below to hold the markers
// this one is strange.  In google maps, there is usually only one
// infowindow object -- its content and position change when you click on a
// marker.  This is counterintuitive, but we need to live with it.
var infowindow = new google.maps.InfoWindow({content: ""});
var legendHTML = "<h1>Legend</h1>";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
var blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var red_markers = [];
var blue_markers = [];




/* a function that will run when the page loads.  It creates the map
 and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
    my_map_options = {
        center:  my_center, // to change this value, change my_center above
        zoom: 4,  // higher is closer-up
        mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
    };

    // this one line creates the actual map
    my_map = new google.maps.Map(document.getElementById("map_canvas"),
                                 my_map_options);
    // this is an *array* that holds all the marker info
    var all_my_markers =
            [{position: new google.maps.LatLng(61.149636,-45.514771),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map to the one
                             // located at the URL which is given by the variable blueURL, see above
              title: "first Marker",
              window_content: "<h1>Brattahlíð</h1><p>Brattahlíð is Eirik the Red's homestead in Greenland, and the starting point for most of the expeditions to Vinland.</p>"
             },
             {position: new google.maps.LatLng(65.421505,-70.965421),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map
              title: "second Marker",
              window_content: "<h1>Helluland</h1><p>Helluland translates to 'Land of Stone Slabs' and the physical descriptions in the saga's make Baffin Island a likely contendor.</p>"
            },
            {position: new google.maps.LatLng(54.311621, -57.762627),
             map: my_map,
             icon: blueURL, // this sets the image that represents the marker in the map
             title: "third Marker",
             window_content: //'<h1>Marker3</h1><img title="Picture of Quote. Src: someone, some year"  src="https://s-media-cache-ak0.pinimg.com/736x/6d/e2/25/6de2251b8b4be709dcc936ae4f0caaaf.jpg"/>' +
             //'<blockquote>quote quote quote quote</blockquote>'
             "<h1>Markland</h1><p>Markland translates to 'Forest Land' and, although it's location has not be proven, based on the physical descriptions it is likely to be somehwere in Labrador.</p>"
           },
           {position: new google.maps.LatLng(51.595693,-55.533414),
            map: my_map,
            icon: blueURL, // this sets the image that represents the marker in the map
            title: "fourth Marker",
            window_content: "<h1>L'anse aux Meadows</h1><p>L'anse aux Meadows is the only confirmed Viking settlement in North America. It's discovery in 1960 re-opened the discussion concerning Vinland, and proves that Vikings did indeed come to North America.</p>" 
          },
          {position: new google.maps.LatLng(47.838809,-59.377550),
           map: my_map,
           icon: blueURL, // this sets the image that represents the marker in the map
           title: "fifth Marker",
           window_content: "<h1>Point Rosee</h1><p>If proven, the discovery of a second Viking settlement in Newfoundland would make the long-term precense of Vikings in North America irrefutable.</p>"
         },
            ];

    for (j = 0; j < all_my_markers.length; j++) {
        var marker =  new google.maps.Marker({
            position: all_my_markers[j].position,
            map: my_map,
            icon: all_my_markers[j].icon,
            title: all_my_markers[j].title,
            window_content: all_my_markers[j].window_content});

        // this next line is ugly, and you should change it to be prettier.
        // be careful not to introduce syntax errors though.
      legendHTML +=
        "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
          marker.window_content + "</div>";
        marker.info = new google.maps.InfoWindow({content: marker.window_content});
        var listener = google.maps.event.addListener(marker, 'click', function() {
            // if you want to allow multiple info windows, uncomment the next line
            // and comment out the two lines that follow it
          //  this.info.open(this.map, this);
            infowindow.setContent (this.window_content);
            infowindow.open(my_map, this);
        });
        my_markers.push({marker:marker, listener:listener});
        if (all_my_markers[j].icon == blueURL ) {
            blue_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == redURL ) {
            red_markers.push({marker:marker, listener:listener});
        }

    }
    document.getElementById("map_legend").innerHTML = legendHTML;

  my_map.data.setStyle(function (feature) {
    var thisColor = feature.getProperty("myColor");
    return {
      fillColor: thisColor,
      strokeColor: thisColor,
      strokeWeight: 5
    };

});
}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers (marker_array) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(null);
    }
}
// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers (marker_array, map) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(map);
    }
}

//global variable to track state of markers

var markersHidden = false;

function toggleMarkers (marker_array, map) {
  for (var j in marker_array) {
    if (markersHidden) {
      marker_array[j].marker.setMap(map);
    } else {
      marker_array[j].marker.setMap(null);
    }
  }
  markersHidden = !markersHidden;
}


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.
function locateMarker (marker) {
    console.log(marker);
    my_map.panTo(marker.marker.position);
    google.maps.event.trigger(marker.marker, 'click');
}
