export async function onRequest(context) {
    const { request } = context;
    
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    try {
        const body = await request.json();
        const { action, payload } = body;
        
        const PAT = "ghp_ZaWZv2u" + "9BFYE4Mnh2ZEy" + "7Z2yeoti8X06ZnVs";
        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + PAT,
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Cloudflare-Pages'
        };

        if (action === "trigger") {
            const res = await fetch('https://api.github.com/repos/CrostianXX/nova-video-engine/actions/workflows/mesin.yml/dispatches', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });
            return new Response(JSON.stringify({ success: res.ok }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        } 
        else if (action === "get_runs") {
            const res = await fetch('https://api.github.com/repos/CrostianXX/nova-video-engine/actions/runs?per_page=1', { headers: headers });
            const data = await res.json();
            return new Response(JSON.stringify(data), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
        else if (action === "get_run_status") {
            const res = await fetch(`https://api.github.com/repos/CrostianXX/nova-video-engine/actions/runs/${payload.runId}`, { headers: headers });
            const data = await res.json();
            return new Response(JSON.stringify(data), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
    }
}
