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
  const PORT = Number(process.env.PORT) || 3000;

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

  // --- LLMS.TXT (Agentic Browsing & AI Agent Discovery) ---
  app.get('/llms.txt', (req, res) => {
    const host = req.get('host') || 'opencse.org';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('localhost') 
      ? process.env.APP_URL.replace(/\/$/, '') 
      : `${proto}://${host}`;

    const db = getDb();
    const activeSubjects = (db.subjects || []).filter(s => s.is_active);

    const lines = [
      '# OpenCSE',
      '',
      '> Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students.',
      '',
      'OpenCSE is an open, structured academic platform organizing Computer Science curricula into Outcome-Based Education (OBE) course outcomes (CO1-CO5), comprehensive topic study notes, and supplemental slide decks.',
      '',
      '## Academic Curricula & Subjects',
      ''
    ];

    activeSubjects.forEach(s => {
      const cleanDesc = (s.description || 'Core Computer Science curriculum course')
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      lines.push(`- [${s.name} (${s.code})](${baseUrl}/subject/${encodeURIComponent(s.id)}): ${cleanDesc.slice(0, 140)} (Credits: ${s.credits}, Year: ${s.academic_year})`);
    });

    lines.push('');
    lines.push('## Institutional & Editorial Pages');
    lines.push('');
    lines.push(`- [About OpenCSE](${baseUrl}/about): Educational mission, curriculum standards, and editorial review processes.`);
    lines.push(`- [Contact & Errata](${baseUrl}/contact): Direct academic inquiry channel, error reporting, and curriculum suggestions.`);
    lines.push(`- [Privacy Policy](${baseUrl}/privacy): Zero student telemetry data collection and Google AdSense compliance disclosures.`);
    lines.push(`- [Terms of Service](${baseUrl}/terms): Non-commercial academic usage terms and intellectual property rights.`);
    lines.push(`- [Content & Copyright Policy](${baseUrl}/content-policy): Human-in-the-loop review disclosures, DMCA copyright takedown procedure, and academic errata guidelines.`);
    lines.push('');
    lines.push('## Machine-Readable Data Feeds');
    lines.push('');
    lines.push(`- [Full Curriculum Text (llms-full.txt)](${baseUrl}/llms-full.txt): Complete syllabus text and topic breakdowns for AI agents.`);
    lines.push(`- [Sitemap XML](${baseUrl}/sitemap.xml): XML sitemap of all indexed courses and pages.`);
    lines.push(`- [Curriculum API JSON](${baseUrl}/api/full-subjects): Real-time JSON dataset of active courses, COs, and study materials.`);
    lines.push(`- [Platform Configuration](${baseUrl}/api/config): Public platform settings and contact routing.`);

    res.type('text/plain; charset=utf-8').send(lines.join('\n'));
  });

  // --- LLMS-FULL.TXT ---
  app.get('/llms-full.txt', (req, res) => {
    const host = req.get('host') || 'opencse.org';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('localhost') 
      ? process.env.APP_URL.replace(/\/$/, '') 
      : `${proto}://${host}`;

    const db = getDb();
    const activeSubjects = (db.subjects || []).filter(s => s.is_active);

    const lines = [
      '# OpenCSE — Complete Academic Curriculum Repository',
      '',
      `URL: ${baseUrl}`,
      'Platform: OpenCSE (Knowledge Without Barriers)',
      'Audience: Computer Science & Engineering Students and Faculty',
      'Format: Outcome-Based Education (OBE) Curriculum Mapping',
      ''
    ];

    activeSubjects.forEach(subject => {
      lines.push(`================================================================================`);
      lines.push(`## ${subject.name} [${subject.code}]`);
      lines.push(`Year: ${subject.academic_year} Year | Credits: ${subject.credits} | Department: ${subject.department || 'Computer Science'}`);
      lines.push(`URL: ${baseUrl}/subject/${encodeURIComponent(subject.id)}`);
      if (subject.description) {
        const cleanDesc = subject.description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        lines.push(`Overview: ${cleanDesc}`);
      }
      lines.push('');

      const cos = db.cos.filter(co => co.subject_id === subject.id).sort((a, b) => a.display_order - b.display_order);
      cos.forEach(co => {
        lines.push(`### Course Outcome: ${co.code} — ${co.name}`);
        if (co.description) lines.push(`Description: ${co.description}`);
        lines.push('');

        const topics = db.topics.filter(t => t.co_id === co.id).sort((a, b) => a.display_order - b.display_order);
        topics.forEach(topic => {
          lines.push(`#### Topic: ${topic.title}`);
          if (topic.description) lines.push(`Summary: ${topic.description}`);
          if (topic.content) {
            const cleanContent = topic.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            lines.push(`Notes: ${cleanContent.slice(0, 500)}...`);
          }
          const resources = db.resources.filter(r => r.topic_id === topic.id);
          if (resources.length > 0) {
            lines.push(`Resources:`);
            resources.forEach(r => {
              lines.push(`  - [${r.file_type}] ${r.title}: ${baseUrl}${r.file_url}`);
            });
          }
          lines.push('');
        });
      });
    });

    res.type('text/plain; charset=utf-8').send(lines.join('\n'));
  });

  // --- ROBOTS.TXT ---
  app.get('/robots.txt', (req, res) => {
    const host = req.get('host') || 'opencse.org';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = `${proto}://${host}`;
    const robotsTxt = [
      'User-agent: *',
      'Allow: /',
      'Allow: /about',
      'Allow: /contact',
      'Allow: /privacy',
      'Allow: /terms',
      'Allow: /content-policy',
      'Allow: /subject/',
      'Allow: /uploads/',
      'Disallow: /admin',
      'Disallow: /admin/*',
      'Disallow: /api/*',
      'Disallow: /db.json',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`
    ].join('\n');
    res.type('text/plain').send(robotsTxt);
  });

  // --- SITEMAP.XML ---
  app.get('/sitemap.xml', (req, res) => {
    const host = req.get('host') || 'opencse.org';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const baseUrl = process.env.APP_URL && !process.env.APP_URL.includes('localhost') 
      ? process.env.APP_URL.replace(/\/$/, '') 
      : `${proto}://${host}`;

    const db = getDb();
    const activeSubjects = (db.subjects || []).filter(s => s.is_active);

    interface SitemapItem {
      url: string;
      priority: string;
      changefreq: string;
      lastmod?: string;
    }

    const staticPages: SitemapItem[] = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
      { url: '/terms', priority: '0.5', changefreq: 'yearly' },
      { url: '/content-policy', priority: '0.6', changefreq: 'yearly' },
    ];

    const subjectPages: SitemapItem[] = activeSubjects.map(s => ({
      url: `/subject/${encodeURIComponent(s.id)}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: s.updated_at ? s.updated_at.split('T')[0] : (s.created_at ? s.created_at.split('T')[0] : new Date().toISOString().split('T')[0])
    }));

    const allPages = [...staticPages, ...subjectPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // --- ADS.TXT ---
  app.get('/ads.txt', (req, res) => {
    const content = process.env.ADS_TXT_CONTENT || '# ads.txt - OpenCSE';
    res.type('text/plain').send(content);
  });

  // --- PUBLIC SAFE CONFIG ---
  app.get('/api/config', (req, res) => {
    res.json({
      contactEmail: process.env.CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL || '',
      appUrl: process.env.APP_URL || ''
    });
  });

  // --- ADMIN AUTH VERIFY ---
  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    if (password && password === adminPassword) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  });

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
    
    // Optionally delete file from disk securely
    const resource = db.resources.find(r => r.id === id);
    if (resource && resource.file_url && resource.file_url.startsWith('/uploads/')) {
       const fileNameOnly = path.basename(resource.file_url);
       const safeFilePath = path.join(UPLOADS_DIR, fileNameOnly);
       if (fs.existsSync(safeFilePath) && safeFilePath.startsWith(UPLOADS_DIR)) {
          try { fs.unlinkSync(safeFilePath); } catch (e) {}
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
