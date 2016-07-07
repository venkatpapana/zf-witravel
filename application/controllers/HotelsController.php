<?php
class HotelsController extends WiTravelBaseController
{

    public function init()
    {
      $this->getHelper('ViewRenderer')
        ->setNoRender();

        $this->getResponse()
         ->setHeader('Content-Type', 'application/json');
    }

    public function indexAction()
    {
      echo __METHOD__;
    }

    public function hotelSearchAction() {
        $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        $request = Zend_Controller_Front::getInstance()->getRequest();

        $location = $request->getParam('location');
        // $budget = $request->getParam('budget')?$request->getParam('budget'): 200;
        $adults = $request->getParam('adults')?$request->getParam('adults'): 1;

        $startDate = $request->getParam('startDate')?$request->getParam('startDate'): $this->getNextFriday();
        $endDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();


        //TODO: read the req params
        $search = new HotelSearchCriteria();
        $search->location = $location;
        $search->numAdults = $adults;
        $search->checkinDate = $startDate;
        $search->checkoutDate = $endDate;
        $search->numRooms = ceil($search->numAdults/2);

        //send request
        // $gds = GdsProvider::getGdsObj();
        $this->gds->setRequest($search);
        $results = $this->gds->getHotelResults();

        echo $results;

    }

    public function cacheHotelSearchAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        $request = Zend_Controller_Front::getInstance()->getRequest();

        $location = $request->getParam('location');
        // $budget = $request->getParam('budget')?$request->getParam('budget'): 200;
        $adults = $request->getParam('adults')?$request->getParam('adults'): 1;

        $startDate = $request->getParam('startDate')?$request->getParam('startDate'): $this->getNextFriday();
        $endDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();


        //TODO: read the req params
        $hotelsTable = new DBTable_Hotels();
        $hotels = $hotelsTable->fetchAll(
            $hotelsTable->select()
                ->where('Availability = ?', 'Available')
                ->order('city_code ASC')
                ->order('MinimumAmountNum ASC')
        );

        $arrHotels = array();
        foreach ($hotels as $hotel) {
            $arrHotels[$hotel->city_code][] = $hotel->toArray();;
        }

        echo json_encode($arrHotels);



        // $search = new HotelSearchCriteria();
        // $search->location = $location;
        // $search->numAdults = $adults;
        // $search->checkinDate = $startDate;
        // $search->checkoutDate = $endDate;
        // $search->numRooms = ceil($search->numAdults/2);

        // //send request
        // // $gds = GdsProvider::getGdsObj();
        // $this->gds->setRequest($search);
        // $results = $this->gds->getHotelResults();

        // echo $results;

    }    

    public function hotelDetailsAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');
        $request = Zend_Controller_Front::getInstance()->getRequest();

        $results = [];

        if($request->getParam('hotelCode')) {
        //     //TODO: read the req params
            $search = new HotelDetailsCriteria();
            $search->hotelCode = $request->getParam('hotelCode');
            $search->numAdults = $request->getParam('adults')?$request->getParam('adults'): 1;
            $search->numChildren = 0;
            $search->checkinDate = $request->getParam('startDate')? $request->getParam('startDate'): $this->getNextFriday();
            $search->checkoutDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();
            $search->numRooms = '1';
            $search->hotelChain = 'YX';

            //send request
            // $gds = GdsProvider::getGdsObj();
            $this->gds->setRequest($search);
            $results = $this->gds->getHotelDetails();
        }
        echo $results;

    }

    public function hotelMediaLinksAction() {
        $request = Zend_Controller_Front::getInstance()->getRequest();

        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');
        $results = array();

        if($request->getParam('hotelCode')) {
            $hotelCode = $request->getParam('hotelCode');
// echo __METHOD__ . $hotelCode; exit;            
            //TODO: read the req params
            $search = new HotelMediaLinksCriteria();
            $search->hotelCode = $hotelCode;

            //send request
            // $gds = GdsProvider::getGdsObj();
            $this->gds->setRequest($search);
            $results = $this->gds->getHotelMediaLinks();
        }
        echo $results;

    }

    public function hotelReservationAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        $body = $this->getRequest()->getRawBody();
        $data = Zend_Json::decode($body);


        //TODO: read the req params
        $reservation = new HotelReservationCriteria();

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

        $reservation->traveller = $traveller;

        //send request
        // $gds = GdsProvider::getGdsObj();
        $this->gds->setRequest($reservation);
        $results = $this->gds->bookHotel();

        echo $results;

    }

}
