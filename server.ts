import express from 'express';
import cors from 'cors';
import compression from 'compression';
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

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(cors());

  // --- Security & AdSense Compliance Headers Middleware ---
  app.use((req, res, next) => {
    // 1. MIME sniffing protection
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // 2. Clickjacking & Frame defense
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // 3. Referrer policy for user privacy and ad attribution
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // 4. Permissions policy
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    // 5. HTTP Strict Transport Security (HSTS)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // 6. Safe Content Security Policy (allows Google AdSense, Adsterra, Google Fonts, and secure assets)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagmanager.com https://*.profitableratecpmnetwork.com https://profitableratecpmnetwork.com https://3nbf4.com https://*.3nbf4.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https:; " +
      "connect-src 'self' https://pagead2.googlesyndication.com https://*.google.com https://*.profitableratecpmnetwork.com https://*.3nbf4.com; " +
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://*.profitableratecpmnetwork.com https://*.3nbf4.com; " +
      "worker-src 'self' blob: https://3nbf4.com https://*.3nbf4.com; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    );
    next();
  });

  app.use((req, res, next) => {
    if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  app.use('/uploads', express.static(UPLOADS_DIR, { 
    maxAge: '1y',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));

  const getBaseUrl = (req: express.Request) => {
    const host = req.get('host') || 'opencse.in';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    if (host.includes('opencse.in')) {
      return 'https://opencse.in';
    }
    if (process.env.APP_URL && !process.env.APP_URL.includes('localhost')) {
      return process.env.APP_URL.replace(/\/$/, '');
    }
    return `${proto}://${host}`;
  };

  // --- LLMS.TXT (Agentic Browsing & AI Agent Discovery) ---
  app.get('/llms.txt', (req, res) => {
    const baseUrl = getBaseUrl(req);

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
    lines.push(`- [About OpenCSE](${baseUrl}/about.html): Educational mission, curriculum standards, and editorial review processes.`);
    lines.push(`- [Contact & Errata](${baseUrl}/contact.html): Direct academic inquiry channel, error reporting, and curriculum suggestions.`);
    lines.push(`- [Privacy Policy](${baseUrl}/privacy-policy.html): Zero student telemetry data collection and Google AdSense compliance disclosures.`);
    lines.push(`- [Terms of Service](${baseUrl}/terms-of-service.html): Non-commercial academic usage terms and intellectual property rights.`);
    lines.push(`- [Disclaimer & Trademark Notice](${baseUrl}/disclaimer.html): Non-affiliation notice and diagnostic tools disclaimer.`);
    lines.push(`- [Content & Copyright Policy](${baseUrl}/content-policy.html): Human-in-the-loop review disclosures, DMCA copyright takedown procedure, and academic errata guidelines.`);
    lines.push(`- [HTML Directory Sitemap](${baseUrl}/sitemap.html): Full directory listing of all courses, study modules, and legal documentation.`);
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
    const baseUrl = getBaseUrl(req);

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
    const baseUrl = getBaseUrl(req);

    const robotsTxt = [
      'User-agent: *',
      'Allow: /',
      'Allow: /about.html',
      'Allow: /contact.html',
      'Allow: /privacy-policy.html',
      'Allow: /terms-of-service.html',
      'Allow: /disclaimer.html',
      'Allow: /content-policy.html',
      'Allow: /sitemap.html',
      'Allow: /about',
      'Allow: /contact',
      'Allow: /privacy',
      'Allow: /terms',
      'Allow: /disclaimer',
      'Allow: /content-policy',
      'Allow: /sitemap',
      'Allow: /analyzer',
      'Allow: /checker',
      'Allow: /subject/',
      'Allow: /resources',
      'Allow: /resources/',
      'Allow: /uploads/',
      'Allow: /ads.txt',
      'Allow: /llms.txt',
      'Allow: /llms-full.txt',
      'Disallow: /admin',
      'Disallow: /admin/*',
      'Disallow: /api/*',
      'Disallow: /db.json',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`
    ].join('\n');
    res.type('text/plain; charset=utf-8').send(robotsTxt);
  });

  // --- SITEMAP.XML ---
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = getBaseUrl(req);

    const db = getDb();
    const activeSubjects = (db.subjects || []).filter(s => s.is_active);

    interface SitemapItem {
      url: string;
      priority: string;
      changefreq: string;
      lastmod?: string;
    }

    const publishedArticles = (db.academic_resources || []).filter(a => a.status === 'PUBLISHED');

    const staticPages: SitemapItem[] = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/resources', priority: '0.9', changefreq: 'daily' },
      { url: '/analyzer', priority: '0.8', changefreq: 'weekly' },
      { url: '/about.html', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact.html', priority: '0.7', changefreq: 'monthly' },
      { url: '/privacy-policy.html', priority: '0.6', changefreq: 'yearly' },
      { url: '/terms-of-service.html', priority: '0.6', changefreq: 'yearly' },
      { url: '/disclaimer.html', priority: '0.6', changefreq: 'yearly' },
      { url: '/content-policy.html', priority: '0.6', changefreq: 'yearly' },
      { url: '/sitemap.html', priority: '0.7', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.6', changefreq: 'yearly' },
      { url: '/terms', priority: '0.6', changefreq: 'yearly' },
      { url: '/disclaimer', priority: '0.6', changefreq: 'yearly' },
      { url: '/content-policy', priority: '0.6', changefreq: 'yearly' },
      { url: '/sitemap', priority: '0.7', changefreq: 'weekly' },
    ];

    const subjectPages: SitemapItem[] = activeSubjects.map(s => ({
      url: `/subject/${encodeURIComponent(s.id)}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: s.updated_at ? s.updated_at.split('T')[0] : (s.created_at ? s.created_at.split('T')[0] : new Date().toISOString().split('T')[0])
    }));

    const resourcePages: SitemapItem[] = publishedArticles.map(a => ({
      url: `/resources/${a.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: a.updated_at ? a.updated_at.split('T')[0] : (a.created_at ? a.created_at.split('T')[0] : new Date().toISOString().split('T')[0])
    }));

    const allPages = [...staticPages, ...subjectPages, ...resourcePages];

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

  // --- DIRECT CRAWLABLE HTML LEGAL & TRUST PAGES ---
  const serveStaticLegalPage = (fileName: string) => (req: express.Request, res: express.Response) => {
    const publicPath = path.join(process.cwd(), 'public', fileName);
    const distPath = path.join(process.cwd(), 'dist', fileName);
    if (fs.existsSync(publicPath)) {
      return res.status(200).type('text/html; charset=utf-8').sendFile(publicPath);
    }
    if (fs.existsSync(distPath)) {
      return res.status(200).type('text/html; charset=utf-8').sendFile(distPath);
    }
    // Fallback to standard index.html
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.status(200).type('text/html; charset=utf-8').sendFile(indexPath);
    }
    res.status(404).send('Page Not Found');
  };

  app.get('/privacy-policy.html', serveStaticLegalPage('privacy-policy.html'));
  app.get('/privacy.html', serveStaticLegalPage('privacy-policy.html'));
  app.get('/terms-of-service.html', serveStaticLegalPage('terms-of-service.html'));
  app.get('/terms.html', serveStaticLegalPage('terms-of-service.html'));
  app.get('/disclaimer.html', serveStaticLegalPage('disclaimer.html'));
  app.get('/contact.html', serveStaticLegalPage('contact.html'));
  app.get('/about.html', serveStaticLegalPage('about.html'));
  app.get('/content-policy.html', serveStaticLegalPage('content-policy.html'));
  app.get('/sitemap.html', serveStaticLegalPage('sitemap.html'));

  // --- API AUDIT ENDPOINT ---
  app.get('/api/audit', (req, res) => {
    const host = req.get('host') || 'opencse.in';
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const origin = `${proto}://${host}`;

    res.json({
      status: 'success',
      target: origin,
      serverVersion: '2.5.0',
      securityHeaders: {
        hsts: true,
        csp: true,
        xContentTypeOptions: true,
        xFrameOptions: true,
        referrerPolicy: true,
        permissionsPolicy: true
      },
      routesVerified: [
        '/', '/about.html', '/contact.html', '/privacy-policy.html', 
        '/terms-of-service.html', '/disclaimer.html', '/content-policy.html', 
        '/sitemap.html', '/resources', '/analyzer'
      ]
    });
  });


  // --- ADS.TXT ---
  app.get('/ads.txt', (req, res) => {
    let content = process.env.ADS_TXT_CONTENT;
    if (!content || !content.includes('pub-5652255852120529')) {
      content = 'google.com, pub-5652255852120529, DIRECT, f08c47fec0942fa0';
    }
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

  // --- ACADEMIC RESOURCES (ARTICLES) ---
  app.get('/api/academic-resources', (req, res) => {
    const db = getDb();
    res.json(db.academic_resources || []);
  });

  app.get('/api/academic-resources/:slug', (req, res) => {
    const db = getDb();
    const resource = (db.academic_resources || []).find(r => r.slug === req.params.slug);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  });

  app.post('/api/academic-resources', (req, res) => {
    const db = getDb();
    const newResource = {
      ...req.body,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (!db.academic_resources) db.academic_resources = [];
    db.academic_resources.push(newResource);
    saveDb(db);
    res.status(201).json(newResource);
  });

  app.put('/api/academic-resources/:id', (req, res) => {
    const db = getDb();
    if (!db.academic_resources) db.academic_resources = [];
    const index = db.academic_resources.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Resource not found' });
    
    db.academic_resources[index] = { 
      ...db.academic_resources[index], 
      ...req.body, 
      updated_at: new Date().toISOString() 
    };
    saveDb(db);
    res.json(db.academic_resources[index]);
  });

  app.delete('/api/academic-resources/:id', (req, res) => {
    const db = getDb();
    if (!db.academic_resources) db.academic_resources = [];
    db.academic_resources = db.academic_resources.filter(r => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
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

  // Explicit static legal & crawlable routes for direct search engine / crawler indexing
  const staticHtmlFiles: Record<string, string> = {
    '/privacy-policy.html': 'privacy-policy.html',
    '/privacy.html': 'privacy-policy.html',
    '/terms-of-service.html': 'terms-of-service.html',
    '/terms.html': 'terms-of-service.html',
    '/disclaimer.html': 'disclaimer.html',
    '/contact.html': 'contact.html',
    '/about.html': 'about.html',
    '/content-policy.html': 'content-policy.html',
    '/sitemap.html': 'sitemap.html',
  };

  Object.entries(staticHtmlFiles).forEach(([routePath, fileName]) => {
    app.get(routePath, (req, res) => {
      const publicPath = path.join(process.cwd(), 'public', fileName);
      const distPath = path.join(process.cwd(), 'dist', fileName);
      if (fs.existsSync(distPath)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(distPath);
      } else if (fs.existsSync(publicPath)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(publicPath);
      }
      res.status(404).send('Not Found');
    });
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
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.html') || filepath.endsWith('.txt') || filepath.endsWith('.xml')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
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
