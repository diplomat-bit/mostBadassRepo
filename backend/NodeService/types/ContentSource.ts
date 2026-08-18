// REPOSITORY SOURCE: diplomat-bit/jamesburvelocallaghaniiiand | PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/backend/NodeService/types/ContentSource.ts
================================================================================

export type ContentSource = {
  type: string;
  url: string;
  parserType: string;
  contentSelector?: string;
  titleSelector?: string;
  linkSelector?: string;
  dateSelector?: string;
  contentExtractionType?: string;
  category?: string;
  tags?: string[];
  customFields?: { [key: string]: string };
};