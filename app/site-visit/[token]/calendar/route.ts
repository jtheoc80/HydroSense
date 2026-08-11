export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return Response.redirect(new URL(`/api/site-visits/${token}/calendar`, request.url), 307);
}
