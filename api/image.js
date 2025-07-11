export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) return res.status(400).send('Image URL is required');

    try {
        const response = await fetch(url);

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
