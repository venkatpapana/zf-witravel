<?php
class FlightSearchCriteria {
  protected $fromPlace, $toPlaces, $fromDate, $toDate, $numPassengers, $budget;

  public function setFromPlace($fromPlace){
    $this->fromPlace = $fromPlace;
  }

  public function setToPlaces($toPlaces) {
    $this->toPlaces = $toPlaces;
  }

  public function setFromDate($fromDate) {
    $this->fromDate = $fromDate;
  }
  public function setToDate($toDate) {
    $this->toDate = $toDate;
  }

  public function setNumPassengers($numPassengers) {
    $this->numPassengers = $numPassengers;
  }

  public function setBudget($budget) {
    $this->budget = $budget;
  }

  public function getFromPlace(){
    return $this->fromPlace;
  }

  public function getToPlaces() {
    return $this->toPlaces;
  }

  public function getFromDate() {
    return $this->fromDate;
  }
  public function getToDate() {
    return $this->toDate;
  }

  public function getNumPassengers() {
    return $this->numPassengers;
  }

  public function getBudget() {
    return $this->budget;
  }


}
