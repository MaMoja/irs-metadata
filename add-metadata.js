const { Connection, PublicKey, Keypair, Transaction } = require('@solana/web3.js');
const {
  createCreateMetadataAccountV2Instruction,
  DataV2,
  MetadataProgram,
} = require('@metaplex-foundation/mpl-token-metadata');

(async () => {
  // Set up Solana connection
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Replace with your token's mint address and keypair path
  const mintAddress = new PublicKey('EP2XbbG7fnjjAbqKdrSDxk7XkFbx6zQZRDiKA1vGkDHv');
  const keypair = Keypair.fromSecretKey(new Uint8Array(require('./path/to/your-keypair.json')));

  // Define metadata
  const metadataPDA = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      MetadataProgram.PUBKEY.toBuffer(),
      mintAddress.toBuffer(),
    ],
    MetadataProgram.PUBKEY
  );

  const metadata = {
    name: 'Inu Revenue Service',
    symbol: 'IRS',
    uri: 'https://irs.dog/metadata.json', // Hosted metadata JSON
    sellerFeeBasisPoints: 0,
    creators: [
      {
        address: keypair.publicKey.toBase58(),
        verified: true,
        share: 100,
      },
    ],
  };

  const instruction = createCreateMetadataAccountV2Instruction({
    metadata: metadataPDA[0],
    mint: mintAddress,
    mintAuthority: keypair.publicKey,
    payer: keypair.publicKey,
    updateAuthority: keypair.publicKey,
  }, {
    data: metadata,
    isMutable: true,
  });

  // Send transaction
  const transaction = new Transaction().add(instruction);
  const txSignature = await connection.sendTransaction(transaction, [keypair]);
  console.log('Metadata added successfully! Transaction Signature:', txSignature);
})();

