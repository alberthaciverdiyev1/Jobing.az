module.exports = {
    apps: [{
        name: 'jobing-az',
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
        error_file: 'logs/pm2-error.log',
        out_file: 'logs/pm2-out.log',
        merge_logs: true,
        // Graceful shutdown
        kill_timeout: 5000,
        listen_timeout: 3000,
    }]
};
