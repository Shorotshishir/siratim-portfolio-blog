import { ImageResponse } from "next/og";
import { siteConfig } from "app/config";

export function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || siteConfig.name;

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-white text-black p-16 justify-between">
        <div tw="flex flex-col">
          <p tw="text-3xl text-red-600 mb-8">{siteConfig.shortName}</p>
          <h1 tw="text-6xl font-bold tracking-tight leading-tight">{title}</h1>
        </div>
        <p tw="text-2xl text-neutral-600">{siteConfig.description}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
