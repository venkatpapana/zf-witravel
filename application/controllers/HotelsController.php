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

        //TODO: read the req params
        $search = new HotelSearchCriteria();
        $search->location = 'AMS';
        $search->numAdults = '2';
        $search->checkinDate = '2016-03-20';
        $search->checkoutDate = '2016-03-22';
        $search->numRooms = '1';

        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->getHotelResults();

        echo $results;

    }

    public function hotelDetailsAction() {
        $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        //TODO: read the req params
        $search = new HotelDetailsCriteria();
        $search->hotelCode = 53495;
        $search->numAdults = 2;
        $search->numChildren = 0;
        $search->checkinDate = '2016-03-20';
        $search->checkoutDate = '2016-03-22';
        $search->numRooms = '1';

        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->getHotelDetails();

        echo $results;

    }

    public function hotelMediaLinksAction() {
        $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        //TODO: read the req params
        $search = new HotelMediaLinksCriteria();
        $search->hotelCode = 53495;

        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->getHotelMediaLinks();

        echo $results;

    }

    public function hotelReservationAction() {
        // $wiconfig = Zend_Controller_Front::getInstance()->getParam('bootstrap')->getOption('wiconfig');

        //TODO: read the req params
        $search = new HotelMediaLinksCriteria();
        // $search->hotelCode = 53495;

        //send request
        $gds = GdsProvider::getGdsObj();
        $gds->setRequest($search);
        $results = $gds->bookHotel();

        echo $results;

    }

}
