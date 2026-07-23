module.exports = {
    apps: [
        {
            name: 'jobing-web',
            script: 'app.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            // Auto-restart if memory exceeds 512MB
            max_memory_restart: '512M',
            // Log configuration
            error_file: 'logs/web-error.log',
            out_file: 'logs/web-out.log',
            merge_logs: true,
            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 3000,
        },
        {
            name: 'jobing-telegram',
            script: 'telegram-worker.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '256M',
            error_file: 'logs/telegram-error.log',
            out_file: 'logs/telegram-out.log',
            // Auto-restart on crash without delay
            autorestart: true,
        },
    ]
};
