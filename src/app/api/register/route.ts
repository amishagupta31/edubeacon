import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scriptUrl =
      process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
      process.env.APPS_SCRIPT_URL ||
      "https://script.google.com/macros/s/AKfycbxzsGAKkVgUkRqadLoPYwImcuXrqBfcxjs887FT3NiieqeHktbSPUsnWHQdWub1mVMpFA/exec";

    const payload = {
      ...body,
      timestamp:
        body.timestamp ||
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      sheetId:
        process.env.GOOGLE_SHEET_ID ||
        "1sFJCrRnl8bQ2chHddxe4t1XsGv84jkxDMf-c25kNxa0",
    };

    // Forward to Google Apps Script Web App
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const resText = await response.text();

    return NextResponse.json({
      success: true,
      message: "Data forwarded to Google Sheet successfully",
      response: resText,
    });
  } catch (error: any) {
    console.error("Error submitting to Google Apps Script:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to submit registration to Google Sheet",
      },
      { status: 500 }
    );
  }
}
