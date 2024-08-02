import { MetadataRoute } from "next";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";
import { allF1SeasonData } from "@data/formula-1/season-data";
import { allPlSeasonData } from "@data/premier-league/season-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type ChangeFrequency =
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
    | undefined;
  type UrlObj = {
    url: string;
    lastModified?: string | Date;
    changeFrequency?: ChangeFrequency;
    priority?: number;
  };

  const newUrlObj = (url: string, changeFrequency: ChangeFrequency): UrlObj => {
    return {
      url: url,
      lastModified: new Date(),
      changeFrequency: changeFrequency,
    };
  };

  let urlObjs: MetadataRoute.Sitemap = [];

  /**Add the simple static pages */
  let staticUrls = [
    "",
    "attribution",
    "competitions",
    "help",
    "login",
    "privacy-policy",
    "profile",
    "terms-of-service",
  ];
  staticUrls.forEach((url) => urlObjs.push(newUrlObj(url, "monthly")));

  /**Make a mega array with all seasonData for all competitions */
  const allSeasonData = allEurovisionSeasonData.concat(
    allF1SeasonData,
    allPlSeasonData
  );

  /**Adds competition homepages */
  const competitionHyphendatedStrs = [
    ...new Set(
      allSeasonData.map((seasonData) => seasonData.competitionStrs.hyphenated)
    ),
  ];
  competitionHyphendatedStrs.forEach((competitionStr) =>
    urlObjs.push(newUrlObj(competitionStr, "monthly"))
  );

  /**Adds seasonal specific pages */
  allSeasonData.forEach((seasonData) => {
    const seasonalUrl = `${seasonData.competitionStrs.hyphenated}/${seasonData.id}`;

    /**Adds static seasonal pages */
    urlObjs.push(newUrlObj(seasonalUrl, "weekly"));
    urlObjs.push(newUrlObj(`${seasonalUrl}/predict`, "monthly"));
    urlObjs.push(newUrlObj(`${seasonalUrl}/stats/player`, "weekly"));
    urlObjs.push(newUrlObj(`${seasonalUrl}/your-predictions`, "monthly"));

    /**Adds the entrant specific stats page */
    urlObjs.push(
      newUrlObj(
        `${seasonalUrl}/stats/${
          seasonData.competitionStrs.shortHand === "f1"
            ? "driver-and-team"
            : seasonData.competitionStrs.shortHand === "pl"
            ? "team"
            : "country"
        }`,
        "weekly"
      )
    );
  });

  return urlObjs.map((urlObj) => ({
    url: `${process.env.AUTH_URL}/${urlObj.url}`,
    lastModified: new Date(),
    changeFrequency: urlObj.changeFrequency,
  }));
}
