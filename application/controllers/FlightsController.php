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

        $origin = $request->getParam('origin')? $request->getParam('origin'): 'AMS'; //$this->getOrigin()
        $budget = $request->getParam('budget')?$request->getParam('budget'): 200;
        $travellers = $request->getParam('travellers')?$request->getParam('travellers'): 1;

        $startDate = $request->getParam('startDate')?$request->getParam('startDate'): $this->getNextFriday();
        $endDate = $request->getParam('endDate')?$request->getParam('endDate'): $this->getNextSunday();


        //TODO: read the req params
        $search = new FlightSearchCriteria();
        $search->setFromPlace($origin);
        $search->setFromDate($startDate);
        $search->setToDate($endDate);
        $search->setToPlaces($wiconfig['Destinations']);
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
        // //TODO: read the req params
        $search = new FlightSearchCriteria();
        // $search->setFromPlace('AMS');
        // $search->setFromDate('2016-04-20');
        // $search->setToDate('2016-04-22');
        // $search->setToPlaces($wiconfig['Destinations']);
        // $search->setBudget('500');
        // $search->setNumPassengers(2);


        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->bookFlight();

        echo $results;



    }


}
