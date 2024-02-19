const fs = require('fs');
const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const { exec } = require('child_process');

console.log('Start reading a file...'); //debug

const staticurl = 'http://localhost:3001/';

//初期化
const app = express();

//ポート設定
const port = 3001;

app.use(express.json());

const staticFilesPath = path.join(__dirname, 'audios');

app.use('/audios', express.static(staticFilesPath));

//"./youtube_download"URLにurlをPOSTすると、そのurlを返す
app.post('/youtube_download', async (req: any, res: any): Promise<void> => {
    const url: string = req.body.url;
    //urlがなかったらエラー
    if (!url) {
        res.status(400).json({ error: 'url is required' });
        return;
        //urlがyoutubeのものでなかったらエラー
    } else if (!ytdl.validateURL(url)) {
        res.status(400).json({ error: 'url is not audios' });
        return;
    }

    const id = ytdl.getURLVideoID(url);

    const audioFilesPath = staticurl + 'audios/' + `${id}.mp3`;
    const dirPath = path.join(__dirname, `audios/${id}.mp3`);

    //ファイルがすでに存在していたらそのまま直リンクを返す
    if (fs.existsSync(dirPath)) {
        res.json({ url: audioFilesPath });
        return;
    }

    //urlから音声をダウンロード
    const downloadrun = await ytdl(url, { quality: 'highestaudio' }).pipe(fs.createWriteStream(`videos/${id}.mp4`));

    downloadrun.on('error', (err: any) => {
        console.log(err);
        res.status(500).json({ error: 'download failed' });
        return;
    });

    console.log('download complete');

    const videosPath = path.join(__dirname, `videos/${id}.mp4`);
    const command = `ffmpeg -y -i ${videosPath} ${dirPath}`;
    //ダウンロードした動画を音声に変換
    exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'convert failed' });
            return;
        }
        console.log('convert complete');
        console.log(stdout);
        console.log(stderr);
        res.json({ url: audioFilesPath });
    });
    return;
});

app.get('/', (req: any, res: any): void => {
    res.send('Hello World');
});

app.listen(port, (): void => {
    console.log(`Server is running at http://localhost:${port}`);
});
