# Burn15 browser plugin privacy notice

Effective 27 November 2026. Publisher: oxygenDrop. Contact: danielbarassistant@gmail.com.

This plugin provides instructions for using https://burn15.com/ through an assistant's existing browser tools. It contains no executable helper, hooks, package installation, or MCP server. No Burn15 account or payment is required.

## Information processed

The assistant and browser environment see the note text and complete links you ask them to use. Their providers' own privacy and retention policies apply. The plugin does not search unrelated tabs, files, contacts, or stored credentials, and it does not collect analytics.

Burn15's website encrypts note text in the browser before sending it to burn15.com. The server receives an encrypted payload, a random nonce, a protocol version, and a hashed lookup identifier, and stores creation and expiry timestamps. Read and burn requests send the lookup identifier. The decryption key stays in the link fragment and is not sent to Burn15. Anyone with the complete link can read or burn the note.

Cloudflare hosts Burn15 and its encrypted database. It processes network requests and connection information, including IP addresses, to operate and protect the service. The plugin does not control provider infrastructure logs or policies.

## Retention and deletion

Notes become unavailable through the service 15 minutes after creation, or earlier after a successful manual burn. Reads are allowed repeatedly until then. Expired encrypted records are purged during later view activity or an open viewer's expiry request. There is no scheduled purge, so unused expired records can remain until that activity occurs. A successful manual burn deletes the live row.

Cloudflare database backup history may retain encrypted records for 7–30 days depending on the hosting plan. A person with both a recoverable encrypted record and its original link could decrypt it. Burning does not erase recipient copies, screenshots, clipboard contents, assistant history, or backups.

## Your choices

Share only text you intend the assistant and link recipients to see. Use the website's burn control to delete a particular live note. Never post secret text or a complete note link in a public support issue. Privacy questions can be sent to danielbarassistant@gmail.com. Information sent by email is handled by that email service and is not subject to the note's 15-minute expiry.

