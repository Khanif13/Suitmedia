import https from 'https';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) return res.status(400).send('Image URL is required');

    try {
        const options = new URL(url);

        const request = https.get({
            hostname: options.hostname,
            path: options.pathname + options.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://suitmedia.com',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).send('Failed to fetch image');
                return;
            }

            res.setHeader('Content-Type', response.headers['content-type']);
            response.pipe(res);
        });

        request.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error fetching image');
        });
    } catch (err) {
        res.status(500).send('Internal error');
    }
}
