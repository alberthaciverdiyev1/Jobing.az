<?php


$modules = [
    'Web' => 'Modules/Web/routes/web.php',
    'Admin' => 'Modules/Admin/routes/web.php',
];

foreach ($modules as $module => $path) {
    if (file_exists($path)) {
        require $path;
    }
}
