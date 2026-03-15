import { createClient } from "contentful";
import type { FeaturedGearItem } from "@/types";

const CONTENT_TYPE_FEATURED_GEAR = "featuredGear";

function getEnv(name: string): string | undefined {
  return process.env[name];
}

export function getContentfulClient() {
  const space = getEnv("CONTENTFUL_SPACE_ID");
  const accessToken = getEnv("CONTENTFUL_ACCESS_TOKEN");
  const environment = getEnv("CONTENTFUL_ENVIRONMENT") ?? "master";

  if (!space || !accessToken) {
    return null;
  }

  return createClient({
    space,
    accessToken,
    environment,
  });
}

interface ContentfulAssetFile {
  url: string;
  details?: { image?: { width: number; height: number } };
}

interface ContentfulAsset {
  fields: {
    file: ContentfulAssetFile | { [locale: string]: ContentfulAssetFile };
    title?: string | { [locale: string]: string };
  };
}

interface ContentfulFeaturedGearEntry {
  sys: { id: string };
  fields: {
    title?: string;
    description?: string;
    status?: string;
    image?: ContentfulAsset;
  };
}

function firstLocaleValue<T>(value: T | { [locale: string]: T } | undefined): T | undefined {
  if (value == null) return undefined;
  if (typeof value === "object" && !Array.isArray(value) && "en-US" in value) {
    return (value as { "en-US": T })["en-US"];
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    const keys = Object.keys(value);
    return keys.length ? (value as Record<string, T>)[keys[0]] : undefined;
  }
  return value as T;
}

function mapStatus(value: string | undefined): FeaturedGearItem["status"] {
  const v = (value ?? "").toLowerCase();
  if (v === "claimed") return "claimed";
  return "available";
}

function mapImage(asset: ContentfulAsset | undefined): FeaturedGearItem["image"] {
  const file: ContentfulAssetFile | undefined = asset?.fields
    ? firstLocaleValue(asset.fields.file as ContentfulAssetFile | { [locale: string]: ContentfulAssetFile })
    : undefined;
  const url = typeof file?.url === "string" ? file.url : undefined;
  if (!url) return null;
  const fullUrl = url.startsWith("//") ? `https:${url}` : url;
  const details = file?.details?.image;
  const title = asset?.fields ? firstLocaleValue(asset.fields.title) : undefined;
  return {
    url: fullUrl,
    width: details?.width ?? 400,
    height: details?.height ?? 300,
    alt: typeof title === "string" ? title : null,
  };
}

/**
 * Fetches featured gear entries from Contentful. Returns an empty array if
 * Contentful is not configured or the request fails.
 */
export async function getFeaturedGear(): Promise<FeaturedGearItem[]> {
  const client = getContentfulClient();
  if (!client) return [];

  try {
    const response = await client.getEntries({
      content_type: CONTENT_TYPE_FEATURED_GEAR,
      include: 1,
    });

    return response.items.map((entry: { sys: { id: string }; fields: ContentfulFeaturedGearEntry["fields"] }) => {
      const title = firstLocaleValue(entry.fields.title) ?? "";
      const description = firstLocaleValue(entry.fields.description) ?? "";
      const status = mapStatus(firstLocaleValue(entry.fields.status));
      return {
        id: entry.sys.id,
        title,
        description,
        status,
        image: mapImage(entry.fields.image as ContentfulAsset | undefined),
      };
    });
  } catch {
    return [];
  }
}
