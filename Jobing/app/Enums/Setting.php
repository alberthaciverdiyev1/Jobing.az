<?php

namespace App\Enums;

enum Setting: int
{
    case LimitPerRequest = 3;
    case MaxUsers = 100;
    case Timeout = 30;
}
