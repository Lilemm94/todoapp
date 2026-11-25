const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const port = 3000;

// 1. Kết nối & khởi tạo Database SQLite tích hợp sẵn
const db = new DatabaseSync('./todo.db');
console.log('Đã kết nối Database SQLite (todo.db)');

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        priority TEXT DEFAULT 'medium',
        note TEXT,
        completed INTEGER DEFAULT 0
    )
`);

// Chèn dữ liệu mẫu nếu bảng đang trống
const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (row && row.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    const insert = db.prepare('INSERT INTO tasks (title, date, priority, note, completed) VALUES (?, ?, ?, ?, ?)');
    insert.run('Hoàn thiện TODO App Full-stack', today, 'high', 'Kết nối Node.js với SQLite', 0);
    insert.run('Tạo file README.md và push GitHub', today, 'medium', 'Mô tả đầy đủ chức năng', 1);
}

// Hàm đọc dữ liệu JSON từ Frontend gửi lên
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch (e) { reject(e); }
        });
    });
}

// 2. Tạo HTTP Server xử lý Giao diện & API Database
const server = http.createServer(async (req, res) => {
    const urlParts = req.url.split('/');

    // Trả về giao diện index.html
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Lỗi không tìm thấy index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
        return;
    }

    // API: Lấy danh sách tasks (GET /api/tasks)
    if (req.method === 'GET' && req.url === '/api/tasks') {
        const rows = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
        const formatted = rows.map(r => ({ ...r, completed: Boolean(r.completed) }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(formatted));
        return;
    }

    // API: Thêm task mới (POST /api/tasks)
    if (req.method === 'POST' && req.url === '/api/tasks') {
        const data = await parseBody(req);
        const result = db.prepare(
            'INSERT INTO tasks (title, date, priority, note, completed) VALUES (?, ?, ?, ?, 0)'
        ).run(data.title, data.date, data.priority || 'medium', data.note || '');
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: Number(result.lastInsertRowid), ...data, completed: false }));
        return;
    }

    // API: Cập nhật task (PUT /api/tasks/:id)
    if (req.method === 'PUT' && urlParts[1] === 'api' && urlParts[2] === 'tasks' && urlParts[3]) {
        const id = Number(urlParts[3]);
        const data = await parseBody(req);
        const result = db.prepare(
            'UPDATE tasks SET title = ?, date = ?, priority = ?, note = ?, completed = ? WHERE id = ?'
        ).run(data.title, data.date, data.priority, data.note || '', data.completed ? 1 : 0, id);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ updated: result.changes }));
        return;
    }

    // API: Xóa task (DELETE /api/tasks/:id)
    if (req.method === 'DELETE' && urlParts[1] === 'api' && urlParts[2] === 'tasks' && urlParts[3]) {
        const id = Number(urlParts[3]);
        const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ deleted: result.changes }));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(port, () => {
    console.log(`Server Full-stack running at http://localhost:${port}`);
});