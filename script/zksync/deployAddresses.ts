import { existsSync, readFileSync, writeFileSync } from "fs";
import _ from "lodash";

const MAIN_ADDRESSES_PATH:string = "deploy/main.json";
const TOKEN_ADDRESSES_PATH:string = "deploy/tokens.json";
const ZTOKEN_ADDRESSES_PATH:string = "deploy/zTokens.json";

function getAddressAll(path:string) {
  let addresses = {}
  if (existsSync(path)) {
    const json = readFileSync(path);
    addresses = JSON.parse(json);
  }

  return addresses;
}

function recordAddress(path:string, chainId:number, name:string, address:string) {
  let addresses = getAddressAll(path);

  const newAddresses = { [name]: { [chainId]: address } };
  const updatedAddresses = _.merge(addresses, newAddresses);

  const newJson = JSON.stringify(updatedAddresses, null, 2);
  writeFileSync(path, newJson);
}

export const getUnderlyingTokens = getAddressAll.bind(null, TOKEN_ADDRESSES_PATH);
export const getCTokenAddresses = getAddressAll.bind(null, ZTOKEN_ADDRESSES_PATH);
export const getMainAddresses = getAddressAll.bind(null, MAIN_ADDRESSES_PATH);

export const recordMainAddress = recordAddress.bind(null, MAIN_ADDRESSES_PATH);
export const recordTokenAddress = recordAddress.bind(null, TOKEN_ADDRESSES_PATH);
export const recordCTokenAddress = recordAddress.bind(null, ZTOKEN_ADDRESSES_PATH);
