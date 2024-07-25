/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");

    const tommyFont = await fetch(
      new URL("../../../src/fonts/MADE_TOMMY_Bold.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const tommyOutlineFont = await fetch(
      new URL("../../../src/fonts/MADE_TOMMY_Bold_Outline.otf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const image = await fetch(
      new URL(
        "../../../src/images/pl2023_leaderboard_desktop_light.png",
        import.meta.url
      )
    ).then((res) => res.arrayBuffer());

    const bgImage = await fetch(
      new URL("../../../src/images/og-image_bg.png", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              position: "absolute",
              top: "0",
              backgroundImage:
                "linear-gradient(180deg,#f8f9fd 0%,#b8ccfd 100%)",
              zIndex: "1",
            }}>
            <img
              width={1200}
              height={615}
              style={{
                opacity: "0.2",
                height: "100%",
              }}
              alt="BG image"
              src={bgImage}
            />
          </div>
          <h1
            style={{
              fontFamily: "tommyOutline",
              maxWidth: "100%",
              fontSize: title ? "72px" : "100px",
              lineHeight: "20px",
              marginTop: "50px",
            }}>
            Predict The Standings
          </h1>
          <h2
            style={{
              fontFamily: "tommy",
              maxWidth: "100%",
              fontSize: "50px",
              marginBottom: "30px",
            }}>
            {title}
          </h2>
          <img
            width={1000}
            height={615}
            src={image}
            alt="Website image"
            style={{
              zIndex: "2",
            }}
          />
        </div>
      ),
      {
        fonts: [
          { name: "tommy", data: tommyFont, style: "normal" },
          { name: "tommyOutline", data: tommyOutlineFont, style: "normal" },
        ],
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
