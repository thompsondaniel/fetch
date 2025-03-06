export async function GET() {
  try {
    const res = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/breeds",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await res.text();
    return Response.json(data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
