import { Timestamp } from "firebase-admin/firestore";
import { ByID, GetTableInput, MutateOutput, TableOutput } from "./common-types";

export interface Rank {
  rank: number;
  nameKo: string;
  nameEn: string;
  balance: number;
}

export interface RankingBase {
  rankings: Rank[];
  file_url: string;
}

export interface BackendRanking extends RankingBase {
  createdAt: Timestamp;
}
export interface FrontendRanking extends RankingBase {
  id: string;
}

export type UpdateRankingOutput = MutateOutput;

export type GetRankingsInput = GetTableInput;
export type GetRankingsOutput = TableOutput<FrontendRanking[]>;

export type DeleteRankingInput = ByID;
export type DeleteRankingOutput = MutateOutput;
