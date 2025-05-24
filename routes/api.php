<?php

$modules = [
    'API' => 'Modules/API/routes/api.php',
];

foreach ($modules as $module => $path) {
    if (file_exists($path)) {
        require $path;
    }
}
