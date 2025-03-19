const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/download', (req, res) => {
    const { url, quality } = req.body;
    console.log(`Received URL: ${url}, Quality: ${quality}`);

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        return res.status(400).send('Invalid YouTube URL');
    }

    let formatOption;
    switch (quality) {
        case '1080p':
            formatOption = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
            break;
        case '720p':
            formatOption = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
            break;
        case '480p':
            formatOption = 'bestvideo[height<=480]+bestaudio/best[height<=480]';
            break;
        case 'best':
        default:
            formatOption = 'best';
            break;
    }

    console.log(`Using yt-dlp format: ${formatOption}`);

    const ytdlp = spawn('yt-dlp', ['-f', formatOption, '-o', '-', url]);

    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on('data', (data) => {
        console.error(`yt-dlp error: ${data}`);
    });

    ytdlp.on('close', (code) => {
        if (code !== 0) {
            console.error(`yt-dlp exited with code ${code}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
