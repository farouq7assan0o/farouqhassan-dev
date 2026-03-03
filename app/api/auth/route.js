export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // DEBUG - remove after testing
  if (searchParams.get("debug") === "1") {
    return new Response(JSON.stringify({
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      clientIdValue: process.env.GITHUB_CLIENT_ID?.slice(0, 5) + "...",
      hasSecret: !!process.env.GITHUB_CLIENT_SECRET,
    }), { headers: { "Content-Type": "application/json" } });
  }

  const provider = searchParams.get("provider") || "github";

  // Step 1: No code yet — redirect to GitHub to get one
  if (!code) {
    const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liThD61yrjqlTnDX";
    const redirectUri = encodeURIComponent("https://farouqhassan.dev/api/auth");
    const scope = "repo,user";
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    return Response.redirect(githubUrl);
  }

  // Step 2: Got code — exchange for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: "https://farouqhassan.dev/api/auth",
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response(`Auth error: ${tokenData.error_description}`, { status: 400 });
  }

  const token = tokenData.access_token;

  // Step 3: Return HTML that posts token to opener and closes
  const html = `<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
  const token = ${JSON.stringify(token)};
  const message = "authorization:github:success:" + JSON.stringify({ token, provider: "github" });
  if (window.opener) {
    window.opener.postMessage(message, window.location.origin);    setTimeout(() => window.close(), 200);
  } else {
    localStorage.setItem("netlify-cms-user", JSON.stringify({ token, provider: "github" }));
    window.location.href = "/admin/index.html";
  }
</script>
<p>Authorized! This window should close automatically.</p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
