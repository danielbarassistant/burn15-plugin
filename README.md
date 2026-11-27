# Burn15 agent plugin

![Burn15](icon.svg)

Publisher: oxygenDrop. Website: https://burn15.com/.

This skills-only plugin creates, reads, and burns temporary encrypted notes using the existing Burn15 API. It requires Node.js 24+ and an execution environment with outbound HTTPS access to burn15.com. The helper has no third-party dependencies.

Encryption occurs in the assistant's execution environment before upload. Burn15 receives encrypted payloads, not plaintext or encryption keys. The assistant and its execution/conversation environment can still see text and complete links. The browser application remains unchanged.

Notes expire 15 minutes after creation, support repeated reads, and allow manual burning. Burning removes live ciphertext; it cannot revoke copies or provider backups. Read the skill for full behavior and error handling.

The package contains root `plugin.json` for portable clients and `.claude-plugin/plugin.json` for Claude compatibility. There is no remote MCP server in this package. It is not an MCP Registry submission.

## Usage

Ask your assistant to use Burn15 to share selected text as a link that expires in 15 minutes, to read a supplied Burn15 link, or to burn a specified note. The assistant follows the included skill and uses the helper when a compatible execution environment is available. If execution is unavailable, the skill directs you to the website and does not claim to have created a note.

The helper sends HTTPS requests only to burn15.com. Creating sends ciphertext, a nonce, and a hashed lookup identifier. Reading and burning send the identifier. The helper does not install dependencies, launch background services, access stored credentials, or collect analytics. It reads standard input and writes its result to standard output. The skill may create a temporary input file and instructs the assistant to remove it after use.

Notes can contain personal information chosen by the user. The assistant provider and its execution environment can see that information before encryption and after decryption. Anyone holding the complete link can read or burn the note. Do not use this as a password manager or as a guarantee of secure erasure.

## Privacy, support, and license

- [Privacy and retention](PRIVACY.md)
- [Support](SUPPORT.md)
- [MIT license for this plugin](LICENSE)

The plugin has interoperability tests for browser encryption/decryption, tamper rejection, expiry, burning, input validation, and uncertain network writes. A synthetic production note was created, read, and burned successfully. Directory approval and testing on each assistant surface remain separate from these checks. This repository is a submission artifact, not evidence of acceptance or publication.

