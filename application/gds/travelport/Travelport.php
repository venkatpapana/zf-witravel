<?php
  require_once __DIR__ . '/../GdsInterface.php';

  class Travelport extends GdsInterface {

    protected $reqXmlPath;
    protected $reqXML, $responseJson;

    public function __construct($wiconfig) {
      parent::__construct($wiconfig);
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
            $strReqXml = str_replace("{HOTEL_CHAIN}", 'YX', $strReqXml);


            break;

          case 'HotelMedia':
            $request = $this->getRequest();
            $strReqXml = str_replace("{TARGET_BRANCH}", $this->wiconfig['Travelport']['TARGET_BRANCH'], $strReqXml);
            $strReqXml = str_replace("{AUTHORIZED_BY}", $this->wiconfig['Travelport']['AUTHORIZED_BY'], $strReqXml);
            $strReqXml = str_replace("{HOTEL_CODE}", $request->hotelCode, $strReqXml);

            break;

          case 'AirCreateReservation':
            $request    = $this->getRequest();

            $traveller  = $request->traveller;
            $cc         = $traveller->creditCard;
            $phone      = $traveller->phone;
            $shipAddr   = $traveller->shippingAddress;
            $addr       = $traveller->address;

            $airSegments = $request->selectedAirSegment;


            $airSegmentXml    = $this->reqXmlPath . '/' . 'AirSegment.xml';
            $strAirSegmentXml1 = file_get_contents($airSegmentXml);
          
            $strAirSegmentXml1 = str_replace("{FLIGHT_KEY}", $airSegments['onward']['!Key'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{FLIGHT_GROUP}", $airSegments['onward']['!Group'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{CARRIER}", $airSegments['onward']['!Carrier'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{FLIGHT_NUMBER}", $airSegments['onward']['!FlightNumber'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{ORIGIN}", $airSegments['onward']['!Origin'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{DESTINATION}", $airSegments['onward']['!Destination'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{DEPARTURE_TIME}", $airSegments['onward']['!DepartureTime'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{ARRIVAL_TIME}", $airSegments['onward']['!ArrivalTime'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{FLIGHT_TIME}", $airSegments['onward']['!FlightTime'], $strAirSegmentXml1);
            $strAirSegmentXml1 = str_replace("{TRAVEL_TIME}", $airSegments['onward']['TravelTime'], $strAirSegmentXml1);
            if(!empty($airSegments['onward']['!Distance'])) {
                $strAirSegmentXml1 = str_replace("{DISTANCE}", $airSegments['onward']['!Distance'], $strAirSegmentXml1);
            }else{
                $strAirSegmentXml1 = str_replace("{DISTANCE}", '0', $strAirSegmentXml1);
            }
            $strAirSegmentXml1 = str_replace("{CLASS}", 'P', $strAirSegmentXml1); //TODO
// print_r($airSegments['onward']);exit;

            $strAirSegmentXml2 = '';
            if(!empty($airSegments['return'])) {
                $strAirSegmentXml2 = file_get_contents($airSegmentXml);
                $strAirSegmentXml2 = str_replace("{FLIGHT_KEY}", $airSegments['return']['!Key'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{FLIGHT_GROUP}", $airSegments['return']['!Group'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{CARRIER}", $airSegments['return']['!Carrier'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{FLIGHT_NUMBER}", $airSegments['return']['!FlightNumber'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{ORIGIN}", $airSegments['return']['!Origin'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{DESTINATION}", $airSegments['return']['!Destination'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{DEPARTURE_TIME}", $airSegments['return']['!DepartureTime'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{ARRIVAL_TIME}", $airSegments['return']['!ArrivalTime'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{FLIGHT_TIME}", $airSegments['return']['!FlightTime'], $strAirSegmentXml2);
                $strAirSegmentXml2 = str_replace("{TRAVEL_TIME}", $airSegments['return']['TravelTime'], $strAirSegmentXml2);
                if(!empty($airSegments['return']['!Distance'])) {
                    $strAirSegmentXml2 = str_replace("{DISTANCE}", $airSegments['return']['!Distance'], $strAirSegmentXml2);
                }else{
                    $strAirSegmentXml2 = str_replace("{DISTANCE}", '0', $strAirSegmentXml2);
                }
                $strAirSegmentXml2 = str_replace("{CLASS}", 'P', $strAirSegmentXml2); //TODO
            }

            $strReqXml = str_replace("{AIR_SEGMENTS}", $strAirSegmentXml1 . $strAirSegmentXml2, $strReqXml);

            //Fare Info
            $fareInfoXml    = $this->reqXmlPath . '/' . 'FareInfo.xml';
            $fareInfoXml1 = file_get_contents($fareInfoXml);
            $fareInfoObj1 = $airSegments['onward']['FareInfo'];

            $fareInfoXml1 = str_replace("{FareFamily}", $fareInfoObj1['!FareFamily'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{Amount}", $fareInfoObj1['!Amount'], $fareInfoXml1);
            if(empty($fareInfoObj1['!DepartureDate'])) {
                $fareInfoXml1 = str_replace("{DepartureDate}", substr($airSegments['onward']['!DepartureTime'], 0, 10), $fareInfoXml1);
            }else{
                $fareInfoXml1 = str_replace("{DepartureDate}", $fareInfoObj1['!DepartureDate'], $fareInfoXml1);
            }
            $fareInfoXml1 = str_replace("{EffectiveDate}", $fareInfoObj1['!EffectiveDate'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{Destination}", $fareInfoObj1['!Destination'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{Origin}", $fareInfoObj1['!Origin'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{PassengerTypeCode}", $fareInfoObj1['!PassengerTypeCode'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{FareBasis}", $fareInfoObj1['!FareBasis'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{Key}", $fareInfoObj1['!Key'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{FareInfoRef}", $fareInfoObj1['FareRuleKey']['!FareInfoRef'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{ProviderCode}", $fareInfoObj1['FareRuleKey']['!ProviderCode'], $fareInfoXml1);
            $fareInfoXml1 = str_replace("{FareRuleKey}", $fareInfoObj1['FareRuleKey']['!'], $fareInfoXml1);


            $fareInfoXml2 = '';
            if(!empty($airSegments['return'])) {
                $fareInfoXml2 = file_get_contents($fareInfoXml);
                $fareInfoObj2 = $airSegments['return']['FareInfo'];

                $fareInfoXml2 = str_replace("{FareFamily}", $fareInfoObj2['!FareFamily'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{Amount}", $fareInfoObj2['!Amount'], $fareInfoXml2);
                if(empty($fareInfoObj1['!DepartureDate'])) {
                    $fareInfoXml2 = str_replace("{DepartureDate}", substr($airSegments['return']['!DepartureTime'], 0, 10), $fareInfoXml2);
                }else{
                    $fareInfoXml2 = str_replace("{DepartureDate}", $fareInfoObj2['!DepartureDate'], $fareInfoXml2);
                }
                $fareInfoXml2 = str_replace("{EffectiveDate}", $fareInfoObj2['!EffectiveDate'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{Destination}", $fareInfoObj2['!Destination'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{Origin}", $fareInfoObj2['!Origin'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{PassengerTypeCode}", $fareInfoObj2['!PassengerTypeCode'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{FareBasis}", $fareInfoObj2['!FareBasis'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{Key}", $fareInfoObj2['!Key'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{FareInfoRef}", $fareInfoObj2['FareRuleKey']['!FareInfoRef'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{ProviderCode}", $fareInfoObj2['FareRuleKey']['!ProviderCode'], $fareInfoXml2);
                $fareInfoXml2 = str_replace("{FareRuleKey}", $fareInfoObj2['FareRuleKey']['!'], $fareInfoXml2); 
            }
            $strReqXml = str_replace("{FARE_INFOS}", $fareInfoXml1 . $fareInfoXml2, $strReqXml);           

            //Booking Info
            $bookingInfoXml    = $this->reqXmlPath . '/' . 'BookingInfo.xml';
            $bookingInfoXml1 = file_get_contents($bookingInfoXml);
            $bookingInfoObj1 = $airSegments['onward']['BookingInfo'];

            $bookingInfoXml1 = str_replace("{BookingCode}", $bookingInfoObj1['!BookingCode'], $bookingInfoXml1);
            $bookingInfoXml1 = str_replace("{CabinClass}", $bookingInfoObj1['!CabinClass'], $bookingInfoXml1);
            $bookingInfoXml1 = str_replace("{FareInfoRef}", $bookingInfoObj1['!FareInfoRef'], $bookingInfoXml1);
            $bookingInfoXml1 = str_replace("{SegmentRef}", $bookingInfoObj1['!SegmentRef'], $bookingInfoXml1);

// echo $bookingInfoXml1; exit;
            $bookingInfoXml2 = '';
            if(!empty($airSegments['return'])) {
                $bookingInfoXml2 = file_get_contents($bookingInfoXml);
                $bookingInfoObj2 = $airSegments['return']['BookingInfo'];

                $bookingInfoXml2 = str_replace("{BookingCode}", $bookingInfoObj2['!BookingCode'], $bookingInfoXml2);
                $bookingInfoXml2 = str_replace("{CabinClass}", $bookingInfoObj2['!CabinClass'], $bookingInfoXml2);
                $bookingInfoXml2 = str_replace("{FareInfoRef}", $bookingInfoObj2['!FareInfoRef'], $bookingInfoXml2);
                $bookingInfoXml2 = str_replace("{SegmentRef}", $bookingInfoObj2['!SegmentRef'], $bookingInfoXml2);
            }
            $strReqXml = str_replace("{BOOKING_INFOS}", $bookingInfoXml1 . $bookingInfoXml2, $strReqXml); 

            //Air Pricing Soluction
            $strReqXml = str_replace("{AIR_TOTALPRICE}", $airSegments['AirPricingSolution']['TotalAirPrice'], $strReqXml);
            $strReqXml = str_replace("{AIR_BASEPRICE}", $airSegments['AirPricingSolution']['BasePrice'], $strReqXml);
            $strReqXml = str_replace("{AIR_APPRX_TOTALPRICE}", $airSegments['AirPricingSolution']['ApproximateTotalPrice'], $strReqXml);
            $strReqXml = str_replace("{AIR_APPRX_BASEPRICE}", $airSegments['AirPricingSolution']['ApproximateBasePrice'], $strReqXml);
            $strReqXml = str_replace("{AIR_TAXES}", $airSegments['AirPricingSolution']['Taxes'], $strReqXml);

            //Air Pricing Info
            $strReqXml = str_replace("{API_PRICING_METHOD}", $airSegments['AirPricingInfo']['PricingMethod'], $strReqXml);
            $strReqXml = str_replace("{API_TAXES}", $airSegments['AirPricingInfo']['Taxes'], $strReqXml);
            $strReqXml = str_replace("{API_KEY}", $airSegments['AirPricingInfo']['Key'], $strReqXml);
            $strReqXml = str_replace("{API_TOTAL_PRICE}", $airSegments['AirPricingInfo']['TotalPrice'], $strReqXml);
            $strReqXml = str_replace("{API_BASE_PRICE}", $airSegments['AirPricingInfo']['BasePrice'], $strReqXml);
            $strReqXml = str_replace("{API_APPROXIMATE_TOTAL_PRICE}", $airSegments['AirPricingInfo']['ApproximateTotalPrice'], $strReqXml);
            $strReqXml = str_replace("{API_APPROXIMATE_BASE_PRICE}", $airSegments['AirPricingInfo']['ApproximateBasePrice'], $strReqXml);
            $strReqXml = str_replace("{API_PROVIDER_CODE}", $airSegments['AirPricingInfo']['ProviderCode'], $strReqXml);



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
            
            $strReqXml = str_replace("{CREDITCARD_NAME}", $cc->name, $strReqXml);
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

// echo $strReqXml;
echo '{"status": true}'; exit;
            break;

          case 'HotelCreateReservation':
            $request    = $this->getRequest();

            $traveller  = $request->traveller;
            $cc         = $traveller->creditCard;
            $phone      = $traveller->phone;
            $shipAddr   = $traveller->shippingAddress;
            $addr       = $traveller->address;

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

// echo $strReqXml; exit;
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
        // return file_get_contents(__DIR__ . '/cache/api_responses/LowFareSearchResp.1way.json');
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
        return file_get_contents(__DIR__ . '/cache/api_responses/HotelSearchAvailabilityResp.json');
      }

      //prepare req. xml
      $this->prepareRequest();

      //send req
      $this->sendRequest();

      //parse resp
      //$this->parseResponse();

      //file_put_contents(__DIR__ . '/cache/api_responses/HotelSearchResp.json', $this->responseJson);
      //return result
      if($this->status) {
        return $this->responseJson;
      }else{
        return false;
      }
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
      if($this->status) {
        return $this->responseJson;
      }else{
        return false;
      }

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
      if($this->status) {
        return $this->responseJson;
      }else{
        return false;
      }

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
      if($this->status) {
        return $this->responseJson;
      }else{
        return false;
      }
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
      if($this->status) {
        return $this->responseJson;
      }else{
        return false;
      }

    }

  }
