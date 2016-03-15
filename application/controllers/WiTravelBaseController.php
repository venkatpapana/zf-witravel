<?php

class WiTravelBaseController extends Zend_Controller_Action {



  public function getTemplateConfig() {


  }


  public function getNextFriday() {
    return '2016-03-20';
  }


  public function getNextSunday() {
    return '2016-03-22';
  }
}
