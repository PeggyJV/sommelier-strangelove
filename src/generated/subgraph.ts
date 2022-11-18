// THIS FILE IS AUTO GENERATED, DO NOT EDIT!
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Cellar = {
  __typename?: 'Cellar';
  addedLiquidityAllTime: Scalars['BigInt'];
  asset: TokenErc20;
  currentDeposits: Scalars['BigInt'];
  dayDatas: Array<CellarDayData>;
  depositLimit: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityLimit: Scalars['BigInt'];
  name: Scalars['String'];
  numWalletsActive: Scalars['Int'];
  numWalletsAllTime: Scalars['Int'];
  removedLiquidityAllTime: Scalars['BigInt'];
  shareProfitRatio: Scalars['BigDecimal'];
  shareValue: Scalars['BigInt'];
  sharesTotal: Scalars['BigInt'];
  tvlActive: Scalars['BigInt'];
  tvlInactive: Scalars['BigInt'];
  tvlInvested: Scalars['BigInt'];
  tvlTotal: Scalars['BigInt'];
};


export type CellarDayDatasArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CellarDayData_Filter>;
};

export type CellarDayData = {
  __typename?: 'CellarDayData';
  addedLiquidity: Scalars['BigInt'];
  asset: TokenErc20;
  cellar: Cellar;
  date: Scalars['Int'];
  earnings: Scalars['BigInt'];
  id: Scalars['ID'];
  numWallets: Scalars['Int'];
  removedLiquidity: Scalars['BigInt'];
  shareProfitRatio: Scalars['BigDecimal'];
  shareValue: Scalars['BigInt'];
  tvlActive: Scalars['BigInt'];
  tvlInactive: Scalars['BigInt'];
  tvlInvested: Scalars['BigInt'];
  tvlTotal: Scalars['BigInt'];
  updatedAt: Scalars['Int'];
};

export type CellarDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedLiquidity?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<TokenErc20_Filter>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_?: InputMaybe<Cellar_Filter>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  earnings?: InputMaybe<Scalars['BigInt']>;
  earnings_gt?: InputMaybe<Scalars['BigInt']>;
  earnings_gte?: InputMaybe<Scalars['BigInt']>;
  earnings_in?: InputMaybe<Array<Scalars['BigInt']>>;
  earnings_lt?: InputMaybe<Scalars['BigInt']>;
  earnings_lte?: InputMaybe<Scalars['BigInt']>;
  earnings_not?: InputMaybe<Scalars['BigInt']>;
  earnings_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  numWallets?: InputMaybe<Scalars['Int']>;
  numWallets_gt?: InputMaybe<Scalars['Int']>;
  numWallets_gte?: InputMaybe<Scalars['Int']>;
  numWallets_in?: InputMaybe<Array<Scalars['Int']>>;
  numWallets_lt?: InputMaybe<Scalars['Int']>;
  numWallets_lte?: InputMaybe<Scalars['Int']>;
  numWallets_not?: InputMaybe<Scalars['Int']>;
  numWallets_not_in?: InputMaybe<Array<Scalars['Int']>>;
  removedLiquidity?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareProfitRatio?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareProfitRatio_lt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_lte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareValue?: InputMaybe<Scalars['BigInt']>;
  shareValue_gt?: InputMaybe<Scalars['BigInt']>;
  shareValue_gte?: InputMaybe<Scalars['BigInt']>;
  shareValue_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareValue_lt?: InputMaybe<Scalars['BigInt']>;
  shareValue_lte?: InputMaybe<Scalars['BigInt']>;
  shareValue_not?: InputMaybe<Scalars['BigInt']>;
  shareValue_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal_lt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_lte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt?: InputMaybe<Scalars['Int']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt_lt?: InputMaybe<Scalars['Int']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']>;
  updatedAt_not?: InputMaybe<Scalars['Int']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CellarDayData_OrderBy {
  AddedLiquidity = 'addedLiquidity',
  Asset = 'asset',
  Cellar = 'cellar',
  Date = 'date',
  Earnings = 'earnings',
  Id = 'id',
  NumWallets = 'numWallets',
  RemovedLiquidity = 'removedLiquidity',
  ShareProfitRatio = 'shareProfitRatio',
  ShareValue = 'shareValue',
  TvlActive = 'tvlActive',
  TvlInactive = 'tvlInactive',
  TvlInvested = 'tvlInvested',
  TvlTotal = 'tvlTotal',
  UpdatedAt = 'updatedAt'
}

