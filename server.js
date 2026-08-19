const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ポケカのデータ（まずはテスト用の仮データ）
const reports = [
  { id: "1", cardName: "リザードンex SAR", shopName: "ポケセンオンライン" },
  { id: "2", cardName: "ナンジャモ", shopName: "近所のコンビニ" }
];

// アプリからデータ要求が来たときの応答処理
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
