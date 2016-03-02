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
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
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


      $client = new nusoap_client($this->wiconfig['Travelport']['ENDPOINT'], false);
      $client->setCredentials($this->wiconfig['Travelport']['USERNAME'], $this->wiconfig['Travelport']['PASSWORD']);
      $result = $client->send($this->reqXML, $this->wiconfig['Travelport']['ENDPOINT']);

      if(!empty($result) && is_array($result)) {
        $this->responseJson = Zend_Json::encode($result);
      }
    }
    public function parseResponse() {


    }


    public function getFlightResults() {

      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/LowFareSearchResp.json');
      }

      //prepare req. xml
      $this->prepareRequest('LowFareSearch');

      //send req
      $this->sendRequest();

      //parse resp
      $this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/LowFareSearchResp.json', $this->responseJson);
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
