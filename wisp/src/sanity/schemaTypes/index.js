import { siteSettingsType } from "./siteSettingsType";
import { pageType } from "./pageType";
import { pressItemType } from "./pressItemType";
import { blockTypes } from "./blocks";

export const schemaTypes = [
  siteSettingsType,
  pageType,
  pressItemType,
  ...blockTypes,
];
