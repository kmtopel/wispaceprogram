import { siteSettingsType } from "./siteSettingsType";
import { pageType } from "./pageType";
import { pressItemType } from "./pressItemType";
import { blockTypes } from "./blocks";
import { objectTypes } from "./objects";

export const schemaTypes = [
  siteSettingsType,
  pageType,
  pressItemType,
  ...objectTypes,
  ...blockTypes,
];
