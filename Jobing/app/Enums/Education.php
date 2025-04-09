<?php

namespace App\Enums;

enum Education: int
{
    case Secondary = 6;
    case Higher = 5;
    case IncompleteEducation = 4;
    case Bachelor = 3;
    case Master = 2;
    case Doctor = 1;
}
