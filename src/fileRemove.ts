import fs from 'fs';
import path from 'path';

//このファイルはサーバーで1時間ごとに実行される

//定期的にファイルを削除する

const rm_date = 10; //削除するファイルの保存期間(時間)

//削除するファイルの保存先
const audio_path = './audios';
const video_path = './videos';

//削除するファイルのパス
const audio_files = fs.readdirSync(audio_path);
const video_files = fs.readdirSync(video_path);

audio_files.forEach((file) => {
    const date = file.split('_')[0];
    console.log('debug : ' + date);

    //data文字列をDateで読み取れる値に変換
    //"T"以降の"-"を":"に変換
    //例:2021-08-04T12-00-00 -> 2021-08-04T12:00:00

    const sp_date = date.split('T');
    const formattedDate = sp_date[0] + 'T' + sp_date[1].replace(/-/g, ':');

    const date_file = new Date(formattedDate);
    const now = new Date();
    const diff = now.getTime() - date_file.getTime();
    const diff_hour = diff / (1000 * 60 * 60);

    if (diff_hour > rm_date) {
        fs.unlinkSync(path.join(audio_path, file));
    }
});

video_files.forEach((file) => {
    const date = file.split('_')[0];
    console.log('debug : ' + date);

    //data文字列をDateで読み取れる値に変換
    //"T"以降の"-"を":"に変換
    //例:2021-08-04T12-00-00 -> 2021-08-04T12:00:00

    const sp_date = date.split('T');
    const formattedDate = sp_date[0] + 'T' + sp_date[1].replace(/-/g, ':');

    const date_file = new Date(formattedDate);
    const now = new Date();
    const diff = now.getTime() - date_file.getTime();
    const diff_hour = diff / (1000 * 60 * 60);

    if (diff_hour > rm_date) {
        fs.unlinkSync(path.join(video_path, file));
    }
});
