import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiResponse = await fetch(
      "http://fo.indogrosir.lan/oraws/oraclewebservice.asmx/GetBranchList",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
        },
      }
    );

    if (!apiResponse.ok) {
      throw new Error(
        `HTTP Error: ${apiResponse.status} - ${apiResponse.statusText}`
      );
    }

    const data = await apiResponse.text();

    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Error fetching API:", errorMessage);

    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
