<?php

namespace Base\app\Services;

use Illuminate\Support\Facades\Log;
use Base\app\Models\Visitor;
use Carbon\Carbon;

class VisitorService
{
    public function findByIp($ip)
    {
        try {
            return Visitor::where('ip', $ip)->first();
        } catch (\Exception $e) {
            throw new \Exception('Error finding visitor by IP: ' . $e->getMessage());
        }
    }

    public function create(array $data)
    {
        try {
            Log::info('Creating visitor', $data);
            return Visitor::create($data);
        } catch (\Exception $e) {
            throw new \Exception('Error creating visitor: ' . $e->getMessage());
        }
    }

    public function updateLastVisit($ip, $userAgent)
    {
        try {
            $visitor = Visitor::where('ip', $ip)->first();

            if (!$visitor) {
                throw new \Exception('Visitor not found');
            }

            $visitor->last_visit = now();
            $visitor->user_agent = $userAgent;
            $visitor->save();

            return $visitor;
        } catch (\Exception $e) {
            throw new \Exception('Error updating last visit: ' . $e->getMessage());
        }
    }

    public function incrementVisitCount($ip)
    {
        try {
            $updated = Visitor::where('ip', $ip)->increment('visit_count');

            if (!$updated) {
                throw new \Exception('Visitor not found');
            }

            return Visitor::where('ip', $ip)->first();
        } catch (\Exception $e) {
            throw new \Exception('Error logging visitor: ' . $e->getMessage());
        }
    }

    public function count($day = null)
    {
        try {
            $query = Visitor::query();

            if ($day) {
                $date = now()->subDays($day);
                $query->where('created_at', '>=', $date);
            }

            return $query->sum('visit_count') ?? 0;
        } catch (\Exception $e) {
            throw new \Exception('Error counting visits: ' . $e->getMessage());
        }
    }

    public function dailyCount()
    {
        try {
            $startOfDay = Carbon::now()->startOfDay();
            $endOfDay = Carbon::now()->endOfDay();

            return Visitor::whereBetween('created_at', [$startOfDay, $endOfDay])->sum('visit_count') ?? 0;
        } catch (\Exception $e) {
            throw new \Exception('Error counting daily visits: ' . $e->getMessage());
        }
    }
}
