import { disconnectDatabase } from '../Core/Database/index.js';
import { migrateDown, migrateToLatest, migrationStatus } from '../Core/Database/Migrator.js';
import { logger } from '../Core/Logger.js';

const commands = {
  up: migrateToLatest,
  down: migrateDown,
  status: migrationStatus,
} as const;

type Command = keyof typeof commands;

const command = (process.argv[2] ?? 'up') as Command;

if (!(command in commands)) {
  console.error(`Unknown command: ${command}. Use one of: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

try {
  await commands[command]();
} catch (error) {
  logger.error({ err: error }, 'Migration command failed');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
