import ytdl from 'ytdl-core';
import fs from 'fs';
const express = require('express');
import path from 'path';

const port: number = 4000; //ポート番号
//初期化
const app = express();

//jsonをuse
app.use(express.json());

//Getリクエストの処理 (音声)
app.use('/audios', (req: any, res: any, next: any) => {
    //Getではない場合next()
    if (req.method != 'GET') {
        next();
    }

    //現在の日付を取得
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const sconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

    //ログ用の日付
    const date_log: string = `${year}/${month}/${day} ${hour}:${minute}:${sconds}`;

    console.log('-----------------GET-----------------');
    //ipを取得
    const ip: number = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //ここでurlを取得して、そのurlのファイルを返す
    const url: string = req.url;
    const file_name = url.replace('/', '');

    //フォルダがない場合404を返す
    if (!fs.existsSync(`./audios`)) {
        res.status(404).json({ status: 404, error: 'Not Found' });
        append_GET_Log(ip, date_log, 404, 'Not Found', url);
        console.error('status : 404 Not Found');
        console.log('-------------------------------------');
        return;
    }

    const resalt = fs.readdirSync('./audios').filter((file) => {
        return file.includes(file_name);
    });

    //ファイルが存在しない場合404を返す
    if (resalt.length == 0) {
        res.status(404).json({ status: 404, error: 'Not Found' });
        append_GET_Log(ip, date_log, 404, 'Not Found', url);
        console.error('status : 404 Not Found');
        console.log('-------------------------------------');
        return;
    }
    const file_path = path.join('./audios', file_name);

    //ファイルを返す
    res.download(file_path);
    console.log('status : 200 success rqeuestIP : ' + ip);
    append_GET_Log(ip, date_log, 200, 'success', url);
    console.log('-------------------------------------');
});

//Getリクエストの処理 (動画)
app.use('/videos', (req: any, res: any, next: any) => {
    //Getではない場合next()
    if (req.method != 'GET') {
        next();
    }

    //現在の日付を取得
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const sconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

    //ログ用の日付
    const date_log: string = `${year}/${month}/${day} ${hour}:${minute}:${sconds}`;

    console.log('-----------------GET-----------------');
    //ipを取得
    const ip: number = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //ここでurlを取得して、そのurlのファイルを返す
    const url: string = req.url;
    const file_name = url.replace('/', '');

    //フォルダがない場合404を返す
    if (!fs.existsSync(`./videos`)) {
        res.status(404).json({ status: 404, error: 'Not Found' });
        append_GET_Log(ip, date_log, 404, 'Not Found', url);
        console.error('status : 404 Not Found');
        console.log('-------------------------------------');
        return;
    }

    const resalt = fs.readdirSync('./videos').filter((file) => {
        return file.includes(file_name);
    });

    //ファイルが存在しない場合404を返す
    if (resalt.length == 0) {
        res.status(404).json({ status: 404, error: 'Not Found' });
        append_GET_Log(ip, date_log, 404, 'Not Found', url);
        console.error('status : 404 Not Found');
        console.log('-------------------------------------');
        return;
    }
    const file_path = path.join('./videos', file_name);

    //ファイルを返す
    res.download(file_path);
    console.log('status : 200 success rqeuestIP : ' + ip);
    append_GET_Log(ip, date_log, 200, 'success', url);
    console.log('-------------------------------------');
});

//保存先url
const audio_url = `https://api.mcakh-studio.site/audios/`;
const video_url = `https://api.mcakh-studio.site/videos/`;

app.post('/', async (req: any, res: any) => {
    console.log('-----------------POST-----------------');

    //現在の日付を取得
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const sconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

    //ログ用の日付
    const date_log: string = `${year}/${month}/${day} ${hour}:${minute}:${sconds}`;

    const date_file = `${year}-${month}-${day}T${hour}-${minute}-${sconds}`;

    const ip: number = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //日付を表示
    console.log('date : ' + date_log);

    //アクセスIPを表示
    console.log('Access IP: ' + ip);

    //送られたURLを取得
    const req_url: string = req.body.url;
    //urlがundefinedの場合失敗リクエストを返す
    if (req_url == undefined) {
        res.status(400).json({ status: 400, error: 'url is undefined' });
        append_POST_Log(ip, date_log, 400, 'url is undefined');
        console.error('status : 400 url is undefined');
        console.log('-------------------------------------');
        return;
        //有効なビデオ ID を解析できるかどうかを確認
    } else if (!ytdl.validateURL(req_url)) {
        res.status(400).json({ status: 400, error: 'url is invalid' });
        append_POST_Log(ip, date_log, 400, 'url is invalid', req_url);
        console.error('status : 400 url is invalid');
        console.log('-------------------------------------');
        return;
    }

    //送られたURLを表示logに表示
    console.log('yt_url : ' + req_url);

    let video_id: string;

    //IDを取得
    try {
        video_id = ytdl.getURLVideoID(req_url);
    } catch (e: any) {
        res.status(500).json({ status: 500, error: 'failure Get VideoID from url' });
        append_POST_Log(ip, date_log, 500, 'failure Get VideoID from url', req_url);
        console.error('status : 500 failure Get VideoID from url');
        console.log('-------------------------------------');
        return;
    }

    //IDを表示logに表示
    console.log('video_id : ' + video_id);

    //動画の詳細情報を取得
    const video_info = await ytdl.getBasicInfo(req_url, { lang: 'ja' });

    const video_title = video_info.videoDetails.title;

    //動画の詳細情報を表示
    console.log('video_title : ' + video_title);

    //動画の保存先がない場合作成
    if (!fs.existsSync('./videos')) {
        fs.mkdirSync('./videos');
    }
    //音声の保存先がない場合作成
    if (!fs.existsSync('./audios')) {
        fs.mkdirSync('./audios');
    }

    const file_name_video = `${date_file}_${video_id}.mp4`;
    const file_name_audio = `${date_file}_${video_id}.mp3`;

    //同じIDのファイルが存在する場合削除
    removeFile(video_id);
    //動画のダウンロード (mp4形式) 音声と映像
    ytdl(req_url, { quality: 'highestaudio' }).pipe(fs.createWriteStream(`./videos/${file_name_video}`));
    //音声のみのダウンロード (mp3形式) 音声のみ
    ytdl(req_url, { filter: 'audioonly' }).pipe(fs.createWriteStream(`./audios/${file_name_audio}`));

    const url_save_video = `${video_url}${file_name_video}`;
    const url_save_audio = `${audio_url}${file_name_audio}`;

    const res_data = {
        status: 200,
        video_id: video_id,
        yt_url: req_url,
        title: video_title,
        url: {
            audio: url_save_audio,
            video: url_save_video,
        },
        date: date_log,
    };

    //成功レスポンス
    res.status(200).json(res_data);
    append_POST_Log(ip, date_log, 200, 'success', req_url, video_id, video_title, url_save_video, url_save_audio);
    console.log('status : 200 success');
    console.log('-------------------------------------');
    return;
});

