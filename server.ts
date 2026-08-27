import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { initDb, getDb, saveDb } from './src/server/db';
import { Subject, CO, Topic, Resource } from './src/types';

const DATA_DIR = process.env.DATA_DIR || process.cwd();
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  initDb();

  app.use(express.json({ limit: '10mb' }));
  app.use(cors());

  app.use((req, res, next) => {
    if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- SUBJECTS ---
  app.get('/api/subjects', (req, res) => {
    res.json(getDb().subjects);
  });

  app.post('/api/subjects', (req, res) => {
    const db = getDb();
    const newSubject: Subject = {
      ...req.body,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.subjects.push(newSubject);
    saveDb(db);
    res.status(201).json(newSubject);
  });

  app.put('/api/subjects/:id', (req, res) => {
    const db = getDb();
    const index = db.subjects.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Subject not found' });
    db.subjects[index] = { ...db.subjects[index], ...req.body, updated_at: new Date().toISOString() };
    saveDb(db);
    res.json(db.subjects[index]);
  });

  app.delete('/api/subjects/:id', (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.subjects = db.subjects.filter(s => s.id !== id);
    // Cascade delete
    db.cos = db.cos.filter(co => co.subject_id !== id);
    db.topics = db.topics.filter(t => t.subject_id !== id);
    db.resources = db.resources.filter(r => r.subject_id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // --- COs ---
  app.get('/api/cos/:subjectId', (req, res) => {
    const db = getDb();
    const cos = db.cos.filter(co => co.subject_id === req.params.subjectId).sort((a,b) => a.display_order - b.display_order);
    res.json(cos);
  });

  app.post('/api/cos', (req, res) => {
    const db = getDb();
    const newCo: CO = { ...req.body, id: uuidv4() };
    db.cos.push(newCo);
    saveDb(db);
    res.status(201).json(newCo);
  });

  app.put('/api/cos/:id', (req, res) => {
    const db = getDb();
    const index = db.cos.findIndex(co => co.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'CO not found' });
    db.cos[index] = { ...db.cos[index], ...req.body };
    saveDb(db);
    res.json(db.cos[index]);
  });

  app.delete('/api/cos/:id', (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.cos = db.cos.filter(co => co.id !== id);
    // Cascade
    db.topics = db.topics.filter(t => t.co_id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // --- TOPICS ---
  app.get('/api/topics/:coId', (req, res) => {
    const db = getDb();
    const topics = db.topics.filter(t => t.co_id === req.params.coId).sort((a,b) => a.display_order - b.display_order);
    res.json(topics);
  });

  app.post('/api/topics', (req, res) => {
    const db = getDb();
    const newTopic: Topic = { ...req.body, id: uuidv4() };
    db.topics.push(newTopic);
    saveDb(db);
    res.status(201).json(newTopic);
  });

  app.put('/api/topics/:id', (req, res) => {
    const db = getDb();
    const index = db.topics.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Topic not found' });
    db.topics[index] = { ...db.topics[index], ...req.body };
    saveDb(db);
    res.json(db.topics[index]);
  });

  app.delete('/api/topics/:id', (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.topics = db.topics.filter(t => t.id !== id);
    db.resources = db.resources.filter(r => r.topic_id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // --- RESOURCES ---
  app.get('/api/resources/:topicId', (req, res) => {
    const db = getDb();
    const resources = db.resources.filter(r => r.topic_id === req.params.topicId).sort((a,b) => a.display_order - b.display_order);
    res.json(resources);
  });

  app.post('/api/resources', (req, res) => {
    const db = getDb();
    const newResource: Resource = { ...req.body, id: uuidv4(), created_at: new Date().toISOString() };
    db.resources.push(newResource);
    saveDb(db);
    res.status(201).json(newResource);
  });
  
  app.put('/api/resources/:id', (req, res) => {
    const db = getDb();
    const index = db.resources.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Resource not found' });
    db.resources[index] = { ...db.resources[index], ...req.body };
    saveDb(db);
    res.json(db.resources[index]);
  });

  app.delete('/api/resources/:id', (req, res) => {
    const db = getDb();
    const id = req.params.id;
    
    // Optionally delete file from disk
    const resource = db.resources.find(r => r.id === id);
    if (resource && resource.file_url.startsWith('/uploads/')) {
       const filePath = path.join(DATA_DIR, resource.file_url);
       if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
       }
    }

    db.resources = db.resources.filter(r => r.id !== id);
    saveDb(db);
    res.json({ success: true });
  });

  // --- FILE UPLOADS ---
  app.post('/api/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      fileUrl, 
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size
    });
  });

  // Full nested data endpoint for frontend convenience (optional but useful for initial load)
  app.get('/api/full-subjects', (req, res) => {
    const db = getDb();
    const result = db.subjects.map(subject => {
      const cos = db.cos.filter(co => co.subject_id === subject.id).map(co => {
        const topics = db.topics.filter(t => t.co_id === co.id).map(t => {
          const resources = db.resources.filter(r => r.topic_id === t.id);
          return { ...t, resources };
        });
        return { ...co, topics };
      });
      return { ...subject, cos };
    });
    res.json(result);
  });

  // 3. Vite Development Middleware & Production Static Serving
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Boot Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Open API server running on port ${PORT}`);
  });
}

startServer();
