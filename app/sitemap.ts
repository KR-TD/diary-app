import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.haru2end.com";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    // 해시 URL도 색인에 힌트를 주기 위해 포함
    { url: `${base}/#list`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/#support`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/#hall`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
