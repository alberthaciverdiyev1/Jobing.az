<?php

use Illuminate\Support\Facades\Route;

$modules = [
    'API' => 'Modules/API/routes/api.php',
    'Web' => 'Modules/Web/routes/web.php',
    'Admin' => 'Modules/Admin/routes/web.php',
];

foreach ($modules as $module => $path) {
    if (file_exists($path)) {
        require $path;
    }
}
