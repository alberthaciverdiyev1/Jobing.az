<?php

namespace App\Modules\SystemLog\Services;

use App\Modules\SystemLog\Models\AppLog;
use Illuminate\Support\Facades\Log;

class SystemLog
{
    public static function record(string $level, string $message, ?string $source = null, ?array $metadata = null): void
    {
        try {
            $request = app()->runningInConsole() ? null : request();

            AppLog::create([
                'level' => $level,
                'source' => $source,
                'message' => $message,
                'metadata' => $metadata,
                'url' => $request?->fullUrl(),
                'method' => $request?->method(),
                'ip' => $request?->ip(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('SystemLog yazıla bilmədi: ' . $e->getMessage());
        }
    }

    public static function info(string $message, ?string $source = null, ?array $metadata = null): void
    {
        self::record('info', $message, $source, $metadata);
    }

    public static function warning(string $message, ?string $source = null, ?array $metadata = null): void
    {
        self::record('warning', $message, $source, $metadata);
    }

    public static function error(string $message, ?string $source = null, ?array $metadata = null): void
    {
        self::record('error', $message, $source, $metadata);
    }

    public static function exception(\Throwable $e, ?string $source = null): void
    {
        self::record('error', $e->getMessage(), $source ?? get_class($e), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => collect($e->getTrace())->take(10)->map(fn ($t) => ($t['file'] ?? '') . ':' . ($t['line'] ?? ''))->all(),
        ]);
    }
}
