<?php

   class GdsProvider {
    protected $wiconfig;
    protected $request, $response;

    public function __construct() {
      $this->wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');
    }

    public function setRequest($request) {
      $this->request = $request;
    }

    public function setResponse($response) {
      $this->response = $response;
    }

    public function getRequest() {
      return $this->request;
    }

    public function getResponse() {
      return $this->response;
    }


    public function prepareRequest($requestType) {}
    public function sendRequest() {}
    public function parseResponse() {}

    public function getFlightResults() {}
    public function getHotelResults() {}

    public function getFlightDetails() {}
    public function getHotelDetails() {}

    public function bookFlight() {}
    public function bookHotel() {}

    public static function getGdsObj($source = 'TRAVELPORT') {
        if(strtoupper($source) == 'TRAVELPORT') {
          require_once __DIR__ . '/travelport/TravelportProvider.php';
            $gds = new TravelportProvider();

        }
        return $gds;
    }

  }
