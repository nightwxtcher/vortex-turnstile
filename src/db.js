import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'results.db');

const PRAGMA_SETTINGS = [
    "PRAGMA journal_mode=WAL",
    "PRAGMA synchronous=NORMAL", 
    "PRAGMA cache_size=10000",
    "PRAGMA temp_store=MEMORY",
    "PRAGMA busy_timeout=30000"
];

async function getDb() {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
    for (const pragma of PRAGMA_SETTINGS) {
        await db.exec(pragma);
    }
    return db;
}

export async function initDb() {
    try {
        const db = await getDb();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS results (
                task_id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.close();
        console.log(`[DB] Database initialized in WAL mode: ${DB_PATH}`);
    } catch (e) {
        console.error(`[DB] Database initialization error: ${e.message}`);
        throw e;
    }
}

export async function saveResult(taskId, taskType, data) {
    try {
        const db = await getDb();
        const dataJson = typeof data === 'object' ? JSON.stringify(data) : data;
        await db.run(
            "REPLACE INTO results (task_id, type, data) VALUES (?, ?, ?)",
            [taskId, taskType, dataJson]
        );
        await db.close();
    } catch (e) {
        console.error(`[DB] Error saving result ${taskId}: ${e.message}`);
        throw e;
    }
}

export async function loadResult(taskId) {
    try {
        const db = await getDb();
        const row = await db.get("SELECT data FROM results WHERE task_id = ?", [taskId]);
        await db.close();
        if (row) {
            try {
                return JSON.parse(row.data);
            } catch (e) {
                return row.data;
            }
        }
        return null;
    } catch (e) {
        console.error(`[DB] Error loading result ${taskId}: ${e.message}`);
        return null;
    }
}

export async function cleanupOldResults(daysOld = 1) {
    try {
        const db = await getDb();
        const result = await db.run(
            `DELETE FROM results WHERE created_at < datetime('now', '-${daysOld} days')`
        );
        await db.close();
        console.log(`[DB] Cleaned up ${result.changes || 0} old results`);
        return result.changes || 0;
    } catch (e) {
        console.error(`[DB] Error cleaning up old results: ${e.message}`);
        return 0;
    }
}
