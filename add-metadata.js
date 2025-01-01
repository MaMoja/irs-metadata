import { createV1, findMetadataPda, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { signerIdentity, publicKey } from '@metaplex-foundation/umi';
import fs from 'fs';

const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplTokenMetadata());

// Load keypair
const walletFile = fs.readFileSync('/Users/mamoja/Documents/my-keypair.json');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(walletFile)));
umi.use(signerIdentity(keypair));

// Define mint address and metadata
const mint = publicKey('EP2XbbG7fnjjAbqKdrSDxk7XkFbx6zQZRDiKA1vGkDHv');
const tokenMetadata = {
  name: 'Inu Revenue Service',
  symbol: 'IRS',
  uri: 'https://raw.githubusercontent.com/MaMoja/irs-metadata/main/metadata.json', // Hosted JSON
};

async function addMetadata() {
  try {
    // Find metadata account
    const metadataAccountAddress = await findMetadataPda(umi, { mint });

    // Add metadata
    const tx = await createV1(umi, {
      mint,
      authority: umi.identity,
      payer: umi.identity,
      updateAuthority: umi.identity,
      name: tokenMetadata.name,
      symbol: tokenMetadata.symbol,
      uri: tokenMetadata.uri,
      sellerFeeBasisPoints: 0, // No royalties
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);

    console.log(`Metadata added successfully! View transaction: https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`);
  } catch (error) {
    console.error('Error adding metadata:', error);
  }
}

// Run the function
addMetadata();
