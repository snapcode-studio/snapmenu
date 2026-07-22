export async function onRequest(context) {
  const response = await context.next();
  const newResponse = new Response(response.body, response);

  newResponse.headers.delete("x-frame-options");
  newResponse.headers.delete("X-Frame-Options");
  newResponse.headers.set("Content-Security-Policy", "frame-ancestors *");
  newResponse.headers.set("Access-Control-Allow-Origin", "*");

  return newResponse;
}
