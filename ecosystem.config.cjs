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
            max_memory_restart: '512M',
            error_file: 'logs/web-error.log',
            out_file: 'logs/web-out.log',
            merge_logs: true,
            kill_timeout: 5000,
            listen_timeout: 3000,
        },
    ]
};
