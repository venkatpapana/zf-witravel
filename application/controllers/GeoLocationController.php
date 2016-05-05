<?php
use GeoIp2\Database\Reader;
class GeoLocationController extends WiTravelBaseController {

    public function init() {        
        $this->getHelper('ViewRenderer')->setNoRender();
        $this->getResponse()->setHeader('Content-Type', 'application/json');
    }

    public function indexAction() {
			$res = array(
				'country' => '',
				'country_iso' => '',
				'city' => ''
			);    	
    	try{
			// This creates the Reader object, which should be reused across
			// lookups.
			$reader = new Reader(__DIR__ . '/../lib/Maxmind/geolite2/GeoLite2-City.mmdb');

			// Replace "city" with the appropriate method for your database, e.g.,
			// "country".

			$record = $reader->city($_SERVER['REMOTE_ADDR']); //'110.224.233.18'

			$res = array(
				'country' => $record->country->names['en'],
				'country_iso' => $record->country->isoCode,
				'city' => $record->city->names['en']
			);
		}catch(Exception $e) {
			$res = array(
				'country' => '',
				'country_iso' => '',
				'city' => 'PAR'
			);
		}
		echo Zend_Json::encode($res);
		
    }


}
