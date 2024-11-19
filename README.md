# DocHandler

A self-hosted personal assistant powered by Ollama with vector storage for document indexing and retrieval.

## Requirements

- Node.js 18+ (for development only)
- Ollama (required for LLM functionality)
- 8GB RAM recommended
- 10GB+ disk space for document storage

## Installation

### Windows

1. Download the latest Windows release (`dochandler-win-x64.zip`)
2. Extract the archive
3. Run `install.ps1` with PowerShell:
   ```powershell
   .\install.ps1
   ```

### Linux/macOS

1. Download the latest release for your platform (`dochandler-linux-x64.tar.gz` or `dochandler-macos-x64.tar.gz`)
2. Extract the archive
3. Run the installation script:
   ```bash
   ./install.sh
   ```

## Configuration

Edit the `.env` file in the installation directory to configure:

- Port settings
- Ollama connection
- External API keys (if using OpenAI/Anthropic)
- Document processing settings

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for distribution:
   ```bash
   ./scripts/build.sh
   ```

## Features

- Integration with Ollama models
- Document indexing and semantic search
- File and folder upload support
- Persistent conversation memory
- Project-based document organization
- Scheduled indexing of document folders

## License

MIT