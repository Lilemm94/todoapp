CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    note TEXT,
    completed INTEGER DEFAULT 0
);

-- Dữ liệu mẫu ban đầu
INSERT INTO tasks (title, date, priority, note, completed) VALUES
('Hoàn thiện TODO App kết nối Database', date('now', 'localtime'), 'high', 'Nộp bài trên GitHub', 0),
('Xây dựng REST API bằng Node.js', date('now', 'localtime'), 'medium', 'GET, POST, PUT, DELETE', 1);