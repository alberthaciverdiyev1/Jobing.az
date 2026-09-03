<?php

namespace App\Modules\ContactReveal\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactReveal extends Model
{
    use HasFactory;

    protected $table = 'contact_reveals';

    protected $fillable = [
        'listing_type',
        'listing_id',
        'user_id',
        'ip_address',
        'user_agent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Track a reveal for a generic listing (type + id).
     */
    public static function log(string $type, int $listingId, ?\Illuminate\Http\Request $request = null): void
    {
        try {
            static::create([
                'listing_type' => $type,
                'listing_id' => $listingId,
                'user_id' => auth()->id(),
                'ip_address' => $request?->ip(),
                'user_agent' => substr((string) ($request?->userAgent() ?? ''), 0, 500),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
