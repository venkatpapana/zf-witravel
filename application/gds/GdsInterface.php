<?php

   class GdsInterface {
    protected $wiconfig, $requestType;
    protected $request, $response;

    public function __construct($wiconfig = array()) {
        $this->wiconfig = $wiconfig;      
    }

    public function setRequest($request) {
      $this->request = $request; //Model Object, includes all request parameters
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
        array_walk_recursive($result, function (&$elem) {
            if (is_string($elem)) {
                //$elem = iconv('ISO-8895', 'UTF-8', $elem);
                $elem = utf8_encode($elem);
            }
        });        
        $this->responseJson = Zend_Json::encode($result);
      }
    }

    public function prepareRequest() {}
    // public function sendRequest() {}
    public function parseResponse() {}

    public function getFlightResults() {}
    public function getHotelResults() {}

    public function getFlightDetails() {}
    public function getHotelDetails() {}

    public function bookFlight() {}
    public function bookHotel() {}



  }
