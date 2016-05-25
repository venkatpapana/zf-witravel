<?php
use GeoIp2\Database\Reader;
class Utils{	
	  public static function getNextFriday() {
	    return date("Y-m-d", strtotime('next friday'));
	  }


	  public static function getNextSunday() {
	    return date("Y-m-d", strtotime('next sunday'));
	  }	

	public static function fillRequestTemplate ($templateFile, $arrPlaceholders) {
		$string = file_get_contents(__DIR__ . '/../xml_req_templates/'.$templateFile);
		
		foreach ($arrPlaceholders as $key => $value) {
			$string = str_replace('{'.$key.'}', $value, $message);			
		}
		return $string;
	}

	public static function getCityCodeFromName($name) {
		$cityCode = 'PAR';
		$cityNameCodes = json_decode(file_get_contents(__DIR__ . '/../configs/city_names_codes.json'), true);
		$cityNameCodes = array_change_key_case ($cityNameCodes, CASE_LOWER);
		if(!empty($cityNameCodes[strtolower($name)])) {
			$cityCode = $cityNameCodes[strtolower($name)];
		}		
		return $cityCode;
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
				'city' => 'Paris'
			);
		}
		$cityNameCodes = json_decode(file_get_contents(__DIR__ . '/../configs/city_names_codes.json'), true);
		$cityNameCodes = array_change_key_case ($cityNameCodes, CASE_LOWER);
		if(!empty($cityNameCodes[strtolower($res['city'])])) {
			$res['city_code'] = $cityNameCodes[strtolower($res['city'])];
		}else{
			$res['city_code'] = 'PAR'; //PAR
		}		
		return $res;
		
    }

    public static function getGoogleGeoLocation() {
		$res = array(
			'country_code' => '',
			'country_name' => '',
			'country_iso' => '',
			'city' => 'Parish',
			'city_code' => 'PAR'
		); 
    	$endpoint = 'https://geoip-db.com/json/';
    	$result = file_get_contents($endpoint);
    	if($result) {
    		$result = json_decode($result, true);

			$cityNameCodes = json_decode(file_get_contents(__DIR__ . '/../configs/city_names_codes.json'), true);
			$cityNameCodes = array_change_key_case ($cityNameCodes, CASE_LOWER);
			if(!empty($cityNameCodes[strtolower($result['city'])])) {
				$result['city_code'] = $cityNameCodes[strtolower($result['city'])];
			}else{
				$result['city_code'] = 'PAR'; //PAR
			}		    		

    	}
      	return $res;

    
    }
}

