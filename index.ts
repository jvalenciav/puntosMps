/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

function initMap(): void {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 10,
      center: { lat: 19.2851, lng: -99.5978 },
    }
  );

  directionsRenderer.setMap(map);

  (document.getElementById('submit') as HTMLElement).addEventListener(
    'click',
    () => {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  );
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  const waypts: google.maps.DirectionsWaypoint[] = [];
  const checkboxArray = document.getElementById(
    'waypoints'
  ) as HTMLSelectElement;

  for (let i = 0; i < checkboxArray.length; i++) {
    if (checkboxArray.options[i].selected) {
      waypts.push({
        location: (checkboxArray[i] as HTMLOptionElement).value,
        stopover: true,
      });
    }
  }

  directionsService
    .route({
      origin: (document.getElementById('start') as HTMLInputElement).value,
      destination: (document.getElementById('end') as HTMLInputElement).value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()), // for the time N milliseconds from now.
        trafficModel: google.maps.TrafficModel.PESSIMISTIC,
      },
    })
    .then((response) => {
      directionsRenderer.setDirections(response);

      const route = response.routes[0];
      const summaryPanel = document.getElementById(
        'directions-panel'
      ) as HTMLElement;

      summaryPanel.innerHTML = '';
      var totalkm = '';

      // For each route, display summary information.
      for (let i = 0; i < route.legs.length; i++) {
        const routeSegment = i + 1;
        const kms = route.legs[i].distance!;
        const total = route.legs[i].duration!;

      summaryPanel.innerHTML +='<b>Ruta del Segmneto ' + routeSegment + '</b></b><br>';
      summaryPanel.innerHTML +='<b style="color:red";> De: </b> <br>'+ route.legs[i].start_address + '<br> <b style="color:red";> Para: </b> <br> ';
      summaryPanel.innerHTML += route.legs[i].end_address + '<br>';        
      summaryPanel.innerHTML +='<b style="color:red";> Total km: <b>' +route.legs[i].distance!.text + '<br>'
      summaryPanel.innerHTML +='<b style="color:red";> Tiempo general: <b>' + route.legs[i].duration!.text + '</b><br></b></b><br></b>';
        //summaryPanel.innerHTML +=route.legs[i].duration_in_traffic!.text + '<br>';
        //'Tiempo con trafico actual :'
      }
    })
    .catch((e) => window.alert('Directions request failed due to ' + status));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
