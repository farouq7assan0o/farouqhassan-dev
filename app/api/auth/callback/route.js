export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  // Exchange code for token with GitHub
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return new Response(`Auth error: ${data.error_description}`, { status: 400 });
  }

  const token = data.access_token;
  const provider = "github";

  // Return HTML that posts token back to opener and closes itself
  const html = `
<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log("receiveMessage", e);
    }
    window.addEventListener("message", receiveMessage);
    
    const token = ${JSON.stringify(token)};
    const provider = ${JSON.stringify(provider)};
    
    const message = "authorization:github:success:" + JSON.stringify({
      token: token,
      provider: provider
    });
    
    // Try to send to opener
    if (window.opener) {
      window.opener.postMessage(message, "*");
      setTimeout(() => window.close(), 500);
    } else {
      // Fallback: store in sessionStorage and redirect
      sessionStorage.setItem("decap-cms-auth", JSON.stringify({ token, provider }));
      window.location.href = "/admin/index.html";
    }
  })();
</script>
<p>Authorizing... this window should close automatically.</p>
</body>
</html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
