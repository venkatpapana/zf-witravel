<?php

  abstract class GdsProvider {
    protected $request, $response;

    public function setRequest($request) {
      $this->request = $request;
    }

    public function setResponse($response) {
      $this->response = $response;
    }

    public function getResponse() {
      return $this->response;
    }


    public abstract function prepareRequest();
    public abstract function sendRequest();
    public abstract function parseResponse();

    public abstract function getFlightResults();
    public abstract function getHotelResults();

    public abstract function getFlightDetails();
    public abstract function getHotelDetails();

    public abstract function bookFlight();
    public abstract function bookHotel();

    public static function getGdsObj($source = 'TRAVELPORT') {
        if(strtoupper($source) == 'TRAVELPORT') {
          require_once __DIR__ . '/travelport/TravelportProvider.php';
            $gds = new TravelportProvider();

        }
        return $gds;
    }

  }
