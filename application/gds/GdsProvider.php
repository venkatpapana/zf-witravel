<?php

   class GdsProvider {
    protected $wiconfig, $requestType;
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

    public function sendRequest() {
      $client = new nusoap_client($this->getEndPoint(), false);
      $client->setCredentials($this->wiconfig['Travelport']['USERNAME'], $this->wiconfig['Travelport']['PASSWORD']);
      $result = $client->send($this->reqXML, $this->getEndPoint());

      if(!empty($result) && is_array($result)) {
        $this->responseJson = Zend_Json::encode($result);
      }
    }

    public function prepareRequest($requestType) {}
    // public function sendRequest() {}
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
