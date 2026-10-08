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
                formData = new FormData();
                formData.append('image', body.url);
            } else {
                return new Response(JSON.stringify({ error: "Invalid json body" }), { status: 400 });
            }
        } else {
            // ImgBB needs 'image' field, while our frontend sends 'fileToUpload' or 'file'
            const reqFormData = await request.formData();
            formData = new FormData();
            const file = reqFormData.get('fileToUpload') || reqFormData.get('file');
            if (file) {
                formData.append('image', file);
            } else {
                return new Response(JSON.stringify({ error: "Missing image file" }), { status: 400 });
            }
        }

        const imgbbRes = await fetch('https://api.imgbb.com/1/upload?key=d3b0e9fd43ff0eb762987129a2f21e9c', {
            method: 'POST',
            body: formData
        });

        const data = await imgbbRes.json();
        if (!imgbbRes.ok || !data.success) {
            return new Response(JSON.stringify({ error: "Failed to upload to server", details: JSON.stringify(data) }), { 
                status: imgbbRes.status || 400,
                headers: { "Access-Control-Allow-Origin": "*" } 
            });
        }

        return new Response(JSON.stringify({ url: data.data.url }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500, 
            headers: { "Access-Control-Allow-Origin": "*" } 
        });
    }
}