export type CellarHourData = {
  __typename?: 'CellarHourData';
  addedLiquidity: Scalars['BigInt'];
  asset?: Maybe<TokenErc20>;
  cellar: Cellar;
  date: Scalars['Int'];
  earnings: Scalars['BigInt'];
  id: Scalars['ID'];
  numWallets: Scalars['Int'];
  removedLiquidity: Scalars['BigInt'];
  shareProfitRatio: Scalars['BigDecimal'];
  shareValue: Scalars['BigInt'];
  tvlActive: Scalars['BigInt'];
  tvlInactive: Scalars['BigInt'];
  tvlInvested: Scalars['BigInt'];
  tvlTotal: Scalars['BigInt'];
  updatedAt: Scalars['Int'];
};

export type CellarHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedLiquidity?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<TokenErc20_Filter>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_?: InputMaybe<Cellar_Filter>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  earnings?: InputMaybe<Scalars['BigInt']>;
  earnings_gt?: InputMaybe<Scalars['BigInt']>;
  earnings_gte?: InputMaybe<Scalars['BigInt']>;
  earnings_in?: InputMaybe<Array<Scalars['BigInt']>>;
  earnings_lt?: InputMaybe<Scalars['BigInt']>;
  earnings_lte?: InputMaybe<Scalars['BigInt']>;
  earnings_not?: InputMaybe<Scalars['BigInt']>;
  earnings_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  numWallets?: InputMaybe<Scalars['Int']>;
  numWallets_gt?: InputMaybe<Scalars['Int']>;
  numWallets_gte?: InputMaybe<Scalars['Int']>;
  numWallets_in?: InputMaybe<Array<Scalars['Int']>>;
  numWallets_lt?: InputMaybe<Scalars['Int']>;
  numWallets_lte?: InputMaybe<Scalars['Int']>;
  numWallets_not?: InputMaybe<Scalars['Int']>;
  numWallets_not_in?: InputMaybe<Array<Scalars['Int']>>;
  removedLiquidity?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareProfitRatio?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareProfitRatio_lt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_lte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareValue?: InputMaybe<Scalars['BigInt']>;
  shareValue_gt?: InputMaybe<Scalars['BigInt']>;
  shareValue_gte?: InputMaybe<Scalars['BigInt']>;
  shareValue_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareValue_lt?: InputMaybe<Scalars['BigInt']>;
  shareValue_lte?: InputMaybe<Scalars['BigInt']>;
  shareValue_not?: InputMaybe<Scalars['BigInt']>;
  shareValue_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal_lt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_lte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt?: InputMaybe<Scalars['Int']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt_lt?: InputMaybe<Scalars['Int']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']>;
  updatedAt_not?: InputMaybe<Scalars['Int']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CellarHourData_OrderBy {
  AddedLiquidity = 'addedLiquidity',
  Asset = 'asset',
  Cellar = 'cellar',
  Date = 'date',
  Earnings = 'earnings',
  Id = 'id',
  NumWallets = 'numWallets',
  RemovedLiquidity = 'removedLiquidity',
  ShareProfitRatio = 'shareProfitRatio',
  ShareValue = 'shareValue',
  TvlActive = 'tvlActive',
  TvlInactive = 'tvlInactive',
  TvlInvested = 'tvlInvested',
  TvlTotal = 'tvlTotal',
  UpdatedAt = 'updatedAt'
}

