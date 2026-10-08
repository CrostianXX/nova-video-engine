export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return new Response("Missing url parameter", { status: 400 });
    }

    try {
        const imageRes = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://id.pinterest.com/',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        });

        if (!imageRes.ok) {
            return new Response("Failed to fetch image", { status: imageRes.status });
        }

        const headers = new Headers(imageRes.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        
        return new Response(imageRes.body, {
            status: imageRes.status,
            headers: headers
        });

    } catch (err) {
        return new Response(err.message, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}
