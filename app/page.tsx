import Portfolio from "app/portfolio/portfolio";
import { siteConfig } from "app/config";

export const metadata = {
  title: "Portfolio",
  description: siteConfig.description,
};

export default function Page() {
  return (
    <section>
      <Portfolio />
    </section>
  );
}