export type Cellar_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedLiquidityAllTime?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidityAllTime_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<TokenErc20_Filter>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentDeposits?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDeposits_lt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_lte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dayDatas_?: InputMaybe<CellarDayData_Filter>;
  depositLimit?: InputMaybe<Scalars['BigInt']>;
  depositLimit_gt?: InputMaybe<Scalars['BigInt']>;
  depositLimit_gte?: InputMaybe<Scalars['BigInt']>;
  depositLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  depositLimit_lt?: InputMaybe<Scalars['BigInt']>;
  depositLimit_lte?: InputMaybe<Scalars['BigInt']>;
  depositLimit_not?: InputMaybe<Scalars['BigInt']>;
  depositLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityLimit?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_gt?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_gte?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidityLimit_lt?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_lte?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_not?: InputMaybe<Scalars['BigInt']>;
  liquidityLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  numWalletsActive?: InputMaybe<Scalars['Int']>;
  numWalletsActive_gt?: InputMaybe<Scalars['Int']>;
  numWalletsActive_gte?: InputMaybe<Scalars['Int']>;
  numWalletsActive_in?: InputMaybe<Array<Scalars['Int']>>;
  numWalletsActive_lt?: InputMaybe<Scalars['Int']>;
  numWalletsActive_lte?: InputMaybe<Scalars['Int']>;
  numWalletsActive_not?: InputMaybe<Scalars['Int']>;
  numWalletsActive_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numWalletsAllTime?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_gt?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_gte?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_in?: InputMaybe<Array<Scalars['Int']>>;
  numWalletsAllTime_lt?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_lte?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_not?: InputMaybe<Scalars['Int']>;
  numWalletsAllTime_not_in?: InputMaybe<Array<Scalars['Int']>>;
  removedLiquidityAllTime?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_gt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_gte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedLiquidityAllTime_lt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_lte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_not?: InputMaybe<Scalars['BigInt']>;
  removedLiquidityAllTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareProfitRatio?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_gte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareProfitRatio_lt?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_lte?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not?: InputMaybe<Scalars['BigDecimal']>;
  shareProfitRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shareValue?: InputMaybe<Scalars['BigInt']>;
  shareValue_gt?: InputMaybe<Scalars['BigInt']>;
  shareValue_gte?: InputMaybe<Scalars['BigInt']>;
  shareValue_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareValue_lt?: InputMaybe<Scalars['BigInt']>;
  shareValue_lte?: InputMaybe<Scalars['BigInt']>;
  shareValue_not?: InputMaybe<Scalars['BigInt']>;
  shareValue_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  sharesTotal?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_gt?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_gte?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  sharesTotal_lt?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_lte?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_not?: InputMaybe<Scalars['BigInt']>;
  sharesTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlActive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlActive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not?: InputMaybe<Scalars['BigInt']>;
  tvlActive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInactive_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not?: InputMaybe<Scalars['BigInt']>;
  tvlInactive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_gte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlInvested_lt?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_lte?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not?: InputMaybe<Scalars['BigInt']>;
  tvlInvested_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_gte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tvlTotal_lt?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_lte?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not?: InputMaybe<Scalars['BigInt']>;
  tvlTotal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Cellar_OrderBy {
  AddedLiquidityAllTime = 'addedLiquidityAllTime',
  Asset = 'asset',
  CurrentDeposits = 'currentDeposits',
  DayDatas = 'dayDatas',
  DepositLimit = 'depositLimit',
  Id = 'id',
  LiquidityLimit = 'liquidityLimit',
  Name = 'name',
  NumWalletsActive = 'numWalletsActive',
  NumWalletsAllTime = 'numWalletsAllTime',
  RemovedLiquidityAllTime = 'removedLiquidityAllTime',
  ShareProfitRatio = 'shareProfitRatio',
  ShareValue = 'shareValue',
  SharesTotal = 'sharesTotal',
  TvlActive = 'tvlActive',
  TvlInactive = 'tvlInactive',
  TvlInvested = 'tvlInvested',
  TvlTotal = 'tvlTotal'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  cellar?: Maybe<Cellar>;
  cellarDayData?: Maybe<CellarDayData>;
  cellarDayDatas: Array<CellarDayData>;
  cellarHourData?: Maybe<CellarHourData>;
  cellarHourDatas: Array<CellarHourData>;
  cellars: Array<Cellar>;
  tokenERC20?: Maybe<TokenErc20>;
  tokenERC20S: Array<TokenErc20>;
  wallet?: Maybe<Wallet>;
  walletCellarData?: Maybe<WalletCellarData>;
  walletCellarDatas: Array<WalletCellarData>;
  walletCellarShare?: Maybe<WalletCellarShare>;
  walletCellarShares: Array<WalletCellarShare>;
  walletDayData?: Maybe<WalletDayData>;
  walletDayDatas: Array<WalletDayData>;
  wallets: Array<Wallet>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryCellarArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCellarDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCellarDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarDayData_Filter>;
};


export type QueryCellarHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCellarHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarHourData_Filter>;
};


export type QueryCellarsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cellar_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cellar_Filter>;
};


export type QueryTokenErc20Args = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenErc20SArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenErc20_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenErc20_Filter>;
};


