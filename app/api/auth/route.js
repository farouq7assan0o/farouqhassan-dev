export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liThD61yrjqlTnDX";
    const redirectUri = encodeURIComponent("https://farouqhassan.dev/api/auth");
    return Response.redirect(
      "https://github.com/login/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=repo,user"
    );
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID || "Ov23liThD61yrjqlTnDX",
      client_secret: process.env.GITHUB_CLIENT_SECRET || "9e8a6c270a30aa60a565cef418a10585d18a97aa",
      code: code,
      redirect_uri: "https://farouqhassan.dev/api/auth",
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    return new Response("Auth error: " + tokenData.error_description, { status: 400 });
  }

  const token = tokenData.access_token;
  const message = "authorization:github:success:" + JSON.stringify({ token: token, provider: "github" });

  const parts = [
    "<!DOCTYPE html><html><body>",
    "<script>",
    "var msg = " + JSON.stringify(message) + ";",
    "if (window.opener) {",
    "  window.opener.postMessage(msg, '*');",
    "  setTimeout(function(){ window.close(); }, 15000);",
    "} else {",
    "  document.body.innerHTML = '<p>Done. Close this tab and refresh admin.</p>';",
    "}",
    "<\/script><p>Authorizing...</p></body></html>"
  ];

  return new Response(parts.join(""), { headers: { "Content-Type": "text/html" } });
}