export const siteConfig = {
  name: "Siratim Portfolio Blog",
  shortName: "Siratim",
  description:
    "Personal portfolio and blog by Siratim, a Unity developer based in Tokyo.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sm-siratim.net").replace(
    /\/$/,
    ""
  ),
  author: {
    name: "Siratim",
    githubUrl: "https://github.com/Shorotshishir",
  },
};

export const baseUrl = siteConfig.url;
