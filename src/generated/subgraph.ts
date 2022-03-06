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

export type AddRemoveEvent = {
  __typename?: 'AddRemoveEvent';
  amount: Scalars['BigInt'];
  block: Scalars['Int'];
  cellar: Cellar;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  txId: Scalars['String'];
  wallet: Wallet;
};

export type AddRemoveEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txId?: InputMaybe<Scalars['String']>;
  txId_contains?: InputMaybe<Scalars['String']>;
  txId_ends_with?: InputMaybe<Scalars['String']>;
  txId_gt?: InputMaybe<Scalars['String']>;
  txId_gte?: InputMaybe<Scalars['String']>;
  txId_in?: InputMaybe<Array<Scalars['String']>>;
  txId_lt?: InputMaybe<Scalars['String']>;
  txId_lte?: InputMaybe<Scalars['String']>;
  txId_not?: InputMaybe<Scalars['String']>;
  txId_not_contains?: InputMaybe<Scalars['String']>;
  txId_not_ends_with?: InputMaybe<Scalars['String']>;
  txId_not_in?: InputMaybe<Array<Scalars['String']>>;
  txId_not_starts_with?: InputMaybe<Scalars['String']>;
  txId_starts_with?: InputMaybe<Scalars['String']>;
  wallet?: InputMaybe<Scalars['String']>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
};

export enum AddRemoveEvent_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Cellar = 'cellar',
  Id = 'id',
  Timestamp = 'timestamp',
  TxId = 'txId',
  Wallet = 'wallet'
}

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars['Bytes']>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars['Int']>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Cellar = {
  __typename?: 'Cellar';
  addedLiquidityAllTime: Scalars['BigInt'];
  dayDatas: Array<CellarDayData>;
  denom: Denom;
  depositWithdraws: Array<DepositWithdrawEvent>;
  id: Scalars['ID'];
  name: Scalars['String'];
  numWalletsActive: Scalars['Int'];
  numWalletsAllTime: Scalars['Int'];
  removedLiquidityAllTime: Scalars['BigInt'];
  sharesTotal: Scalars['BigInt'];
  tvlActive: Scalars['BigInt'];
  tvlInactive: Scalars['BigInt'];
  tvlTotal: Scalars['BigInt'];
};


export type CellarDayDatasArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CellarDayData_Filter>;
};


export type CellarDepositWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositWithdrawEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DepositWithdrawEvent_Filter>;
};

export type CellarDayData = {
  __typename?: 'CellarDayData';
  addedLiquidity: Scalars['BigInt'];
  cellar: Cellar;
  date: Scalars['Int'];
  id: Scalars['ID'];
  numWallets: Scalars['Int'];
  removedLiquidity: Scalars['BigInt'];
};

export type CellarDayData_Filter = {
  addedLiquidity?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidity_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
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
};

export enum CellarDayData_OrderBy {
  AddedLiquidity = 'addedLiquidity',
  Cellar = 'cellar',
  Date = 'date',
  Id = 'id',
  NumWallets = 'numWallets',
  RemovedLiquidity = 'removedLiquidity'
}

export type CellarShare = {
  __typename?: 'CellarShare';
  balance: Scalars['BigInt'];
  cellar: Cellar;
  id: Scalars['ID'];
  wallet: Wallet;
};

export type CellarShareTransferEvent = {
  __typename?: 'CellarShareTransferEvent';
  amount: Scalars['BigInt'];
  block: Scalars['Int'];
  cellar: Cellar;
  from: Scalars['String'];
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  to: Scalars['String'];
  txId: Scalars['String'];
  wallet: Wallet;
};

