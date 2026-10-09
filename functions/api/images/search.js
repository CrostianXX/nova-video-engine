export async function onRequest(context) {
    const { request } = context;
    
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || url.searchParams.get("query") || "").trim();
    const page = url.searchParams.get("page") || "1";

    if (!q) {
        return new Response(JSON.stringify({ images: [] }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    };

    try {
        // 1. Primary: Bahas image search API
        const targetUrl = `https://bahas.crostia.my.id/api/images/search?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`;
        const res = await fetch(targetUrl, { headers });
        if (res.ok) {
            const data = await res.json();
            return new Response(JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "public, max-age=60"
                }
            });
        }
    } catch (err) {
        console.error("Bahas search error:", err);
    }

    try {
        // 2. Secondary Fallback: Direct Bing Images filter for pinimg
        const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(q + ' pinterest')}&form=HDRSC2`;
        const res = await fetch(bingUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        const matches = [...html.matchAll(/class="iusc"[^>]*?m="([^"]+)"/g)];
        const cleanImages = [];
        const seen = new Set();

        matches.forEach((m, idx) => {
            try {
                const parsed = JSON.parse(m[1].replace(/&quot;/g, '"'));
                const imgUrl = parsed.murl;
                if (!imgUrl || seen.has(imgUrl)) return;
                seen.add(imgUrl);
                
                let hdUrl = imgUrl;
                if (hdUrl.includes('pinimg.com')) {
                    hdUrl = hdUrl.replace(/\/236x\//, '/736x/').replace(/\/474x\//, '/736x/');
                }

                cleanImages.push({
                    id: `pin_${page}_${idx}`,
                    url: hdUrl,
                    thumb: parsed.turl || hdUrl,
                    title: parsed.t || q,
                    author: parsed.cname || 'Pinterest Creator',
                    link: parsed.purl || hdUrl,
                    desc: parsed.desc || parsed.t || q
                });
            } catch (e) {}
        });

        return new Response(JSON.stringify({ images: cleanImages, total: cleanImages.length }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (e) {
        return new Response(JSON.stringify({ images: [], error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}
