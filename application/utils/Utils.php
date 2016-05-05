<?php
use GeoIp2\Database\Reader;
class Utils{

	public static function fillRequestTemplate ($templateFile, $arrPlaceholders) {
		$string = file_get_contents(__DIR__ . '/../xml_req_templates/'.$templateFile);
		
		foreach ($arrPlaceholders as $key => $value) {
			$string = str_replace('{'.$key.'}', $value, $message);			
		}
		return $string;
	}

    public static function geoLocation() {
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
		return $res;
		
    }	
}

