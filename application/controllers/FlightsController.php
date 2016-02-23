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

        //send request

        //parse the resp

        //send the resp


        $endpoint = "https://emea.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/HotelService";
        $message = trim(file_get_contents(dirname(__FILE__)."/../../../wetravel/services/sample_requests/HotelCreateReservationReq.xml"));        

        // $client = new nusoap_client($endpoint, false);
        // $client->setCredentials('Universal API/uAPI2309471039-e76846fc', 'Q&x7/p2D4J');
        // $result = $client->send($message, $endpoint);        

        //echo json_encode($result);


    }
}
