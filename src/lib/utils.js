import { ethers } from 'ethers'

export function toBytes32(string) {
  return ethers.utils.formatBytes32String(string);
}
export function fromBytes32(string) {
  return ethers.utils.parseBytes32String(string);
}
export function formatUnits(number, units) {
  if (!units) units = 6; // usdc
  return ethers.utils.formatUnits(number, units);
}
export function parseUnits(number, units) {
  if (!units) units = 6; // usdc
  if (typeof(number) == 'number') number = number.toString();
  return ethers.utils.parseUnits(number, units);
}