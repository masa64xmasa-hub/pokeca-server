const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/reports', async (req, res) => {
  try {
    // 1. 入荷NowのURLを設定
    const targetUrl = 'https://nyuka-now.com/';
    
    // 2. サイトのHTMLデータを取得
    const { data } = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      }
    });

    // 3. HTMLを解析
    const $ = cheerio.load(data);
    const reports = [];

    // 4. 記事のタイトル（h2タグ）からポケカ関連の情報だけ抜き出す
    $('h2').each((index, element) => {
      const titleText = $(element).text().trim();

      // タイトルに「ポケモン」または「ポケカ」が含まれる記事だけをピックアップ
      if (titleText.includes('ポケモン') || titleText.includes('ポケカ')) {
        // 余計な改行などを綺麗に整える
        const cleanTitle = titleText.replace(/\s+/g, ' ');

        reports.push({
          id: String(reports.length + 1),
          cardName: cleanTitle,
          shopName: "入荷Now"
        });
      }
    });

    // 万が一取得できなかった場合の予備表示
    if (reports.length === 0) {
      reports.push({
        id: "1",
        cardName: "ポケモンカードの最新入荷情報を検索中...",
        shopName: "入荷Now"
      });
    }

    // 5. JSONデータとして返す
    res.json(reports);

  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).json({ error: 'データの取得に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
