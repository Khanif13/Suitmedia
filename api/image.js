export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) return res.status(400).send('Image URL is required');

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': 'https://suitmedia-backend.suitdev.com'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send('Failed to fetch image');
        }

        res.setHeader('Content-Type', response.headers.get('content-type'));
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
    } catch (err) {
        res.status(500).send('Internal error');
    }
}
