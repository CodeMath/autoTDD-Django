# Django Test Generator

Django Test Generator is a VSCode extension that helps you automatically generate test code for your Django views and APIs using the OpenAI API.

## Features

- Automatically generate pytest test code for `views.py` and `api.py` files.
- Insert generated test code into the appropriate `test.py` file in your Django app.
- Easily configurable with your OpenAI API key.

## Installation

1. Download the extension as a `.vsix` file or install directly from the VSCode Marketplace (if published).
2. Open the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Click on the `...` menu and select `Install from VSIX...`.
4. Select the downloaded `.vsix` file to install.

## Usage

1. Open a Django project's `views.py` or `api.py` file.
2. Press `Ctrl+Shift+P` to open the Command Palette.
3. Type `Generate Django Test` and press `Enter`.
4. The extension will read the content of the file, generate test code using OpenAI API, and insert it into `test.py`.

## Configuration

You need to set your OpenAI API key in the extension settings:
1. Go to `File > Preferences > Settings` (or press `Ctrl+,`).
2. Search for `Django Test Generator` and enter your OpenAI API key.

## Requirements

- Visual Studio Code
- Node.js and npm
- OpenAI API key

## Known Issues

- Ensure that your OpenAI API key is valid and has sufficient quota.

## Release Notes

### 0.0.1

- Initial release of Django Test Generator.

## License

MIT
