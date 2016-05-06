<?php
require_once __DIR__ . '/../gds/GdsProvider.php';

class FlightsController extends WiTravelBaseController
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

    public function lowFareSearchAction() {
        $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');
        $request = Zend_Controller_Front::getInstance()->getRequest();

        $origin = Utils::geoLocation()['city'];
        // $origin = $request->getParam('origin')? $request->getParam('origin'): 'AMS'; //$this->getOrigin()
        $budget = $request->getParam('budget')?$request->getParam('budget'): 1200;
        $travellers = $request->getParam('travellers')?$request->getParam('travellers'): 1;
        $destinations = $request->getParam('destinations')? explode(',', $request->getParam('destinations')): $wiconfig['Destinations'];

        $startDate = $request->getParam('startDate')?$request->getParam('startDate'): $this->getNextFriday();
        $endDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();


        //TODO: read the req params
        $search = new FlightSearchCriteria();
        $search->setFromPlace($origin);
        $search->setFromDate($startDate);
        $search->setToDate($endDate);
        $search->setToPlaces($destinations);
        $search->setBudget($budget);
        $search->setNumPassengers($travellers);

        //send request
        $gds = new GdsProvider();
        $gds = $gds->getGdsObj('TRAVELPORT');
        $gds->setRequest($search);
        $results = $gds->getFlightResults();

        echo $results;



    }

    public function flightReservationAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');
        //

        //TODO: read the req params
        $reservation = new FlightReservationCriteria();
        $reservation->hotelCode = 53495;
        $reservation->numAdults = 2;
        $reservation->checkinDate = '2016-05-20';
        $reservation->checkoutDate = '2016-05-22';
        $reservation->numRooms = '1';

        //traveller
        $traveller = new Traveller('Mr','John','Smith','40','1976-01-21','M','US','johnsmith@travelportuniversalapidemo.com');

        //delivery address
        $shippingAddr = new Address();
        $shippingAddr->street = 'Via Augusta 59 5';
        $shippingAddr->city = 'Madrid';
        $shippingAddr->postalCode = '50156';
        $traveller->shippingAddress = $shippingAddr;

        //address
        $addr = $shippingAddr;
        $addr->name = 'DemoSiteAddress';
        $addr->state = 'IA';
        $addr->postalCode = '50156';
        $addr->country = 'US';
        $traveller->address = $addr;


        //phone
        $phone = new Phone('DEN', '1', '303', '123456789');
        $traveller->phone = $phone;

        //credit card
        $cc = new CreditCard('VI', '4444333322221111', '2016-12', '123');
        $traveller->creditCard = $cc;

        $reservation->traveller = $traveller;


        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->bookFlight();

        echo $results;



    }


}
