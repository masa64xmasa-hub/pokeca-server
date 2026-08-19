const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/reports', async (req, res) => {
  try {
    // 1. 情報が集まっているWebサイトのURLを指定（例としてニュースやまとめサイトなど）
    const targetUrl = 'https://example.com'; // ※実際に集めたいサイトのURLを入れる
    
    // 2. サイトのHTML（Webページのデータ）を取得する
    const { data } = await axios.get(targetUrl, {
      headers: {
        // サイト側に拒否されないよう、ブラウザからのアクセスに見せかける設定
        'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)'
      }
    });

    // 3. cheerioを使ってHTMLを解析する
    const $ = cheerio.load(data);
    const reports = [];

    // 4. サイト内の特定要素（例: 記事タイトルやリスト）を抜き出す
    // ※ サイトの構造に合わせて HTMLタグやクラス名（h2, .title など）を指定します
    $('h2').each((index, element) => {
      const titleText = $(element).text().trim();

      // 「ポケカ」や「入荷」「ゲット」などのキーワードが含まれる情報だけを抽出
      if (titleText.includes('ポケカ') || titleText.includes('カード') || titleText.includes('入荷')) {
        reports.push({
          id: String(index + 1),
          cardName: titleText,
          shopName: "ネット速報より"
        });
      }
    });

    // もし何も拾えなかった場合の予備データ
    if (reports.length === 0) {
      reports.push({
        id: "1",
        cardName: "最新の入荷情報を確認中...",
        shopName: "自動取得システム"
      });
    }

    // 5. アプリへデータを返す
    res.json(reports);

  } catch (error) {
    console.error('エラー発生:', error);
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
