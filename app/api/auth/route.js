export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (searchParams.get("debug") === "1") {
    return new Response(JSON.stringify({
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasSecret: !!process.env.GITHUB_CLIENT_SECRET,
    }), { headers: { "Content-Type": "application/json" } });
  }

  // Step 1: No code — redirect to GitHub
  if (!code) {
    const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liThD61yrjqlTnDX";
    const redirectUri = encodeURIComponent("https://farouqhassan.dev/api/auth");
    const githubUrl = "https://github.com/login/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&scope=repo,user";
    return Response.redirect(githubUrl);
  }

  // Step 2: Exchange code for token
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
  const tokenJson = JSON.stringify({ token: token, provider: "github" });
  const message = "authorization:github:success:" + tokenJson;

  // Step 3: Redirect directly to admin with token in hash
  return Response.redirect(
    "https://farouqhassan.dev/admin/index.html#access_token=" + token + "&token_type=bearer"
  );
}