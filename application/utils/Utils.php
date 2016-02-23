<?php

class Utils{

	public function fillRequestTemplate ($templateFile, $arrPlaceholders) {
		$string = file_get_contents(__DIR__ . '/../xml_req_templates/'.$templateFile);
		
		foreach ($arrPlaceholders as $key => $value) {
			$string = str_replace('{'.$key.'}', $value, $message);			
		}
		return $string;
	}
}