export type QueryWalletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWalletCellarDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWalletCellarDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletCellarData_Filter>;
};


export type QueryWalletCellarShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWalletCellarSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletCellarShare_Filter>;
};


export type QueryWalletDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWalletDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletDayData_Filter>;
};


export type QueryWalletsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Wallet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Wallet_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  cellar?: Maybe<Cellar>;
  cellarDayData?: Maybe<CellarDayData>;
  cellarDayDatas: Array<CellarDayData>;
  cellarHourData?: Maybe<CellarHourData>;
  cellarHourDatas: Array<CellarHourData>;
  cellars: Array<Cellar>;
  tokenERC20?: Maybe<TokenErc20>;
  tokenERC20S: Array<TokenErc20>;
  wallet?: Maybe<Wallet>;
  walletCellarData?: Maybe<WalletCellarData>;
  walletCellarDatas: Array<WalletCellarData>;
  walletCellarShare?: Maybe<WalletCellarShare>;
  walletCellarShares: Array<WalletCellarShare>;
  walletDayData?: Maybe<WalletDayData>;
  walletDayDatas: Array<WalletDayData>;
  wallets: Array<Wallet>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionCellarArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCellarDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCellarDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarDayData_Filter>;
};


export type SubscriptionCellarHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCellarHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarHourData_Filter>;
};


export type SubscriptionCellarsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Cellar_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Cellar_Filter>;
};


export type SubscriptionTokenErc20Args = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenErc20SArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenErc20_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenErc20_Filter>;
};


export type SubscriptionWalletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWalletCellarDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWalletCellarDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletCellarData_Filter>;
};


export type SubscriptionWalletCellarShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWalletCellarSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletCellarShare_Filter>;
};


export type SubscriptionWalletDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWalletDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WalletDayData_Filter>;
};


export type SubscriptionWalletsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Wallet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Wallet_Filter>;
};

export type TokenErc20 = {
  __typename?: 'TokenERC20';
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  symbol: Scalars['String'];
};

export type TokenErc20_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum TokenErc20_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Symbol = 'symbol'
}

export type Wallet = {
  __typename?: 'Wallet';
  cellarData: Array<WalletCellarData>;
  cellarShares: Array<WalletCellarShare>;
  currentDeposits: Scalars['BigInt'];
  dayDatas: Array<WalletDayData>;
  id: Scalars['ID'];
  totalDeposits: Scalars['BigInt'];
  totalWithdrawals: Scalars['BigInt'];
};


export type WalletCellarDataArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WalletCellarData_Filter>;
};


export type WalletCellarSharesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletCellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WalletCellarShare_Filter>;
};


export type WalletDayDatasArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WalletDayData_Filter>;
};

export type WalletCellarData = {
  __typename?: 'WalletCellarData';
  currentDeposits: Scalars['BigInt'];
  id: Scalars['ID'];
  totalDeposits: Scalars['BigInt'];
  totalWithdrawals: Scalars['BigInt'];
  wallet: Wallet;
  walletAddress: Scalars['String'];
};

export type WalletCellarData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  currentDeposits?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDeposits_lt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_lte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalDeposits?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_gt?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_gte?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalDeposits_lt?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_lte?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_not?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawals?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_gt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_gte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawals_lt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_lte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_not?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  wallet?: InputMaybe<Scalars['String']>;
  walletAddress?: InputMaybe<Scalars['String']>;
  walletAddress_contains?: InputMaybe<Scalars['String']>;
  walletAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_ends_with?: InputMaybe<Scalars['String']>;
  walletAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_gt?: InputMaybe<Scalars['String']>;
  walletAddress_gte?: InputMaybe<Scalars['String']>;
  walletAddress_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_lt?: InputMaybe<Scalars['String']>;
  walletAddress_lte?: InputMaybe<Scalars['String']>;
  walletAddress_not?: InputMaybe<Scalars['String']>;
  walletAddress_not_contains?: InputMaybe<Scalars['String']>;
  walletAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  walletAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  walletAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  walletAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  walletAddress_starts_with?: InputMaybe<Scalars['String']>;
  walletAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_?: InputMaybe<Wallet_Filter>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum WalletCellarData_OrderBy {
  CurrentDeposits = 'currentDeposits',
  Id = 'id',
  TotalDeposits = 'totalDeposits',
  TotalWithdrawals = 'totalWithdrawals',
  Wallet = 'wallet',
  WalletAddress = 'walletAddress'
}

