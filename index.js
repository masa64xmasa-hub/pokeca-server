const express = require('express');
const app = express();

// Renderが指定するポート番号、またはローカル用の3000番
const PORT = process.env.PORT || 3000;

// アプリから送られてくるJSONデータを読み込むための設定
app.use(express.json());

// 一時的なデータの保存場所（※サーバーが再起動すると消えます）
let reports = [
    { id: "1", storeName: "セブンイレブン駅前店", dayOfWeek: "火曜日", timeOfDay: "深夜2時" }
];

// CORS設定（SwiftUIからアクセスしやすくするため）
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 窓口A：アプリにみんなのデータを渡す (GET)
app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// 窓口B：アプリから新しい報告を受け取る (POST)
app.post('/api/reports', (req, res) => {
    const { storeName, dayOfWeek, timeOfDay } = req.body;
    
    const newReport = {
        id: Date.now().toString(),
        storeName: storeName || '不明な店舗',
        dayOfWeek: dayOfWeek || '不明な曜日',
        timeOfDay: timeOfDay || '不明な時間'
    };
    
    reports.push(newReport);
    res.status(201).json(newReport);
});

// サーバーを起動する
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
