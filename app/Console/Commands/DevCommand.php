<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class DevCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dev
        {--host=127.0.0.1 : Host the application server binds to}
        {--port=8000 : Port the application server listens on}
        {--no-queue : Do not run the queue worker}
        {--no-logs : Do not tail the application log}
        {--no-vite : Do not run Vite at all}
        {--build : Watch with "vite build --watch" instead of the Vite dev server}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the local development stack (server, queue, logs, Vite) with file watching';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $processes = $this->buildProcesses();

        if ($processes === []) {
            $this->components->error(__('Nothing to run — every process was disabled.'));

            return self::FAILURE;
        }

        $concurrently = base_path('node_modules/.bin/concurrently');

        if (! file_exists($concurrently)) {
            $this->components->error(__('concurrently is not installed. Run "npm install" first.'));

            return self::FAILURE;
        }

        $this->components->info(__('Starting the development stack. Press Ctrl+C to stop.'));
        foreach ($processes as $process) {
            $this->line(sprintf('  <fg=gray>%-6s</> %s', $process['name'], $process['command']));
        }
        $this->newLine();

        return $this->runConcurrently($concurrently, $processes);
    }

    /**
     * Build the list of processes to run, in the order they should start.
     *
     * @return array<int, array{name: string, color: string, command: string}>
     */
    protected function buildProcesses(): array
    {
        $processes = [
            [
                'name' => 'server',
                'color' => '#93c5fd',
                'command' => sprintf(
                    'php artisan serve --host=%s --port=%s',
                    $this->option('host'),
                    $this->option('port'),
                ),
            ],
        ];

        if (! $this->option('no-queue')) {
            $processes[] = [
                'name' => 'queue',
                'color' => '#c4b5fd',
                'command' => 'php artisan queue:listen --tries=1 --timeout=0',
            ];
        }

        if (! $this->option('no-logs')) {
            $processes[] = [
                'name' => 'logs',
                'color' => '#fb7185',
                'command' => 'php artisan pail --timeout=0',
            ];
        }

        if (! $this->option('no-vite')) {
            $processes[] = [
                'name' => 'vite',
                'color' => '#fdba74',
                'command' => $this->option('build') ? 'npm run build:watch' : 'npm run dev',
            ];
        }

        return $processes;
    }

    /**
     * Run every process through concurrently and stream its output.
     *
     * @param  array<int, array{name: string, color: string, command: string}>  $processes
     */
    protected function runConcurrently(string $concurrently, array $processes): int
    {
        $command = [
            $concurrently,
            '--kill-others',
            '--names', implode(',', array_column($processes, 'name')),
            '-c', implode(',', array_column($processes, 'color')),
            ...array_column($processes, 'command'),
        ];

        $process = new Process($command, base_path());
        $process->setTimeout(null);

        $this->forwardSignals($process);

        if (Process::isTtySupported() && $this->input->isInteractive()) {
            $process->setTty(true);
            $process->run();

            return (int) $process->getExitCode();
        }

        $process->run(fn (string $type, string $buffer) => $this->output->write($buffer));

        return (int) $process->getExitCode();
    }

    /**
     * Kill the child stack when this command is interrupted.
     */
    protected function forwardSignals(Process $process): void
    {
        if (! function_exists('pcntl_async_signals')) {
            return;
        }

        pcntl_async_signals(true);

        foreach ([SIGINT, SIGTERM] as $signal) {
            pcntl_signal($signal, function () use ($process) {
                $process->stop(0);

                exit(0);
            });
        }
    }
}