export type WalletCellarShare = {
  __typename?: 'WalletCellarShare';
  balance: Scalars['BigInt'];
  cellar: Cellar;
  id: Scalars['ID'];
  wallet: Wallet;
};

export type WalletCellarShare_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_?: InputMaybe<Cellar_Filter>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  wallet?: InputMaybe<Scalars['String']>;
  wallet_?: InputMaybe<Wallet_Filter>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum WalletCellarShare_OrderBy {
  Balance = 'balance',
  Cellar = 'cellar',
  Id = 'id',
  Wallet = 'wallet'
}

export type WalletDayData = {
  __typename?: 'WalletDayData';
  addedLiquidity: Scalars['BigInt'];
  date: Scalars['Int'];
  id: Scalars['ID'];
  removedLiquidity: Scalars['BigInt'];
  wallet: Wallet;
};

export type WalletDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedLiquidity?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  date?: InputMaybe<Scalars['Int']>;
  date_gt?: InputMaybe<Scalars['Int']>;
  date_gte?: InputMaybe<Scalars['Int']>;
  date_in?: InputMaybe<Array<Scalars['Int']>>;
  date_lt?: InputMaybe<Scalars['Int']>;
  date_lte?: InputMaybe<Scalars['Int']>;
  date_not?: InputMaybe<Scalars['Int']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  removedLiquidity?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  removedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  removedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  wallet?: InputMaybe<Scalars['String']>;
  wallet_?: InputMaybe<Wallet_Filter>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum WalletDayData_OrderBy {
  AddedLiquidity = 'addedLiquidity',
  Date = 'date',
  Id = 'id',
  RemovedLiquidity = 'removedLiquidity',
  Wallet = 'wallet'
}

export type Wallet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  cellarData_?: InputMaybe<WalletCellarData_Filter>;
  cellarShares_?: InputMaybe<WalletCellarShare_Filter>;
  currentDeposits?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_gte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentDeposits_lt?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_lte?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not?: InputMaybe<Scalars['BigInt']>;
  currentDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  dayDatas_?: InputMaybe<WalletDayData_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalDeposits?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_gt?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_gte?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalDeposits_lt?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_lte?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_not?: InputMaybe<Scalars['BigInt']>;
  totalDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawals?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_gt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_gte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawals_lt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_lte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_not?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Wallet_OrderBy {
  CellarData = 'cellarData',
  CellarShares = 'cellarShares',
  CurrentDeposits = 'currentDeposits',
  DayDatas = 'dayDatas',
  Id = 'id',
  TotalDeposits = 'totalDeposits',
  TotalWithdrawals = 'totalWithdrawals'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetAllCellarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCellarsQuery = { __typename?: 'Query', cellars: Array<{ __typename?: 'Cellar', id: string, name: string, tvlActive: string, tvlInactive: string, tvlTotal: string, numWalletsActive: number, numWalletsAllTime: number, sharesTotal: string, shareValue: string, asset: { __typename?: 'TokenERC20', symbol: string, decimals: number }, dayDatas: Array<{ __typename?: 'CellarDayData', id: string, date: number, tvlActive: string, tvlInvested: string, earnings: string, shareValue: string }> }>, cellarDayDatas: Array<{ __typename?: 'CellarDayData', id: string, date: number, tvlActive: string, tvlInvested: string, earnings: string }> };

export type CellarDayDatasFragment = { __typename?: 'Query', cellarDayDatas: Array<{ __typename?: 'CellarDayData', id: string, date: number, tvlActive: string, tvlInvested: string, earnings: string }> };

export type GetAllTimeShareValueQueryVariables = Exact<{
  cellarAddress: Scalars['ID'];
}>;


export type GetAllTimeShareValueQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, shareValue: string }> } | null };

export type GetAllTimeTvlByAddressQueryVariables = Exact<{
  cellarAddress: Scalars['ID'];
}>;


export type GetAllTimeTvlByAddressQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, tvlTotal: string }> } | null };

export type GetAllTimeTvlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTimeTvlQuery = { __typename?: 'Query', cellarDayDatas: Array<{ __typename?: 'CellarDayData', date: number, tvlTotal: string, asset: { __typename?: 'TokenERC20', symbol: string, decimals: number } }> };

