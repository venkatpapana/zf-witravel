<?php

class FlightsControllerTest extends Zend_Test_PHPUnit_ControllerTestCase
{

    public function setUp()
    {
        $this->bootstrap = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH . '/configs/application.ini');
        parent::setUp();
    }


    public function testLowFareSearch() {
      $this->dispatch('/flights/low-fare-search');
      $this->assertAction('low-fare-search');

    }


}
