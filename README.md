# これはなに？

この API は、[ytdl-core](https://github.com/fent/node-ytdl-core)を使用し、YouTube の動画を MP4,MP3 形式で取得する API です。

# 使い方

http リクエストを送ると、動画を取得できる URL を返します。

取得する場合は、その URL にアクセスしてください。

## リクエスト

"https://api.mcakh-studio.site"　に POST リクエストを送信します。

### パラメータ

| パラメータ名 | 必須 | 型     | 説明               |
| ------------ | ---- | ------ | ------------------ |
| url          | 必須 | string | YouTube の動画 URL |

### 例

JavaScript

```javascript
const url = 'https://www.youtube.com/watch?v=XXXXXXXXXXX';
const res = await fetch('https://api.mcakh-studio.site', {
    method: 'POST',
    body: { url: url },
});
const result = await res.json();
```

## 返り値 (成功)

```json
{
    "status": "リクエストステータス : number",
    "video_id": "動画ID : string",
    "yt_url": "動画のURL : string",
    "title": "動画のタイトル : string",
    "url": {
        "audio": "音声のダウンロードURL : string",
        "video": "動画のダウンロードURL : string"
    },
    "date": "リクエスト日時 : string"
}
```

## 返り値 (失敗)

```json
{
    "status": "リクエストステータス : number",
    "error": "エラーメッセージ : string"
}
```

## ステータスコード

| ステータスコード | 説明                   |
| ---------------- | ---------------------- |
| 200              | 成功                   |
| 400              | パラメータエラー       |
| 404              | リソースが見つからない |
| 500              | サーバーエラー         |

# フィードバック

バグ報告は、[GitHub Issues](https://github.com/tako-dayo8/youtube_download_api/issues) にお願いします。
