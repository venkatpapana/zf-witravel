<?php

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

    }

    public function lowFareSearchAction() {

        //read the req params
        $search = new FlightSearchCriteria();
        $search->setFromPlace('AMS');
        $search->setFromDate('2016-04-20');
        $search->setToDate('2016-04-22');
        $search->setToPlaces();
        $search->setBudget('500');
        $search->setNumPassengers(2);


        //send request
        $gds = new GdsProvider();
        $gds->setRequest($search);
        $gds->getFlightResults();


        //parse the resp

        //send the resp


        // $client = new nusoap_client($endpoint, false);
        // $client->setCredentials('Universal API/uAPI2309471039-e76846fc', 'Q&x7/p2D4J');
        // $result = $client->send($message, $endpoint);

        //echo json_encode($result);


    }
}
