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

    private function getReqXmlFileName() {
      $templateXml = '';
      switch ($this->requestType) {
        case 'LowFareSearch':
          $templateXml = 'LowFareSearchReq.xml';
          break;
        case 'HotelSearch':
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

    public function fillReqXmlTemplate() {
        $templateXml = $this->getReqXmlFileName();
        $strReqXml = file_get_contents($templateXml);
        // $placeholders = file_get_contents(__DIR__ . '/requests/placeholders.json');
        // $arrPlaceholders = Zend_Json::decode($placeholders);
        // $placeholders = $arrPlaceholders[$this->requestType];
        switch ($this->requestType) {
          case 'LowFareSearch':
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{FROM_PLACE}", $request->getFromPlace(), $strReqXml);
            $strReqXml = str_replace("{FROM_DATE}", $request->getFromDate(), $strReqXml);


            $SearchOrigins = '';
            $searchDestinations = '';
            $returnSegment = '';

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


            if($request->getIs2Way() == true) {
            	$returnSegment = '<air:SearchAirLeg>'.$SearchOrigins.'<air:SearchDestination><com:CityOrAirport Code="'.$request->getFromPlace().'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'.$request->getToDate().'" /></air:SearchAirLeg>';
            }

            $strReqXml = str_replace("{RETURN_SEGMENT}", $returnSegment, $strReqXml);

            break;


          case 'HotelSearch':
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            // $strReqXml = str_replace("{LOCATION}", $request->getLocation(), $strReqXml);
            // $strReqXml = str_replace("{FROM_DATE}", $request->getFromDate(), $strReqXml);
            // $strReqXml = str_replace("{NUM_ADULTS}", $request->getNumAdults(), $strReqXml);
            // $strReqXml = str_replace("{CHECKIN_DATE}", $request->getCheckinDate(), $strReqXml);
            // $strReqXml = str_replace("{CHECKOUT_DATE}", $request->getCheckoutDate(), $strReqXml);
            // $strReqXml = str_replace("{NUM_ROOMS}", $request->getNumRooms(), $strReqXml);
            $strReqXml = str_replace("{LOCATION}", $request->location, $strReqXml);
            $strReqXml = str_replace("{NUM_ADULTS}", $request->numAdults, $strReqXml);
            $strReqXml = str_replace("{CHECKIN_DATE}", $request->checkinDate, $strReqXml);
            $strReqXml = str_replace("{CHECKOUT_DATE}", $request->checkoutDate, $strReqXml);
            $strReqXml = str_replace("{NUM_ROOMS}", $request->numRooms, $strReqXml);

            break;


          case 'HotelDetails':
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{NUM_ADULTS}", $request->numAdults, $strReqXml);
            $strReqXml = str_replace("{NUM_CHILDREN}", $request->numChildren, $strReqXml);
            $strReqXml = str_replace("{CHECKIN_DATE}", $request->checkinDate, $strReqXml);
            $strReqXml = str_replace("{CHECKOUT_DATE}", $request->checkoutDate, $strReqXml);
            $strReqXml = str_replace("{HOTEL_CODE}", $request->hotelCode, $strReqXml);
            $strReqXml = str_replace("{HOTEL_CHAIN}", $request->hotelChain, $strReqXml);


            break;

          case 'HotelMedia':
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{HOTEL_CODE}", $request->hotelCode, $strReqXml);

            break;

          case 'AirCreateReservation':

            break;

          case 'HotelCreateReservation':
            $request = $this->getRequest();

            $traveller = $request->traveller;
            $cc = $traveller->creditCard;
            $phone = $traveller->phone;
            $shipAddr = $traveller->shippingAddress;
            $addr = $traveller->address;

            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{HOTEL_CODE}", $request->hotelCode, $strReqXml);
            $strReqXml = str_replace("{HOTEL_CHAIN}", $request->hotelChain, $strReqXml);
            $strReqXml = str_replace("{NUM_ADULTS}", $request->numAdults, $strReqXml);
            $strReqXml = str_replace("{CHECKIN_DATE}", $request->checkinDate, $strReqXml);
            $strReqXml = str_replace("{CHECKOUT_DATE}", $request->checkoutDate, $strReqXml);
            $strReqXml = str_replace("{NUM_ROOMS}", $request->numRooms, $strReqXml);

            //traveller
            $strReqXml = str_replace("{TRAVELLER_TYPE}", $traveller->type, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_PREFIX}", $traveller->prefix, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_FIRSTNAME}", $traveller->firstName, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_LASTNAME}", $traveller->lastName, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_EMAIL}", $traveller->email, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_AGE}", $traveller->age, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_DOB}", $traveller->dob, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_GENDER}", $traveller->gender, $strReqXml);
            $strReqXml = str_replace("{TRAVELLER_NATIONALITY}", $traveller->nationality, $strReqXml);

            //phone
            $strReqXml = str_replace("{PHONE_LOCATION}", $phone->location, $strReqXml);
            $strReqXml = str_replace("{PHONE_COUNTRYCODE}", $phone->countryCode, $strReqXml);
            $strReqXml = str_replace("{PHONE_AREACODE}", $phone->areaCode, $strReqXml);
            $strReqXml = str_replace("{PHONE_NUMBER}", $phone->number, $strReqXml);

            //credit card
            $strReqXml = str_replace("{CREDITCARD_TYPE}", $cc->type, $strReqXml);
            $strReqXml = str_replace("{CREDITCARD_NUMBER}", $cc->number, $strReqXml);
            $strReqXml = str_replace("{CREDITCARD_EXPDATE}", $cc->expDate, $strReqXml);
            $strReqXml = str_replace("{CREDITCARD_CVV}", $cc->cvv, $strReqXml);

            //shippig address
            $strReqXml = str_replace("{SHIPPING_STREET}", $shipAddr->street, $strReqXml);
            $strReqXml = str_replace("{SHIPPING_CITY}", $shipAddr->city, $strReqXml);
            $strReqXml = str_replace("{SHIPPING_POSTALCODE}", $shipAddr->postalCode, $strReqXml);

            //address
            $strReqXml = str_replace("{ADDRESS_NAME}", $addr->name, $strReqXml);
            $strReqXml = str_replace("{ADDRESS_STREET}", $addr->street, $strReqXml);
            $strReqXml = str_replace("{ADDRESS_CITY}", $addr->city, $strReqXml);
            $strReqXml = str_replace("{ADDRESS_STATE}", $addr->state, $strReqXml);
            $strReqXml = str_replace("{ADDRESS_POSTALCODE}", $addr->postalCode, $strReqXml);
            $strReqXml = str_replace("{ADDRESS_COUNTRY}", $addr->country, $strReqXml);


            break;


        }

        $this->reqXML = $strReqXml;

    }
    public function prepareRequest() {
      $this->fillReqXmlTemplate();
    }

    protected function getEndPoint() {
      $endPoint = '';
      switch ($this->requestType) {
        case 'LowFareSearch':
        case 'AirCreateReservation':
          $endPoint = $this->wiconfig['Travelport']['ENDPOINT'];
          break;
        case 'HotelSearch':
        case 'HotelDetails':
        case 'HotelMedia':
        case 'HotelCreateReservation':
          $endPoint = $this->wiconfig['Travelport']['HOTEL_ENDPOINT'];
          break;
      }
      return $endPoint;
    }

    public function getFlightResults() {
      $this->requestType = 'LowFareSearch';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/LowFareSearchResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/LowFareSearchResp.json', $this->responseJson);
      //return result
      return $this->responseJson;
    }

    public function getHotelResults() {
      $this->requestType = 'HotelSearch';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/HotelSearchResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/HotelSearchResp.json', $this->responseJson);
      //return result
      return $this->responseJson;
    }

    // public function getFlightDetails() {
    //
    //
    // }

    public function getHotelDetails() {

      $this->requestType = 'HotelDetails';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/HotelDetailsResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/HotelDetailsResp.json', $this->responseJson);
      //return result
      return $this->responseJson;

    }

    public function getHotelMediaLinks() {
      $this->requestType = 'HotelMedia';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/HotelMediaLinksResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/HotelMediaLinksResp.json', $this->responseJson);
      //return result
      return $this->responseJson;

    }


    public function bookFlight() {
      $this->requestType = 'AirCreateReservation';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/AirCreateReservationResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/AirCreateReservationResp.json', $this->responseJson);
      //return result
      return $this->responseJson;
    }

    public function bookHotel() {
      $this->requestType = 'HotelCreateReservation';
      if($this->wiconfig['Travelport']['USE_CACHE'] == 'true') {
        return file_get_contents(__DIR__ . '/cache/api_responses/HotelCreateReservationResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/HotelCreateReservationResp.json', $this->responseJson);
      //return result
      return $this->responseJson;

    }

  }