export type CellarShareTransferEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['String']>;
  from_contains?: InputMaybe<Scalars['String']>;
  from_ends_with?: InputMaybe<Scalars['String']>;
  from_gt?: InputMaybe<Scalars['String']>;
  from_gte?: InputMaybe<Scalars['String']>;
  from_in?: InputMaybe<Array<Scalars['String']>>;
  from_lt?: InputMaybe<Scalars['String']>;
  from_lte?: InputMaybe<Scalars['String']>;
  from_not?: InputMaybe<Scalars['String']>;
  from_not_contains?: InputMaybe<Scalars['String']>;
  from_not_ends_with?: InputMaybe<Scalars['String']>;
  from_not_in?: InputMaybe<Array<Scalars['String']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']>;
  from_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  to?: InputMaybe<Scalars['String']>;
  to_contains?: InputMaybe<Scalars['String']>;
  to_ends_with?: InputMaybe<Scalars['String']>;
  to_gt?: InputMaybe<Scalars['String']>;
  to_gte?: InputMaybe<Scalars['String']>;
  to_in?: InputMaybe<Array<Scalars['String']>>;
  to_lt?: InputMaybe<Scalars['String']>;
  to_lte?: InputMaybe<Scalars['String']>;
  to_not?: InputMaybe<Scalars['String']>;
  to_not_contains?: InputMaybe<Scalars['String']>;
  to_not_ends_with?: InputMaybe<Scalars['String']>;
  to_not_in?: InputMaybe<Array<Scalars['String']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']>;
  to_starts_with?: InputMaybe<Scalars['String']>;
  txId?: InputMaybe<Scalars['String']>;
  txId_contains?: InputMaybe<Scalars['String']>;
  txId_ends_with?: InputMaybe<Scalars['String']>;
  txId_gt?: InputMaybe<Scalars['String']>;
  txId_gte?: InputMaybe<Scalars['String']>;
  txId_in?: InputMaybe<Array<Scalars['String']>>;
  txId_lt?: InputMaybe<Scalars['String']>;
  txId_lte?: InputMaybe<Scalars['String']>;
  txId_not?: InputMaybe<Scalars['String']>;
  txId_not_contains?: InputMaybe<Scalars['String']>;
  txId_not_ends_with?: InputMaybe<Scalars['String']>;
  txId_not_in?: InputMaybe<Array<Scalars['String']>>;
  txId_not_starts_with?: InputMaybe<Scalars['String']>;
  txId_starts_with?: InputMaybe<Scalars['String']>;
  wallet?: InputMaybe<Scalars['String']>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
};

export enum CellarShareTransferEvent_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Cellar = 'cellar',
  From = 'from',
  Id = 'id',
  Timestamp = 'timestamp',
  To = 'to',
  TxId = 'txId',
  Wallet = 'wallet'
}

export type CellarShare_Filter = {
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  wallet?: InputMaybe<Scalars['String']>;
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
};

export enum CellarShare_OrderBy {
  Balance = 'balance',
  Cellar = 'cellar',
  Id = 'id',
  Wallet = 'wallet'
}

export type Cellar_Filter = {
  addedLiquidityAllTime?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_gt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_gte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedLiquidityAllTime_lt?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_lte?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_not?: InputMaybe<Scalars['BigInt']>;
  addedLiquidityAllTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  denom?: InputMaybe<Scalars['String']>;
  denom_contains?: InputMaybe<Scalars['String']>;
  denom_ends_with?: InputMaybe<Scalars['String']>;
  denom_gt?: InputMaybe<Scalars['String']>;
  denom_gte?: InputMaybe<Scalars['String']>;
  denom_in?: InputMaybe<Array<Scalars['String']>>;
  denom_lt?: InputMaybe<Scalars['String']>;
  denom_lte?: InputMaybe<Scalars['String']>;
  denom_not?: InputMaybe<Scalars['String']>;
  denom_not_contains?: InputMaybe<Scalars['String']>;
  denom_not_ends_with?: InputMaybe<Scalars['String']>;
  denom_not_in?: InputMaybe<Array<Scalars['String']>>;
  denom_not_starts_with?: InputMaybe<Scalars['String']>;
  denom_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
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
  DayDatas = 'dayDatas',
  Denom = 'denom',
  DepositWithdraws = 'depositWithdraws',
  Id = 'id',
  Name = 'name',
  NumWalletsActive = 'numWalletsActive',
  NumWalletsAllTime = 'numWalletsAllTime',
  RemovedLiquidityAllTime = 'removedLiquidityAllTime',
  SharesTotal = 'sharesTotal',
  TvlActive = 'tvlActive',
  TvlInactive = 'tvlInactive',
  TvlTotal = 'tvlTotal'
}

export type Denom = {
  __typename?: 'Denom';
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  symbol: Scalars['String'];
};

export type Denom_Filter = {
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
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Denom_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Symbol = 'symbol'
}

export type DepositWithdrawEvent = {
  __typename?: 'DepositWithdrawEvent';
  amount: Scalars['BigInt'];
  block: Scalars['Int'];
  cellar: Cellar;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  txId: Scalars['String'];
};

