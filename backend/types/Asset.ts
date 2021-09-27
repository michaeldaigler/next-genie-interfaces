
import {WyvernProtocol } from 'opensea-js'
import { WyvernSchemaName } from 'opensea-js/lib/types';
export interface Asset
{
    // The asset's token ID, or null if ERC-20
    tokenId: string | null,
    // The asset's contract address
    tokenAddress: string,
    // The Wyvern schema name (defaults to "ERC721") for this asset
    schemaName?: WyvernSchemaName,
    // Optional for ENS names
    name?: string,
    // Optional for fungible items
    decimals?: number
  }