import type { StatJSON } from "../Statistics/Statistics.type";

export interface Aggregation {
    id: string,
    fileName: string,
  date: string;
  data: StatJSON;
  error?: string;
}