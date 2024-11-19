#!/bin/bash

# DocHandler Installation Script
echo "Installing DocHandler..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama not found. Would you like to install it? (y/N)"
    read -r install_ollama
    if [[ $install_ollama =~ ^[Yy]$ ]]; then
        curl https://ollama.ai/install.sh | sh
    else
        echo "Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
fi

# Create necessary directories
mkdir -p ~/.dochandler/data/{vectors,db}

# Copy application files
cp -r dist/* ~/.dochandler/
cp .env.example ~/.dochandler/.env

# Set permissions
chmod +x ~/.dochandler/dochandler

# Create desktop entry
cat > ~/.local/share/applications/dochandler.desktop << EOL
[Desktop Entry]
Name=DocHandler
Exec=~/.dochandler/dochandler
Icon=~/.dochandler/logo.svg
Type=Application
Categories=Office;
EOL

echo "Installation complete! You can now run DocHandler from your applications menu or by running 'dochandler' in terminal."