<?php
  class TravelportProvider extends GdsProvider{
    protected $reqXmlPath = __DIR__ . "/requests";

    private function getReqXmlFileName($requestType) {
      $templateXml = '';
      switch ($requestType) {
        case 'LowFareSearch':
          $templateXml = 'LowFareSearchReq.xml';
          break;
        case 'Hotelsearch':
          $templateXml = 'HotelSearchAvailabilityReq.xml';
          break;
        case 'HotelDetails':
          $templateXml = 'HotelDetailsReq.xml';
          break;
        case 'HotelMedia':
          $templateXml = 'HotelMediaLinksReq.xml';
          break;
        case 'AirCreateReservation':
          $templateXml = 'AirCreateReservationReq.xml';
          break;
        case 'HotelCreateReservation':
          $templateXml = 'HotelCreateReservationReq.xml';
          break;
      }

      if(!empty($templateXml)) {
        $templateXml = $reqXmlPath . '/' . $templateXml;
      }

      return $templateXml;

    }

    public function fillReqXmlTemplate($requestType) {
        $templateXml = $this->getReqXmlFileName($requestType);

        $arrPlaceholders = Zend_Json::decode(file_get_contents(__DIR__ . '/requests/placeholders.json'));
        $placeholders = $arrPlaceholders[$requestType];
        switch ($requestType) {
          case 'LowFareSearch':
            
            break;
        }

    }
    public function prepareRequest() {
      $template = $this->getReqXmlFileName();



    }
    public function sendRequest() {

    }
    public function parseResponse() {


    }


    public function getFlightResults() {
      //prepare req. xml
      $this->fillReqXmlTemplate('LowFareSearch');


      //send req

      //parse resp

      //return result

    }

    public function getHotelResults() {

    }

    public function getFlightDetails() {


    }

    public function getHotelDetails() {

    }

    public function bookFlight() {

    }

    public function bookHotel() {

    }

  }