export type GetCellarRouteStaticQueryVariables = Exact<{
  cellarAddress: Scalars['ID'];
}>;


export type GetCellarRouteStaticQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', id: string, name: string } | null };

export type GetCellarRoutesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCellarRoutesQuery = { __typename?: 'Query', cellars: Array<{ __typename?: 'Cellar', name: string, id: string }> };

export type GetCellarQueryVariables = Exact<{
  cellarAddress: Scalars['ID'];
  cellarString: Scalars['String'];
}>;


export type GetCellarQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', id: string, liquidityLimit: string, name: string, numWalletsActive: number, numWalletsAllTime: number, tvlActive: string, tvlInactive: string, tvlTotal: string, addedLiquidityAllTime: string, removedLiquidityAllTime: string, shareValue: string, asset: { __typename?: 'TokenERC20', symbol: string, decimals: number }, dayDatas: Array<{ __typename?: 'CellarDayData', id: string, date: number, tvlActive: string, tvlInvested: string, earnings: string, shareValue: string }> } | null };

export type GetCurrentDepositsQueryVariables = Exact<{
  walletAddress: Scalars['ID'];
}>;


export type GetCurrentDepositsQuery = { __typename?: 'Query', wallet?: { __typename?: 'Wallet', id: string, currentDeposits: string } | null };

export type GetHourlyShareValueQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress?: InputMaybe<Scalars['String']>;
}>;


export type GetHourlyShareValueQuery = { __typename?: 'Query', cellarHourDatas: Array<{ __typename?: 'CellarHourData', date: number, shareValue: string }> };

export type GetHourlyTvlByAddressQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress?: InputMaybe<Scalars['String']>;
}>;


export type GetHourlyTvlByAddressQuery = { __typename?: 'Query', cellarHourDatas: Array<{ __typename?: 'CellarHourData', date: number, tvlTotal: string }> };

export type GetHourlyTvlQueryVariables = Exact<{
  epoch?: InputMaybe<Scalars['Int']>;
}>;


export type GetHourlyTvlQuery = { __typename?: 'Query', cellarHourDatas: Array<{ __typename?: 'CellarHourData', date: number, tvlTotal: string, asset?: { __typename?: 'TokenERC20', symbol: string, decimals: number } | null }> };

export type GetMonthlyShareValueQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress: Scalars['ID'];
}>;


export type GetMonthlyShareValueQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, shareValue: string }> } | null };

export type GetPositionQueryVariables = Exact<{
  walletCellarId: Scalars['ID'];
}>;


export type GetPositionQuery = { __typename?: 'Query', walletCellarData?: { __typename?: 'WalletCellarData', id: string, currentDeposits: string } | null };

export type GetSingleCellarValueQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress: Scalars['ID'];
}>;


export type GetSingleCellarValueQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, shareValue: string }> } | null };

export type GetWeeklyShareValueQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress: Scalars['ID'];
}>;


export type GetWeeklyShareValueQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, shareValue: string }> } | null };

export type GetWeeklyTvlByAdressQueryVariables = Exact<{
  epoch: Scalars['Int'];
  cellarAddress: Scalars['ID'];
}>;


export type GetWeeklyTvlByAdressQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', dayDatas: Array<{ __typename?: 'CellarDayData', date: number, tvlTotal: string }> } | null };

export type GetWeeklyTvlQueryVariables = Exact<{
  epoch: Scalars['Int'];
}>;


export type GetWeeklyTvlQuery = { __typename?: 'Query', cellarDayDatas: Array<{ __typename?: 'CellarDayData', date: number, tvlTotal: string, asset: { __typename?: 'TokenERC20', symbol: string, decimals: number } }> };

export const CellarDayDatasFragmentDoc = gql`
    fragment CellarDayDatas on Query {
  cellarDayDatas(orderBy: date, orderDirection: desc) {
    id
    date
    tvlActive
    tvlInvested
    earnings
  }
}
    `;
export const GetAllCellarsDocument = gql`
    query GetAllCellars {
  cellars {
    id
    name
    asset {
      symbol
      decimals
    }
    tvlActive
    tvlInactive
    tvlTotal
    numWalletsActive
    numWalletsAllTime
    sharesTotal
    shareValue
    dayDatas(first: 7, orderBy: date, orderDirection: desc) {
      id
      date
      tvlActive
      tvlInvested
      earnings
      shareValue
    }
  }
  ...CellarDayDatas
}
    ${CellarDayDatasFragmentDoc}`;

