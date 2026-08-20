const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- データ保存用（一時メモリ） ---
let reports = [];
let chats = []; // 💬 新設：チャット保存用の箱

// ==========================================
// 📦 報告（レポート）用の窓口
// ==========================================
// ① データを見る
app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// ② データを追加する
app.post('/api/reports', (req, res) => {
    const newReport = {
        id: Date.now().toString(), // 削除する時のために一意のIDをつける
        storeName: req.body.storeName,
        dayOfWeek: req.body.dayOfWeek,
        timeOfDay: req.body.timeOfDay
    };
    reports.push(newReport);
    res.json(newReport);
});

// 🗑️ ③ データを削除する（新機能！）
app.delete('/api/reports/:id', (req, res) => {
    const idToDelete = req.params.id;
    // 指定されたID「以外」のものを残すことで削除を実現
    reports = reports.filter(report => report.id !== idToDelete);
    res.json({ message: "削除完了！" });
});

// ==========================================
// 💬 チャット用の窓口（新機能！）
// ==========================================
// ④ チャットの履歴を見る
app.get('/api/chat', (req, res) => {
    res.json(chats);
});

// ⑤ チャットを送信する
app.post('/api/chat', (req, res) => {
    const newChat = {
        id: Date.now().toString(),
        userName: req.body.userName || "ポケカ調査員",
        message: req.body.message
    };
    chats.push(newChat);
    res.json(newChat);
});

// --- サーバー起動 ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で動いています！`);
});
