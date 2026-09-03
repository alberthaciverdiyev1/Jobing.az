<?php

namespace App\Modules\ActivityLog\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'ip_address',
        'method',
        'url',
        'action',
        'model_type',
        'model_id',
        'payload',
        'user_agent',
        'device_type',
        'browser',
        'os',
        'status_code',
        'created_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detect device/browser/OS from a User-Agent string.
     */
    public static function detectDevice(?string $ua): array
    {
        $ua = strtolower((string) $ua);

        if (str_contains($ua, 'mobile') || str_contains($ua, 'android') || str_contains($ua, 'iphone') || str_contains($ua, 'ipad')) {
            $device = str_contains($ua, 'ipad') ? 'tablet' : 'mobile';
        } elseif (str_contains($ua, 'tablet') || str_contains($ua, 'ipad')) {
            $device = 'tablet';
        } else {
            $device = 'desktop';
        }

        $browser = 'unknown';
        foreach ([
            'edg' => 'Edge', 'opr/' => 'Opera', 'chrome' => 'Chrome', 'firefox' => 'Firefox',
            'safari' => 'Safari', 'msie' => 'IE', 'trident' => 'IE',
        ] as $needle => $label) {
            if (str_contains($ua, $needle)) {
                $browser = $label;
                break;
            }
        }

        $os = 'unknown';
        foreach ([
            'windows nt' => 'Windows', 'android' => 'Android', 'iphone' => 'iOS', 'ipad' => 'iPadOS',
            'mac os x' => 'macOS', 'linux' => 'Linux',
        ] as $needle => $label) {
            if (str_contains($ua, $needle)) {
                $os = $label;
                break;
            }
        }

        return [$device, $browser, $os];
    }

    /**
     * Record a log entry. Pass a request (optional) to auto-capture IP/UA/device.
     */
    public static function record(
        string $action,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $payload = null,
        ?\Illuminate\Http\Request $request = null,
        ?int $userId = null,
        ?int $statusCode = 200
    ): void {
        $request = $request ?: request();

        [$device, $browser, $os] = self::detectDevice($request?->userAgent());

        try {
            static::create([
                'user_id' => $userId ?? auth()->id(),
                'ip_address' => $request?->ip(),
                'method' => $request?->method() ?? 'CLI',
                'url' => $request ? $request->fullUrl() : 'CLI',
                'action' => $action,
                'model_type' => $modelType,
                'model_id' => $modelId,
                'payload' => $payload,
                'user_agent' => substr((string) $request?->userAgent(), 0, 500),
                'device_type' => $device,
                'browser' => $browser,
                'os' => $os,
                'status_code' => $statusCode,
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
