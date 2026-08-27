import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DB, Subject, CO, Topic, Resource } from '../types';
import { INITIAL_DATA } from '../data';

const DATA_DIR = process.env.DATA_DIR || process.cwd();
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultDb: DB = {
  subjects: [],
  cos: [],
  topics: [],
  resources: []
};

// Migration script
function migrateLegacyData(legacyData: any[]): DB {
  const db: DB = { subjects: [], cos: [], topics: [], resources: [] };
  const now = new Date().toISOString();

  legacyData.forEach(s => {
    const subjectId = s.id || uuidv4();
    db.subjects.push({
      id: subjectId,
      name: s.title || 'Untitled Subject',
      code: s.code || '',
      description: s.description || '',
      semester: '',
      department: '',
      credits: 3,
      academic_year: '2nd',
      is_active: true,
      created_at: now,
      updated_at: now
    });

    let coDisplayOrder = 1;
    (s.cos || []).forEach((co: any) => {
      const coId = co.id || uuidv4();
      db.cos.push({
        id: coId,
        subject_id: subjectId,
        code: co.title?.split(':')[0] || `CO${coDisplayOrder}`,
        name: co.title?.split(':').slice(1).join(':').trim() || co.title || '',
        description: '',
        display_order: coDisplayOrder++
      });

      let topicDisplayOrder = 1;
      (co.topics || []).forEach((topic: any) => {
        const topicId = topic.id || uuidv4();
        db.topics.push({
          id: topicId,
          subject_id: subjectId,
          co_id: coId,
          title: topic.title || '',
          description: '',
          content: topic.content || '',
          display_order: topicDisplayOrder++
        });

        if (topic.resources) {
          if (topic.resources.ppt && topic.resources.ppt !== '#') {
            db.resources.push({
              id: uuidv4(),
              subject_id: subjectId,
              topic_id: topicId,
              title: 'Presentation',
              description: '',
              file_name: 'Presentation.pptx',
              file_url: topic.resources.ppt,
              file_type: 'PPTX',
              mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              file_size: 0,
              display_order: 1,
              created_at: now
            });
          }
          if (topic.resources.pdf && topic.resources.pdf !== '#') {
            db.resources.push({
              id: uuidv4(),
              subject_id: subjectId,
              topic_id: topicId,
              title: 'Study Module',
              description: '',
              file_name: 'Study_Module.pdf',
              file_url: topic.resources.pdf,
              file_type: 'PDF',
              mime_type: 'application/pdf',
              file_size: 0,
              display_order: 2,
              created_at: now
            });
          }
        }
      });
    });
  });

  return db;
}

export function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = migrateLegacyData(INITIAL_DATA);
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
  } else {
    // Check if it's the old schema
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (Array.isArray(data)) {
        // Needs migration
        const migrated = migrateLegacyData(data);
        fs.writeFileSync(DB_FILE, JSON.stringify(migrated, null, 2), 'utf8');
        console.log('Database migrated to normalized schema successfully.');
      } else if (!data.subjects || !data.cos || !data.topics) {
        // Corrupted or different format, reset to default
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
      }
    } catch (e) {
      console.error('Error reading db.json, creating new one.', e);
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
    }
  }
}

export function getDb(): DB {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read DB:', err);
    return defaultDb;
  }
}

export function saveDb(data: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write DB:', err);
  }
}