export type DepositWithdrawEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  cellar?: InputMaybe<Scalars['String']>;
  cellar_contains?: InputMaybe<Scalars['String']>;
  cellar_ends_with?: InputMaybe<Scalars['String']>;
  cellar_gt?: InputMaybe<Scalars['String']>;
  cellar_gte?: InputMaybe<Scalars['String']>;
  cellar_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_lt?: InputMaybe<Scalars['String']>;
  cellar_lte?: InputMaybe<Scalars['String']>;
  cellar_not?: InputMaybe<Scalars['String']>;
  cellar_not_contains?: InputMaybe<Scalars['String']>;
  cellar_not_ends_with?: InputMaybe<Scalars['String']>;
  cellar_not_in?: InputMaybe<Array<Scalars['String']>>;
  cellar_not_starts_with?: InputMaybe<Scalars['String']>;
  cellar_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  txId?: InputMaybe<Scalars['String']>;
  txId_contains?: InputMaybe<Scalars['String']>;
  txId_ends_with?: InputMaybe<Scalars['String']>;
  txId_gt?: InputMaybe<Scalars['String']>;
  txId_gte?: InputMaybe<Scalars['String']>;
  txId_in?: InputMaybe<Array<Scalars['String']>>;
  txId_lt?: InputMaybe<Scalars['String']>;
  txId_lte?: InputMaybe<Scalars['String']>;
  txId_not?: InputMaybe<Scalars['String']>;
  txId_not_contains?: InputMaybe<Scalars['String']>;
  txId_not_ends_with?: InputMaybe<Scalars['String']>;
  txId_not_in?: InputMaybe<Array<Scalars['String']>>;
  txId_not_starts_with?: InputMaybe<Scalars['String']>;
  txId_starts_with?: InputMaybe<Scalars['String']>;
};

export enum DepositWithdrawEvent_OrderBy {
  Amount = 'amount',
  Block = 'block',
  Cellar = 'cellar',
  Id = 'id',
  Timestamp = 'timestamp',
  TxId = 'txId'
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
  addRemoveEvent?: Maybe<AddRemoveEvent>;
  addRemoveEvents: Array<AddRemoveEvent>;
  cellar?: Maybe<Cellar>;
  cellarDayData?: Maybe<CellarDayData>;
  cellarDayDatas: Array<CellarDayData>;
  cellarShare?: Maybe<CellarShare>;
  cellarShareTransferEvent?: Maybe<CellarShareTransferEvent>;
  cellarShareTransferEvents: Array<CellarShareTransferEvent>;
  cellarShares: Array<CellarShare>;
  cellars: Array<Cellar>;
  denom?: Maybe<Denom>;
  denoms: Array<Denom>;
  depositWithdrawEvent?: Maybe<DepositWithdrawEvent>;
  depositWithdrawEvents: Array<DepositWithdrawEvent>;
  wallet?: Maybe<Wallet>;
  walletDayData?: Maybe<WalletDayData>;
  walletDayDatas: Array<WalletDayData>;
  wallets: Array<Wallet>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAddRemoveEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAddRemoveEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AddRemoveEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddRemoveEvent_Filter>;
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


export type QueryCellarShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCellarShareTransferEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCellarShareTransferEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShareTransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarShareTransferEvent_Filter>;
};


export type QueryCellarSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarShare_Filter>;
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


export type QueryDenomArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDenomsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Denom_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Denom_Filter>;
};


export type QueryDepositWithdrawEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDepositWithdrawEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositWithdrawEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositWithdrawEvent_Filter>;
};


export type QueryWalletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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
  addRemoveEvent?: Maybe<AddRemoveEvent>;
  addRemoveEvents: Array<AddRemoveEvent>;
  cellar?: Maybe<Cellar>;
  cellarDayData?: Maybe<CellarDayData>;
  cellarDayDatas: Array<CellarDayData>;
  cellarShare?: Maybe<CellarShare>;
  cellarShareTransferEvent?: Maybe<CellarShareTransferEvent>;
  cellarShareTransferEvents: Array<CellarShareTransferEvent>;
  cellarShares: Array<CellarShare>;
  cellars: Array<Cellar>;
  denom?: Maybe<Denom>;
  denoms: Array<Denom>;
  depositWithdrawEvent?: Maybe<DepositWithdrawEvent>;
  depositWithdrawEvents: Array<DepositWithdrawEvent>;
  wallet?: Maybe<Wallet>;
  walletDayData?: Maybe<WalletDayData>;
  walletDayDatas: Array<WalletDayData>;
  wallets: Array<Wallet>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAddRemoveEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAddRemoveEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AddRemoveEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddRemoveEvent_Filter>;
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


export type SubscriptionCellarShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCellarShareTransferEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCellarShareTransferEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShareTransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarShareTransferEvent_Filter>;
};


export type SubscriptionCellarSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CellarShare_Filter>;
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


export type SubscriptionDenomArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDenomsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Denom_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Denom_Filter>;
};


export type SubscriptionDepositWithdrawEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDepositWithdrawEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositWithdrawEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositWithdrawEvent_Filter>;
};


export type SubscriptionWalletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type Wallet = {
  __typename?: 'Wallet';
  addRemoveEvents: Array<AddRemoveEvent>;
  cellarShareTransferEvents: Array<CellarShareTransferEvent>;
  cellarShares: Array<CellarShare>;
  dayDatas: Array<WalletDayData>;
  id: Scalars['ID'];
};


export type WalletAddRemoveEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AddRemoveEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AddRemoveEvent_Filter>;
};


export type WalletCellarShareTransferEventsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShareTransferEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CellarShareTransferEvent_Filter>;
};


export type WalletCellarSharesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CellarShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CellarShare_Filter>;
};


export type WalletDayDatasArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WalletDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WalletDayData_Filter>;
};

export type WalletDayData = {
  __typename?: 'WalletDayData';
  addedLiquidity: Scalars['BigInt'];
  date: Scalars['Int'];
  id: Scalars['ID'];
  removedLiquidity: Scalars['BigInt'];
  wallet: Wallet;
};

export type WalletDayData_Filter = {
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
  wallet_contains?: InputMaybe<Scalars['String']>;
  wallet_ends_with?: InputMaybe<Scalars['String']>;
  wallet_gt?: InputMaybe<Scalars['String']>;
  wallet_gte?: InputMaybe<Scalars['String']>;
  wallet_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_lt?: InputMaybe<Scalars['String']>;
  wallet_lte?: InputMaybe<Scalars['String']>;
  wallet_not?: InputMaybe<Scalars['String']>;
  wallet_not_contains?: InputMaybe<Scalars['String']>;
  wallet_not_ends_with?: InputMaybe<Scalars['String']>;
  wallet_not_in?: InputMaybe<Array<Scalars['String']>>;
  wallet_not_starts_with?: InputMaybe<Scalars['String']>;
  wallet_starts_with?: InputMaybe<Scalars['String']>;
};

export enum WalletDayData_OrderBy {
  AddedLiquidity = 'addedLiquidity',
  Date = 'date',
  Id = 'id',
  RemovedLiquidity = 'removedLiquidity',
  Wallet = 'wallet'
}

export type Wallet_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum Wallet_OrderBy {
  AddRemoveEvents = 'addRemoveEvents',
  CellarShareTransferEvents = 'cellarShareTransferEvents',
  CellarShares = 'cellarShares',
  DayDatas = 'dayDatas',
  Id = 'id'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
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

export type GetCellarQueryVariables = Exact<{
  cellarAddress: Scalars['ID'];
}>;


export type GetCellarQuery = { __typename?: 'Query', cellar?: { __typename?: 'Cellar', id: string, tvlActive: string, tvlInactive: string, tvlTotal: string, addedLiquidityAllTime: string, removedLiquidityAllTime: string, numWalletsAllTime: number, numWalletsActive: number, denom: { __typename?: 'Denom', id: string, symbol: string }, dayDatas: Array<{ __typename?: 'CellarDayData', date: number, addedLiquidity: string, removedLiquidity: string, numWallets: number }> } | null };

export type GetPositionQueryVariables = Exact<{
  walletAddress: Scalars['ID'];
  cellarAddress: Scalars['String'];
}>;


export type GetPositionQuery = { __typename?: 'Query', wallet?: { __typename?: 'Wallet', id: string, cellarShares: Array<{ __typename?: 'CellarShare', balance: string }> } | null };


export const GetCellarDocument = gql`
    query GetCellar($cellarAddress: ID!) {
  cellar(id: $cellarAddress) {
    id
    denom {
      id
      symbol
    }
    tvlActive
    tvlInactive
    tvlTotal
    addedLiquidityAllTime
    removedLiquidityAllTime
    numWalletsAllTime
    numWalletsActive
    dayDatas(first: 7, orderBy: date, orderDirection: desc) {
      date
      addedLiquidity
      removedLiquidity
      numWallets
    }
  }
}
    `;

export function useGetCellarQuery(options: Omit<Urql.UseQueryArgs<GetCellarQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCellarQuery>({ query: GetCellarDocument, ...options });
};
export const GetPositionDocument = gql`
    query GetPosition($walletAddress: ID!, $cellarAddress: String!) {
  wallet(id: $walletAddress) {
    id
    cellarShares(where: {cellar: $cellarAddress}) {
      balance
    }
  }
}
    `;

export function useGetPositionQuery(options: Omit<Urql.UseQueryArgs<GetPositionQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPositionQuery>({ query: GetPositionDocument, ...options });
};