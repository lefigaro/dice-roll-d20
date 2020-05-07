<?php

$result = @file_get_contents('save.json');
$data = @json_decode($result, true);

$data['update'] = false;

if($data['timestamp'] > time() - 20) {
	$data['update'] = true;
}

echo json_encode($data);


