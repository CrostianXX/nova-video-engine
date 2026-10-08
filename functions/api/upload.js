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
        let formData;
        const contentType = request.headers.get("content-type") || "";
        
        if (contentType.includes("application/json")) {
            const body = await request.json();
            if (body.reqtype === "urlupload" && body.url) {
                // Not strictly needed if we don't use urlupload anymore
                return new Response(JSON.stringify({ error: "URL upload not supported" }), { status: 400 });
            } else {
                return new Response(JSON.stringify({ error: "Invalid json body" }), { status: 400 });
            }
        } else {
            const reqFormData = await request.formData();
            formData = new FormData();
            const file = reqFormData.get('fileToUpload') || reqFormData.get('file');
            if (file) {
                formData.append('file', file);
            } else {
                return new Response(JSON.stringify({ error: "Missing image file" }), { status: 400 });
            }
        }

        const envsRes = await fetch('https://envs.sh', {
            method: 'POST',
            body: formData
        });

        if (!envsRes.ok) {
            const errText = await envsRes.text();
            return new Response(JSON.stringify({ error: "Failed to upload to server", details: errText }), { 
                status: envsRes.status || 400,
                headers: { "Access-Control-Allow-Origin": "*" } 
            });
        }

        let url = await envsRes.text();
        url = url.trim();

        return new Response(JSON.stringify({ url: url }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500, 
            headers: { "Access-Control-Allow-Origin": "*" } 
        });
    }
}
