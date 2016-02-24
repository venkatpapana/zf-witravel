<?php
  require_once __DIR__ . '/../GdsProvider.php';

  class TravelportProvider extends GdsProvider {

    protected $reqXmlPath;
    protected $reqXML, $responseJson;

    public function __construct() {
      parent::__construct();
      $this->reqXmlPath = __DIR__ . "/requests";
      $this->reqXML = "";
    }

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
        $templateXml = $this->reqXmlPath . '/' . $templateXml;
      }

      return $templateXml;

    }

    public function fillReqXmlTemplate($requestType) {
        $templateXml = $this->getReqXmlFileName($requestType);
        $strReqXml = file_get_contents($templateXml);
        $placeholders = file_get_contents(__DIR__ . '/requests/placeholders.json');

        $arrPlaceholders = Zend_Json::decode($placeholders);
        $placeholders = $arrPlaceholders[$requestType];
        switch ($requestType) {
          case 'LowFareSearch':
            $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');



            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{FROM_PLACE}", $request->getFromPlace(), $strReqXml);
            $strReqXml = str_replace("{FROM_DATE}", $request->getFromDate(), $strReqXml);


            $SearchOrigins = '';
            $searchDestinations = '';
            $arrToPlaces = $request->getToPlaces();
            foreach($arrToPlaces as $dest) {
          		if($dest != $request->getFromPlace()) {
          			$searchDestinations .= '<air:SearchDestination><com:CityOrAirport Code="'.$dest.'" /></air:SearchDestination>';
          			$SearchOrigins .= '<air:SearchOrigin><com:CityOrAirport Code="'.$dest.'" /></air:SearchOrigin>';
          		}
          	}
            $strReqXml = str_replace("{SEARCH_DESTINATIONS}", $searchDestinations, $strReqXml);

            $searchPassengers = '';
            for($i=1; $i<=$request->getNumPassengers(); $i++) {
            	$searchPassengers .= '<com:SearchPassenger Code="ADT" />';
            }
            $strReqXml = str_replace("{PASSENGERS}", $searchPassengers, $strReqXml);

            $strReqXml = str_replace("{RETURN_SEGMENT}", '', $strReqXml);



            break;
        }

        $this->reqXML = $strReqXml;

    }
    public function prepareRequest($requestType) {
      $template = $this->fillReqXmlTemplate($requestType);
    }
    public function sendRequest() {
      $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

      $client = new nusoap_client($wiconfig['Travelport']['ENDPOINT'], false);
      $client->setCredentials($wiconfig['Travelport']['USERNAME'], $wiconfig['Travelport']['PASSWORD']);
      $result = $client->send($this->reqXML, $wiconfig['Travelport']['ENDPOINT']);

      if(!empty($result) && is_array($result)) {
        $this->responseJson = Zend_Json::encode($result);
      }
    }
    public function parseResponse() {


    }


    public function getFlightResults() {

      //prepare req. xml
      $this->prepareRequest('LowFareSearch');

      //send req
      $this->sendRequest();

      //parse resp
      $this->parseResponse();

      //return result
      return $this->responseJson;
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
