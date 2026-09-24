<?php

namespace App\Modules\ActivityLog\Models;

use App\Models\User;
use App\Modules\ActivityLog\Jobs\ProcessActivityLogJob;
use App\Modules\ActivityLog\Services\GeoIpService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $connection = 'logs';

    protected $with = ['user'];

    public $timestamps = false;

    protected $fillable = [
        'user_id', 'ip_address',
        'country_code', 'country_name', 'city', 'region', 'latitude', 'longitude', 'isp',
        'user_agent', 'device_type', 'browser', 'os',
        'method', 'url', 'referer',
        'action', 'model_type', 'model_id', 'payload',
        'duration_ms', 'status_code', 'created_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'duration_ms' => 'integer',
        'status_code' => 'integer',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFlagEmojiAttribute(): string
    {
        return GeoIpService::flagEmoji($this->country_code);
    }

    public function getLocationTextAttribute(): string
    {
        $city = $this->city && $this->city !== 'Naməlum' ? $this->city : '';
        $country = $this->country_name ?: $this->country_code;

        if ($city && $country && $city !== $country) {
            return "{$this->flag_emoji} {$city}, {$country}";
        }

        return $this->flag_emoji . ' ' . ($city ?: $country ?: 'Naməlum');
    }

    public function getHasCoordinatesAttribute(): bool
    {
        return ! empty($this->latitude) && ! empty($this->longitude) && abs((float) $this->latitude) > 0.001;
    }

    public function getGoogleMapsUrlAttribute(): ?string
    {
        return $this->has_coordinates
            ? "https://www.google.com/maps?q={$this->latitude},{$this->longitude}"
            : null;
    }

    public static function logAsync(
        string $action,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $payload = null,
        ?int $userId = null,
        ?int $statusCode = 200
    ): void {
        $request = request();

        $logData = [
            'user_id' => $userId ?? auth()->id(),
            'ip_address' => $request?->header('CF-Connecting-IP') ?? $request?->ip(),
            'cf_country' => $request?->header('CF-IPCountry'),
            'user_agent' => $request?->userAgent(),
            'method' => $request?->method() ?? 'CLI',
            'url' => $request?->fullUrl() ?? 'CLI',
            'referer' => $request?->header('referer'),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'payload' => $payload,
            'status_code' => $statusCode,
            'created_at' => now()->toDateTimeString(),
        ];

        try {
            dispatch(new ProcessActivityLogJob($logData))->afterResponse();
        } catch (\Throwable $e) {
            dispatch(new ProcessActivityLogJob($logData));
        }
    }

    public static function record(
        string $action,
        ?string $modelType = null,
        ?int $modelId = null,
        ?array $payload = null,
        ?\Illuminate\Http\Request $request = null,
        ?int $userId = null,
        ?int $statusCode = 200
    ): void {
        self::logAsync($action, $modelType, $modelId, $payload, $userId, $statusCode);
    }
}
