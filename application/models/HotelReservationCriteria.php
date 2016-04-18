<?php
require_once(__DIR__ . '/Traveller.php');

class HotelReservationCriteria {
    public $traveller, $numAdults, $checkinDate, $checkoutDate, $numRooms;
    public $hotelCode, $hotelChain = 'YX';

}