//Getリクエストの処理
app.get('/', (req: any, res: any) => {
    console.log('-----------------GET-----------------');
    res.status(404).json({ status: 404, error: 'Not Found' });
    console.error('status : 404 Not Found');
    console.log('-------------------------------------');
});

//リクエスト待機
app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
});

function removeFile(id: string): void {
    fs.readdirSync('./videos').forEach((file) => {
        if (file.includes(id)) {
            fs.unlinkSync(`./videos/${file}`);
        }
    });

    fs.readdirSync('./audios').forEach((file) => {
        if (file.includes(id)) {
            fs.unlinkSync(`./audios/${file}`);
        }
    });
}

function append_GET_Log(ip: number, date: string, status: number, status_text: string, url: string) {
    //ログの保存先
    const log_path = './logs';

    //logsフォルダがない場合作成
    if (!fs.existsSync(log_path)) {
        fs.mkdirSync(log_path);
    }

    const log_data = new Date();
    const year = log_data.getFullYear();
    const month = log_data.getMonth() + 1 > 9 ? log_data.getMonth() + 1 : '0' + (log_data.getMonth() + 1);
    const day = log_data.getDate() > 9 ? log_data.getDate() : '0' + log_data.getDate();

    //ログのファイル名(yt-dl-log-yyyy-mm-dd.csv)
    const log_file_name = `yt-dl-get-log-${year}-${month}-${day}.csv`;

    //ログファイルのパス
    const log_file_path = path.join(log_path, log_file_name);

    //ログの内容
    const log_content = `${ip},${date},${status},${status_text},${url}\n`;

    //ログの保存先がない場合作成
    if (!fs.existsSync(log_path)) {
        fs.mkdirSync(log_path);
    }

    //ログファイルがない場合作成
    if (!fs.existsSync(log_file_path)) {
        fs.writeFileSync(log_file_path, 'IP,Date,Status,StatusText,URL\n');
    }

    //ログの書き込み
    fs.appendFile(log_file_path, log_content, (err: any) => {
        if (err) {
            console.error('failure write log');
        }
    });
}

function append_POST_Log(ip: number, date: string, status: number, status_text: string, url?: string, id?: string, title?: string, url_save_video?: string, url_save_audio?: string): void {
    //ログの保存先
    const log_path = './logs';

    //logsフォルダがない場合作成
    if (!fs.existsSync(log_path)) {
        fs.mkdirSync(log_path);
    }

    const log_data = new Date();
    const year = log_data.getFullYear();
    const month = log_data.getMonth() + 1 > 9 ? log_data.getMonth() + 1 : '0' + (log_data.getMonth() + 1);
    const day = log_data.getDate() > 9 ? log_data.getDate() : '0' + log_data.getDate();

    //ログのファイル名(yt-dl-log-yyyy-mm-dd.csv)
    const log_file_name = `yt-dl-post-log-${year}-${month}-${day}.csv`;

    //ログファイルのパス
    const log_file_path = path.join(log_path, log_file_name);

    //ログの内容
    const log_content = id == undefined ? `${ip},${date},${status},${status_text},${url}\n` : `${ip},${date},${status},${status_text},${url},${id},${title},${url_save_video},${url_save_audio}\n`;

    //ログの保存先がない場合作成
    if (!fs.existsSync(log_path)) {
        fs.mkdirSync(log_path);
    }

    //ログファイルがない場合作成
    if (!fs.existsSync(log_file_path)) {
        fs.writeFileSync(log_file_path, 'IP,Date,Status,StatusText,URL,VideoID,VideoTitle,SaveURL_Video,SaveURL_audio\n');
    }

    //ログの書き込み
    fs.appendFile(log_file_path, log_content, (err: any) => {
        if (err) {
            console.error('failure write log');
        }
    });
}
