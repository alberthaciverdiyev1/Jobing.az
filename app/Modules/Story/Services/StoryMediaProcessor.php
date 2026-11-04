<?php

namespace App\Modules\Story\Services;

use App\Modules\Story\Models\Story;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

class StoryMediaProcessor
{
    /**
     * Compress an uploaded story video (and generate its poster) or create a
     * low-resolution preview image for an uploaded photo.
     *
     * Failures never break the upload; the original file is kept instead.
     */
    public function process(Story $story): void
    {
        $disk = Storage::disk('public');

        if (! $story->media_path || ! $disk->exists($story->media_path)) {
            $this->markProcessed($story);

            return;
        }

        $ffmpeg = $this->ffmpegBinary();

        if ($ffmpeg === null) {
            Log::warning('Story media processed without ffmpeg: binary not found.', [
                'story_id' => $story->id,
            ]);
            $this->markProcessed($story);

            return;
        }

        if ($story->isVideo()) {
            $this->processVideo($story, $disk, $ffmpeg);

            return;
        }

        $this->processImage($story, $disk, $ffmpeg);
    }

    /**
     * Generate a small preview image for a photo story.
     */
    protected function processImage(Story $story, $disk, string $ffmpeg): void
    {
        $baseName = pathinfo($story->media_path, PATHINFO_FILENAME);

        $thumbnailRelative = $this->generateThumbnail(
            $ffmpeg,
            $disk,
            $disk->path($story->media_path),
            $baseName,
            seekSecond: false,
        );

        $story->forceFill([
            'thumbnail_path' => $thumbnailRelative,
            'media_processed_at' => now(),
        ])->saveQuietly();
    }

    /**
     * Compress a video story and generate its poster thumbnail.
     */
    protected function processVideo(Story $story, $disk, string $ffmpeg): void
    {
        $sourcePath = $disk->path($story->media_path);
        $directory = dirname($story->media_path);
        $directory = $directory === '.' ? '' : $directory;
        $baseName = pathinfo($story->media_path, PATHINFO_FILENAME);
        $outputRelative = ltrim(($directory !== '' ? $directory.'/' : '').$baseName.'-c.mp4', '/');
        $outputPath = $disk->path($outputRelative);

        $compressed = $this->run($ffmpeg, [
            '-y',
            '-i', $sourcePath,
            '-vf', "scale='min(720,iw)':-2",
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '28',
            '-c:a', 'aac',
            '-b:a', '96k',
            '-movflags', '+faststart',
            $outputPath,
        ], 300);

        if (! $compressed || ! is_file($outputPath) || filesize($outputPath) === 0) {
            @unlink($outputPath);
            Log::warning('Story video compression failed; keeping the original file.', [
                'story_id' => $story->id,
            ]);
            $this->markProcessed($story);

            return;
        }

        $thumbnailRelative = $this->generateThumbnail($ffmpeg, $disk, $outputPath, $baseName, seekSecond: true);

        $disk->delete($story->media_path);

        $story->forceFill([
            'media_path' => $outputRelative,
            'thumbnail_path' => $thumbnailRelative,
            'media_processed_at' => now(),
        ])->saveQuietly();
    }

    protected function generateThumbnail(
        string $ffmpeg,
        $disk,
        string $inputPath,
        string $baseName,
        bool $seekSecond,
    ): ?string {
        $thumbnailRelative = 'stories/thumbnails/'.$baseName.'.jpg';
        $thumbnailPath = $disk->path($thumbnailRelative);

        if (! is_dir(dirname($thumbnailPath))) {
            @mkdir(dirname($thumbnailPath), 0775, true);
        }

        $arguments = ['-y'];

        if ($seekSecond) {
            $arguments = [...$arguments, '-ss', '1'];
        }

        $created = $this->run($ffmpeg, [
            ...$arguments,
            '-i', $inputPath,
            '-frames:v', '1',
            '-vf', "scale='min(320,iw)':-2",
            '-q:v', '4',
            $thumbnailPath,
        ], 60);

        if (! $created || ! is_file($thumbnailPath) || filesize($thumbnailPath) === 0) {
            @unlink($thumbnailPath);

            return null;
        }

        return $thumbnailRelative;
    }

    protected function run(string $binary, array $arguments, int $timeout): bool
    {
        $process = new Process([$binary, ...$arguments]);
        $process->setTimeout($timeout);

        try {
            $process->run();
        } catch (\Throwable $exception) {
            Log::warning('Story media processing command failed.', [
                'message' => $exception->getMessage(),
            ]);

            return false;
        }

        return $process->isSuccessful();
    }

    protected function markProcessed(Story $story): void
    {
        $story->forceFill(['media_processed_at' => now()])->saveQuietly();
    }

    protected function ffmpegBinary(): ?string
    {
        $configured = config('services.ffmpeg.path');

        if ($configured) {
            return is_executable($configured) ? $configured : null;
        }

        return (new ExecutableFinder)->find('ffmpeg');
    }
}