export function useGetAllCellarsQuery(options?: Omit<Urql.UseQueryArgs<GetAllCellarsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllCellarsQuery>({ query: GetAllCellarsDocument, ...options });
};
export const GetAllTimeShareValueDocument = gql`
    query GetAllTimeShareValue($cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(orderDirection: asc, orderBy: date) {
      date
      shareValue
    }
  }
}
    `;

export function useGetAllTimeShareValueQuery(options: Omit<Urql.UseQueryArgs<GetAllTimeShareValueQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllTimeShareValueQuery>({ query: GetAllTimeShareValueDocument, ...options });
};
export const GetAllTimeTvlByAddressDocument = gql`
    query GetAllTimeTVLByAddress($cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(orderDirection: asc, orderBy: date) {
      date
      tvlTotal
    }
  }
}
    `;

export function useGetAllTimeTvlByAddressQuery(options: Omit<Urql.UseQueryArgs<GetAllTimeTvlByAddressQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllTimeTvlByAddressQuery>({ query: GetAllTimeTvlByAddressDocument, ...options });
};
export const GetAllTimeTvlDocument = gql`
    query GetAllTimeTVL {
  cellarDayDatas(orderDirection: asc, orderBy: date) {
    date
    asset {
      symbol
      decimals
    }
    tvlTotal
  }
}
    `;

export function useGetAllTimeTvlQuery(options?: Omit<Urql.UseQueryArgs<GetAllTimeTvlQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllTimeTvlQuery>({ query: GetAllTimeTvlDocument, ...options });
};
export const GetCellarRouteStaticDocument = gql`
    query GetCellarRouteStatic($cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    id
    name
  }
}
    `;

export function useGetCellarRouteStaticQuery(options: Omit<Urql.UseQueryArgs<GetCellarRouteStaticQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCellarRouteStaticQuery>({ query: GetCellarRouteStaticDocument, ...options });
};
export const GetCellarRoutesDocument = gql`
    query GetCellarRoutes {
  cellars {
    name
    id
  }
}
    `;

export function useGetCellarRoutesQuery(options?: Omit<Urql.UseQueryArgs<GetCellarRoutesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCellarRoutesQuery>({ query: GetCellarRoutesDocument, ...options });
};
export const GetCellarDocument = gql`
    query GetCellar($cellarAddress: ID!, $cellarString: String!) {
  cellar(id: $cellarAddress) {
    id
    asset {
      symbol
      decimals
    }
    liquidityLimit
    name
    numWalletsActive
    numWalletsAllTime
    tvlActive
    tvlInactive
    tvlTotal
    addedLiquidityAllTime
    removedLiquidityAllTime
    shareValue
    dayDatas(first: 7, orderBy: date, orderDirection: desc) {
      id
      date
      tvlActive
      tvlInvested
      earnings
      shareValue
    }
  }
}
    `;

export function useGetCellarQuery(options: Omit<Urql.UseQueryArgs<GetCellarQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCellarQuery>({ query: GetCellarDocument, ...options });
};
export const GetCurrentDepositsDocument = gql`
    query GetCurrentDeposits($walletAddress: ID!) {
  wallet(id: $walletAddress) {
    id
    currentDeposits
  }
}
    `;

export function useGetCurrentDepositsQuery(options: Omit<Urql.UseQueryArgs<GetCurrentDepositsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCurrentDepositsQuery>({ query: GetCurrentDepositsDocument, ...options });
};
export const GetHourlyShareValueDocument = gql`
    query GetHourlyShareValue($epoch: Int!, $cellarAddress: String) {
  cellarHourDatas(
    orderDirection: asc
    orderBy: date
    where: {cellar: $cellarAddress, date_gte: $epoch}
  ) {
    date
    shareValue
  }
}
    `;

export function useGetHourlyShareValueQuery(options: Omit<Urql.UseQueryArgs<GetHourlyShareValueQueryVariables>, 'query'>) {
  return Urql.useQuery<GetHourlyShareValueQuery>({ query: GetHourlyShareValueDocument, ...options });
};
export const GetHourlyTvlByAddressDocument = gql`
    query GetHourlyTVLByAddress($epoch: Int!, $cellarAddress: String) {
  cellarHourDatas(
    orderDirection: asc
    orderBy: date
    where: {cellar: $cellarAddress, date_gte: $epoch}
  ) {
    date
    tvlTotal
  }
}
    `;

