<?php
	require_once __DIR__ . '/init.php';
	require_once __DIR__ . '/../Bootstrap.php';
	$wiconfig = $application->getBootstrap()->getOption('wiconfig');


	$citiesTable = new DbTable_Cities();
	$cities = $citiesTable->fetchAll();
	
	foreach ($cities as $cityRow) {
		// echo $city->code;

	    $location = $cityRow->code;	    
	    $adults = 1;

	    $startDate = Utils::getNextFriday();
	    $endDate = Utils::getNextSunday();

	    //TODO: read the req params
	    $search = new HotelSearchCriteria();
	    $search->location = $location;
	    $search->numAdults = $adults;
	    $search->checkinDate = $startDate;
	    $search->checkoutDate = $endDate;
	    $search->numRooms = ceil($search->numAdults/2);

	    //send request
	    $gds = GdsFactory::getGdsProvider($wiconfig, 'TRAVELPORT');
	    $gds->setRequest($search);
	    $results_json = $gds->getHotelResults();

	    //$cityRow->hotels_json = $results_json;
	    //$cityRow->save();

	    //parse
	    $obj =  new HotelSearchParser();
	    $obj->setJsonResponse($results_json);
		$hotels = $obj->parse();	
	
		foreach ($hotels as $hotelCode => $hotelRow) {
			// echo "<pre>";
			// var_dump($hotelRow); 
			$hotelRow->city_code = $cityRow->code;
			$hotelRow->save();
		}

	}
	echo 'Done';
