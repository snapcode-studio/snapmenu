export async function onRequest(context) {
  const response = await context.next();
  const newResponse = new Response(response.body, response);

  // Set X-Frame-Options to ALLOWALL so Cloudflare Managed Headers does not inject DENY
  newResponse.headers.set("X-Frame-Options", "ALLOWALL");
  newResponse.headers.set("Content-Security-Policy", "frame-ancestors *");
  newResponse.headers.set("Access-Control-Allow-Origin", "*");

  return newResponse;
}
