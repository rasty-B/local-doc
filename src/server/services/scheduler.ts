import { CronJob } from 'cron';
import { watch } from 'chokidar';
import { join } from 'path';
import { Database } from 'better-sqlite3';
import { processDirectory } from './indexer';

export class SchedulerService {
  private jobs: Map<string, CronJob> = new Map();
  private watchers: Map<string, ReturnType<typeof watch>> = new Map();
  private db: Database;

  constructor(db: Database) {
    this.db = db;
    this.initializeSchedules();
  }

  private async initializeSchedules() {
    const schedules = this.db.prepare('SELECT * FROM schedules WHERE enabled = 1').all();
    
    for (const schedule of schedules) {
      this.createJob(schedule);
    }
  }

  private createJob(schedule: any) {
    const paths = this.db.prepare('SELECT path FROM schedule_paths WHERE schedule_id = ?')
      .all(schedule.id)
      .map(row => row.path);

    // Create cron job
    const job = new CronJob(schedule.cron_expression, async () => {
      try {
        for (const path of paths) {
          await processDirectory(path, schedule.project_id);
        }

        this.db.prepare(`
          UPDATE schedules 
          SET last_run = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(schedule.id);
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error);
      }
    });

    this.jobs.set(schedule.id, job);
    job.start();

    // Set up file watchers if needed
    for (const path of paths) {
      const watcher = watch(path, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      watcher.on('change', async (path) => {
        await processDirectory(path, schedule.project_id);
      });

      this.watchers.set(path, watcher);
    }
  }

  public addSchedule(schedule: any) {
    this.db.prepare(`
      INSERT INTO schedules (id, project_id, name, cron_expression, enabled)
      VALUES (?, ?, ?, ?, ?)
    `).run(schedule.id, schedule.projectId, schedule.name, schedule.cronExpression, 1);

    for (const path of schedule.paths) {
      this.db.prepare(`
        INSERT INTO schedule_paths (schedule_id, path)
        VALUES (?, ?)
      `).run(schedule.id, path);
    }

    this.createJob(schedule);
  }

  public removeSchedule(scheduleId: string) {
    const job = this.jobs.get(scheduleId);
    if (job) {
      job.stop();
      this.jobs.delete(scheduleId);
    }

    // Clean up watchers
    const paths = this.db.prepare('SELECT path FROM schedule_paths WHERE schedule_id = ?')
      .all(scheduleId)
      .map(row => row.path);

    for (const path of paths) {
      const watcher = this.watchers.get(path);
      if (watcher) {
        watcher.close();
        this.watchers.delete(path);
      }
    }

    this.db.prepare('DELETE FROM schedules WHERE id = ?').run(scheduleId);
    this.db.prepare('DELETE FROM schedule_paths WHERE schedule_id = ?').run(scheduleId);
  }

  public updateSchedule(schedule: any) {
    this.removeSchedule(schedule.id);
    this.addSchedule(schedule);
  }

  public cleanup() {
    for (const job of this.jobs.values()) {
      job.stop();
    }
    for (const watcher of this.watchers.values()) {
      watcher.close();
    }
  }
}