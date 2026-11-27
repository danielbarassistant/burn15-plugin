# Burn15 plugin privacy notice

Effective 27 November 2026. Publisher: oxygenDrop. Contact: danielbarassistant@gmail.com.

The Burn15 plugin helps an AI assistant create, read, and manually burn encrypted notes at https://burn15.com/. No Burn15 account or payment is required.

## Data processed

The assistant receives the text or complete note link that you choose to supply. Its bundled Node.js helper encrypts and decrypts in the assistant's execution environment. That environment may be local to your computer or hosted by your assistant provider. The assistant provider's own data handling and conversation retention rules also apply.

For creation, the helper sends an encrypted payload, a random nonce, a protocol version, and a hashed lookup identifier over HTTPS to burn15.com. Burn15 stores those values together with creation and expiry timestamps. Reading and burning send the lookup identifier. The helper does not send the plaintext or the decryption key to Burn15. Anyone with the complete link can read or burn the note.

The plugin only contacts burn15.com. It has no analytics or advertising code, account connection, access to contacts, or credential collection. It reads the input explicitly supplied to its command and does not search unrelated files for notes. The skill may use a temporary input file when the execution tool cannot supply standard input directly; it instructs the assistant to remove that file after use. Removal is not a guarantee of secure erasure.

## Hosting and retention

Cloudflare hosts Burn15 and its encrypted database. Cloudflare processes network requests, including connection information such as IP addresses, to deliver and protect the service. This plugin does not control the hosting provider's infrastructure logs or policies.

Notes become unavailable through Burn15 15 minutes after creation, or earlier after a successful manual burn. Reads are allowed repeatedly until then. Expired encrypted records are deleted during later view activity or an open viewer's expiry request; there is no scheduled purge, so unused expired records may remain until that activity occurs. A manual burn deletes the live encrypted row when the server confirms success.

Cloudflare database backup history may retain prior encrypted records for 7–30 days, depending on the hosting plan. A person with both a recoverable encrypted record and the original link could decrypt the note. Burning cannot erase recipient copies, screenshots, clipboard contents, assistant conversation history, or provider backups.

## Your choices and contact

Only share text you intend the assistant and link recipients to see. Use the burn command or website to delete a particular live note. Do not put note text, full note links, or keys into public support issues. Contact danielbarassistant@gmail.com for privacy questions. Any information you voluntarily send by email is handled in that email service; it is not covered by the note's 15-minute expiry.

