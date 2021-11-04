import {BigNumber,utils} from 'ethers'

export function expandToDecimals(n: number,l: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(l))
}

export function formatBytes32String(text: string): string {
  return utils.formatBytes32String(text);
}

export function bigNumberify(value: any): BigNumber {
  return BigNumber.from(value);
}




