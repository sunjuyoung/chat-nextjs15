import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  action: string;
}

interface RouteParams {
  params: Params;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  const paramObj = await params;

  const { action } = paramObj;
  console.log("----------------------------------------");
  console.log(paramObj);
  console.log(action);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { account, pno, quantity } = await request.json();

  if (action === "change") {
    const res = await fetch("http://localhost:8080/api/carts/change", {
      method: "POST",
      body: JSON.stringify({ account, pno, quantity }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    return NextResponse.json(result);
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  const paramObj = await params;

  const { action } = paramObj;

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (action === "list") {
    const account = session.user.email;

    const res = await fetch(
      `http://localhost:8080/api/carts/list?account=${account}`,
      {
        method: "GET",
      }
    );

    const result = await res.json();

    return NextResponse.json(result);
  }
  return NextResponse.json([]);
}
