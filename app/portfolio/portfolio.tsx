import { getPortfolio } from "app/blog/utils";
import { CustomMDX } from "app/components/mdx";
import React from "react";

export default function Portfolio() {
  let allPortfolio = getPortfolio();
  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>

      {allPortfolio.map((folio) => (
        <article className="prose" key={folio.slug}>
          <CustomMDX source={folio.content} />
        </article>
      ))}
    </>
  );
}
