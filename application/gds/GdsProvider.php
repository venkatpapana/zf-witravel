<?php

  abstract class GdsProvider {
    protected $request, $response;

    public funtion setRequest($request) {
      $this->request = $request;
    }

    public funtion setResponse($response) {
      $this->response = $response;
    }

    public funtion getResponse() {
      return $this->response;
    }


    public function prepareRequest();
    public function sendRequest();
    public function parseResponse();

    public function getFlightResults();
    public function getHotelResults();

    public function getFlightDetails();
    public function getHotelDetails();

    public function bookFlight();
    public function bookHotel();

    public static funciton getGdsObj($source = 'TRAVELPORT') {
        if(strtoupper($source) == 'TRAVELPORT') {
          require_once __DIR__ . '/travelport/TravelportProvider.php';
            $gds = new TravelportProvider();

        }
        return $gds;
    }

  }
