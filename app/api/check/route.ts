
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const panelUrl = process.env.PANEL_API_URL;
  const panelToken = process.env.PANEL_API_TOKEN;

  if (!panelUrl) {
    return NextResponse.json(
      { error: "PANEL_API_URL is not configured." },
      { status: 500 }
    );
  }

  let target: URL;

  try {
    target = new URL(panelUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid panel URL." },
      { status: 500 }
    );
  }

  if (target.protocol !== "https:") {
    return NextResponse.json(
      { error: "Panel endpoint must use HTTPS." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const entries = body.entries;
    const panelPassword = body.panelPassword;

    if (
      !Array.isArray(entries) ||
      entries.length === 0 ||
      entries.length > 100
    ) {
      return NextResponse.json(
        { error: "Provide between 1 and 100 entries." },
        { status: 400 }
      );
    }

    if (typeof panelPassword !== "string" || !panelPassword) {
      return NextResponse.json(
        { error: "Panel password is required." },
        { status: 400 }
      );
    }

    const validEntries = entries.every(
      (item) =>
        typeof item.apiKey === "string" &&
        typeof item.projectId === "string"
    );

    if (!validEntries) {
      return NextResponse.json(
        { error: "Invalid entry format." },
        { status: 400 }
      );
    }

    const response = await fetch(target.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(panelToken
          ? { Authorization: `Bearer ${panelToken}` }
          : {}),
      },
      body: JSON.stringify({ entries, panelPassword }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Panel request failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not connect to your configured panel." },
      { status: 502 }
    );
  }
}

