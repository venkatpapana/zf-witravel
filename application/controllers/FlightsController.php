<?php
class FlightsController extends WiTravelBaseController {
    public function init() {
      $this->getHelper('ViewRenderer')
        ->setNoRender();

        $this->getResponse()
         ->setHeader('Content-Type', 'application/json');
    }

    public function indexAction() {
        echo __METHOD__;
    }

    public function lowFareSearchAction() {
        
        $request = Zend_Controller_Front::getInstance()->getRequest();

        //$origin = Utils::geoLocation()['city_code'];
        $origin = $request->getParam('origin')? $request->getParam('origin'): 'Madrid'; //$this->getOrigin()
        $origin = Utils::getCityCodeFromName($origin);

        $budget = $request->getParam('budget')?$request->getParam('budget'): 1200;
        $travellers = $request->getParam('travellers')?$request->getParam('travellers'): 1;
        $destinations = $request->getParam('destinations')? explode(',', $request->getParam('destinations')): $wiconfig['Destinations'];

        $startDate = $request->getParam('startDate')?$request->getParam('startDate'): $this->getNextFriday();
        $endDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();

        $twoWay = filter_var($request->getParam('twoWay'), FILTER_VALIDATE_BOOLEAN);

        //TODO: read the req params
        $search = new FlightSearchCriteria();
        $search->setFromPlace($origin);
        $search->setFromDate($startDate);
        $search->setToDate($endDate);
        $search->setToPlaces($destinations);
        $search->setBudget($budget);
        $search->setNumPassengers($travellers);
        $search->setIs2Way($twoWay);

        //send request
        // $gds = new GdsProvider();
        // $gds = $gds->getGdsObj('TRAVELPORT');
        $this->gds->setRequest($search);
        $results = $this->gds->getFlightResults();

        echo $results;



    }

    public function flightReservationAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        $body = $this->getRequest()->getRawBody();
        $data = Zend_Json::decode($body);
// echo "<pre>";
// print_r($data);exit;        

        $reservation = new FlightReservationCriteria();

        $selectedHotel = $data['selectedHotel']?$data['selectedHotel']:'';

        if(!empty($selectedHotel)) {            
            $reservation->hotelCode     = $selectedHotel['HotelCode'];
            $reservation->numAdults     = 2;
            $reservation->checkinDate   = $data['startDateStr'];
            $reservation->checkoutDate  = $data['endDateStr'];
            $reservation->numRooms      = 1;
        }

        //traveller
        $trvTitle       = $data['title']?$data['title']:'';
        $trvFirstName   = $data['first_name']?$data['first_name']:'';
        $trvLastName    = $data['last_name']?$data['last_name']:'';
        $trvAge         = $data['age']?$data['age']:'';
        $trvDob         = $data['dob']?$data['dob']:'';
        $trvGender      = $data['gender']?$data['gender']:'';
        $trvNationality = $data['nationality']?$data['nationality']:'';
        $trvEmail       = $data['email']?$data['email']:'';
        $traveller      = new Traveller($trvTitle, $trvFirstName, $trvLastName, $trvAge, $trvDob, $trvGender, $trvNationality, $trvEmail);

        //address
        $addrName       = $data['addr_name']?$data['addr_name']:'';
        $addrState      = $data['addr_state']?$data['addr_state']:'';
        $addrPostalCode = $data['addr_postalCode']?$data['addr_postalCode']:'';
        $addrCountry    = $data['addr_country']?$data['addr_country']:'';
        $addrStreet     = $data['addr_street']?$data['addr_street']:'';
        $addrCity       = $data['addr_city']?$data['addr_city']:'';

        $addr->name         = $addrName;
        $addr->state        = $addrState;
        $addr->postalCode   = $addrPostalCode;
        $addr->country      = $addrCountry;
        $addr->street       = $addrStreet;
        $addr->city         = $addrCity;
        $traveller->address = $addr;

        //delivery address
        $shipPostalCode = $data['ship_addr_postalCode']?$data['ship_addr_postalCode']:'';
        $shipStreet     = $data['ship_addr_street']?$data['ship_addr_street']:'';
        $shipCity       = $data['ship_addr_city']?$data['ship_addr_city']:'';

        $shippingAddr = new Address();
        $shippingAddr->street       = $shipStreet;
        $shippingAddr->city         = $shipCity;
        $shippingAddr->postalCode   = $shipPostalCode;
        $traveller->shippingAddress = $shippingAddr;

        //phone
        $phoneLocation      = $data['phone_location']?$data['phone_location']:'';
        $phoneCountryCode   = $data['phone_countryCode']?$data['phone_countryCode']:'';
        $phoneAreaCode      = $data['phone_areaCode']?$data['phone_areaCode']:'';
        $phoneNumber        = $data['phone']?$data['phone']:'';

        $phone = new Phone($phoneLocation, $phoneCountryCode, $phoneAreaCode, $phoneNumber);
        $traveller->phone = $phone;

        //credit card
        $ccType     = $data['cc_type']?$data['cc_type']:'';        
        $ccNum      = $data['cc_num']?$data['cc_num']:'';        
        $ccExpYear  = $data['cc_exp_year']?$data['cc_exp_year']:'';
        $ccExpMon   = $data['cc_exp_mon']?$data['cc_exp_mon']:'';
        $ccCvv      = $data['cc_cvv']?$data['cc_cvv']:'';

        $cc = new CreditCard($ccType, $ccNum, $ccExpYear.'-'.$ccExpMon, $ccCvv);
        $traveller->creditCard = $cc;

//echo "<pre>";

        $reservation->traveller = $traveller;
// print_r($reservation);exit;
        //send request
        // $gds = GdsProvider::getGdsObj();
        // $gds = new GdsProvider();
        // $gds = $gds->getGdsObj('TRAVELPORT');
        $this->gds->setRequest($reservation);
        
        $results = $this->gds->bookFlight();

        echo $results;



    }


}
