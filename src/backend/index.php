<?php

use DelJdlx\RpgEngine\Area;

ini_set('display_errors', true);

require __DIR__ . '/src/Area.php';



$x = filter_input(INPUT_GET, 'x', FILTER_VALIDATE_INT);
$y = filter_input(INPUT_GET, 'y', FILTER_VALIDATE_INT);

if ($x === false || $y === false || $x === null || $y === null) {
    http_response_code(400);
    echo '[]';
    return;
}

// Validate coordinates are within reasonable bounds
if (abs($x) > 1000 || abs($y) > 1000) {
    http_response_code(400);
    echo '[]';
    return;
}

$filename = $x . '_' . $y . '.json';
$file = __DIR__ . '/areas/' . $filename;

if(!is_file($file)) {
    echo '[]';
    return;
}

$json = json_decode(
    file_get_contents($file),
    true,
);

$area = new Area();
$area->loadFromArray($json);

echo json_encode(
    $area->jsonSerialize()
);

