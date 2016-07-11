<?php

/**
 * Created by PhpStorm.
 * User: papanav
 * Date: 4/15/2016
 * Time: 11:15 PM
 */
class CreditCard {
    public $name, $type, $number, $expDate, $cvv;

    public function __construct($name, $type, $number, $expDate, $cvv) {
    	$this->name = $name;
        $this->type = $type;
        $this->number = $number;
        $this->expDate = $expDate;
        $this->cvv = $cvv;
    }
}