export function useGetHourlyTvlByAddressQuery(options: Omit<Urql.UseQueryArgs<GetHourlyTvlByAddressQueryVariables>, 'query'>) {
  return Urql.useQuery<GetHourlyTvlByAddressQuery>({ query: GetHourlyTvlByAddressDocument, ...options });
};
export const GetHourlyTvlDocument = gql`
    query GetHourlyTVL($epoch: Int) {
  cellarHourDatas(orderDirection: asc, orderBy: date, where: {date_gte: $epoch}) {
    date
    asset {
      symbol
      decimals
    }
    tvlTotal
  }
}
    `;

export function useGetHourlyTvlQuery(options?: Omit<Urql.UseQueryArgs<GetHourlyTvlQueryVariables>, 'query'>) {
  return Urql.useQuery<GetHourlyTvlQuery>({ query: GetHourlyTvlDocument, ...options });
};
export const GetMonthlyShareValueDocument = gql`
    query GetMonthlyShareValue($epoch: Int!, $cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(
      first: 31
      orderDirection: asc
      orderBy: date
      where: {date_gte: $epoch}
    ) {
      date
      shareValue
    }
  }
}
    `;

export function useGetMonthlyShareValueQuery(options: Omit<Urql.UseQueryArgs<GetMonthlyShareValueQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMonthlyShareValueQuery>({ query: GetMonthlyShareValueDocument, ...options });
};
export const GetPositionDocument = gql`
    query GetPosition($walletCellarId: ID!) {
  walletCellarData(id: $walletCellarId) {
    id
    currentDeposits
  }
}
    `;

export function useGetPositionQuery(options: Omit<Urql.UseQueryArgs<GetPositionQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPositionQuery>({ query: GetPositionDocument, ...options });
};
export const GetSingleCellarValueDocument = gql`
    query GetSingleCellarValue($epoch: Int!, $cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(first: 1, where: {date_gte: $epoch}) {
      date
      shareValue
    }
  }
}
    `;

export function useGetSingleCellarValueQuery(options: Omit<Urql.UseQueryArgs<GetSingleCellarValueQueryVariables>, 'query'>) {
  return Urql.useQuery<GetSingleCellarValueQuery>({ query: GetSingleCellarValueDocument, ...options });
};
export const GetWeeklyShareValueDocument = gql`
    query GetWeeklyShareValue($epoch: Int!, $cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(
      first: 7
      orderDirection: asc
      orderBy: date
      where: {date_gte: $epoch}
    ) {
      date
      shareValue
    }
  }
}
    `;

export function useGetWeeklyShareValueQuery(options: Omit<Urql.UseQueryArgs<GetWeeklyShareValueQueryVariables>, 'query'>) {
  return Urql.useQuery<GetWeeklyShareValueQuery>({ query: GetWeeklyShareValueDocument, ...options });
};
export const GetWeeklyTvlByAdressDocument = gql`
    query GetWeeklyTVLByAdress($epoch: Int!, $cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    dayDatas(
      first: 7
      orderDirection: asc
      orderBy: date
      where: {date_gte: $epoch}
    ) {
      date
      tvlTotal
    }
  }
}
    `;

export function useGetWeeklyTvlByAdressQuery(options: Omit<Urql.UseQueryArgs<GetWeeklyTvlByAdressQueryVariables>, 'query'>) {
  return Urql.useQuery<GetWeeklyTvlByAdressQuery>({ query: GetWeeklyTvlByAdressDocument, ...options });
};
export const GetWeeklyTvlDocument = gql`
    query GetWeeklyTVL($epoch: Int!) {
  cellarDayDatas(
    first: 7
    orderDirection: asc
    orderBy: date
    where: {date_gte: $epoch}
  ) {
    date
    asset {
      symbol
      decimals
    }
    tvlTotal
  }
}
    `;

export function useGetWeeklyTvlQuery(options: Omit<Urql.UseQueryArgs<GetWeeklyTvlQueryVariables>, 'query'>) {
  return Urql.useQuery<GetWeeklyTvlQuery>({ query: GetWeeklyTvlDocument, ...options });
};