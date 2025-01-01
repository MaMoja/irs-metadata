import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, signerIdentity, publicKey, percentAmount } from '@metaplex-foundation/umi';
import { createNft, fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import fs from 'fs';

// Initialize Umi instance with RPC URL
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplTokenMetadata());

// Load wallet keypair
const keypairPath = '/Users/mamoja/Docuemnts/my-keypair.json';
const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, 'utf8')))
);

// Use the wallet for signing transactions
umi.use(signerIdentity(keypair));

// Token mint address
const mintAddress = publicKey('EP2XbbG7fnjjAbqKdrSDxk7XkFbx6zQZRDiKA1vGkDHv');

// Add metadata to the token
async function addMetadata() {
  try {
    const mint = generateSigner(umi);
    const metadataUri = 'https://raw.githubusercontent.com/MaMoja/irs-metadata/main/metadata.json';

    console.log('Creating metadata...');
    await createNft(umi, {
      mint,
      name: 'Inu Revenue Service',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0), // No royalties
    }).sendAndConfirm(umi);

    console.log('Fetching metadata...');
    const asset = await fetchDigitalAsset(umi, mint.publicKey);

    console.log('Metadata added successfully:', asset);
  } catch (error) {
    console.error('Error adding metadata:', error);
  }
}

addMetadata();
