export async function onRequest(context) {
    const { request } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    try {
        let catboxRes;
        const contentType = request.headers.get("content-type") || "";
        
        if (contentType.includes("application/json")) {
            const body = await request.json();
            if (body.reqtype === "urlupload" && body.url) {
                const formData = new FormData();
                formData.append('reqtype', 'urlupload');
                formData.append('url', body.url);
                catboxRes = await fetch('https://catbox.moe/user/api.php', {
                    method: 'POST',
                    body: formData,
                    headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
                });
            } else {
                return new Response(JSON.stringify({ error: "Invalid json body" }), { status: 400 });
            }
        } else {
            const formData = await request.formData();
            catboxRes = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: formData,
                headers: { 'User-Agent': 'Cloudflare-Pages-Proxy' }
            });
        }

        if (!catboxRes.ok) {
            const errText = await catboxRes.text();
            return new Response(JSON.stringify({ error: "Failed to upload to catbox", details: errText }), { 
                status: catboxRes.status,
                headers: { "Access-Control-Allow-Origin": "*" } 
            });
        }

        const url = await catboxRes.text();
        return new Response(JSON.stringify({ url: url.trim() }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500, 
            headers: { "Access-Control-Allow-Origin": "*" } 
        });
    }
}
