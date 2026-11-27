# Burn15 by oxygenDrop

Share selected text through a browser-encrypted note that expires 15 minutes after creation at https://burn15.com/.

This browser-based Claude plugin contains instructions only. When your assistant has browser tools, it can help you create a note, read an explicitly supplied Burn15 link, or manually burn a specified note through the website. Otherwise, it gives you the website link and clear steps. It does not claim to complete actions it cannot perform.

This bundle contains no executable helper, package installation, hook, or MCP server. It uses only the assistant host's existing browser capabilities. The website encrypts text in the browser before sending ciphertext to Burn15. The assistant, browser environment, and conversation history may see the text and complete link. Burn15 itself receives encrypted content and a hashed lookup identifier, not the plaintext or decryption key.

No Burn15 account or payment is required. Notes support repeated reads until expiry or manual burning. Burning removes the live encrypted record but does not erase screenshots, recipient copies, assistant history, or provider backups. Expired ciphertext may remain until a subsequent view triggers cleanup. This is not an OTP generator, an SMS inbox, or a password manager.

The only destination this plugin asks the browser to visit for note operations is burn15.com. It does not inspect unrelated tabs, contacts, credentials, or files, collect analytics, or share note links with other people unless you ask it to.

- [Privacy and retention](PRIVACY.md)
- [Support](SUPPORT.md)
- [Plugin license](LICENSE)

Publisher: oxygenDrop. Contact: danielbarassistant@gmail.com. This package is prepared for directory review; it is not evidence of approval or publication.

