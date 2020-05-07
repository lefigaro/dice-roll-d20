<?php
$result = array();

if(!empty($_POST['newNumber'])) {
	$save = array(
		'rolled' => $_POST['rolled']==='true',
		'rolling' => $_POST['rolling']==='true',
		'newNumber' => (int)$_POST['newNumber'],
		'minusNumber' => (int)$_POST['minusNumber'],
		'plusNumber' => (int)$_POST['plusNumber'],
		'timestamp' => time()
	);
	file_put_contents('save.json', json_encode($save));
}

echo json_encode($result);