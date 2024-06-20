import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

const OPENAI_API_KEY_SETTING = 'djangoTestGenerator.openaiApiKey';

async function generateTestCode(fileContent: string): Promise<string> {
    const apiKey = vscode.workspace.getConfiguration().get<string>(OPENAI_API_KEY_SETTING);
    if (!apiKey) {
        vscode.window.showErrorMessage('OpenAI API Key is not set. Please set it in the extension settings.');
        return '';
    }

    const prompt = `Generate pytest test code for the following Django view file:\n\n${fileContent}`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error generating test code: ${error.message}`);
        } else {
            vscode.window.showErrorMessage(`Unknown error generating test code.`);
        }
        return '';
    }
}

async function insertTestCode(testFileUri: vscode.Uri, testCode: string) {
    const document = await vscode.workspace.openTextDocument(testFileUri);
    const edit = new vscode.WorkspaceEdit();
    edit.insert(testFileUri, new vscode.Position(document.lineCount, 0), testCode);
    await vscode.workspace.applyEdit(edit);
    await document.save();
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateDjangoTest', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const fileName = document.fileName;

        if (fileName.endsWith('views.py') || fileName.endsWith('api.py')) {
            const fileContent = document.getText();
            const testCode = await generateTestCode(fileContent);
            if (!testCode) {
                return;
            }

            const testFileName = path.join(path.dirname(fileName), 'test.py');
            const testFileUri = vscode.Uri.file(testFileName);

            if (!fs.existsSync(testFileName)) {
                await vscode.workspace.fs.writeFile(testFileUri, Buffer.from(''));
            }

            await insertTestCode(testFileUri, testCode);
            vscode.window.showInformationMessage('Django test file generated!');
        } else {
            vscode.window.showInformationMessage('This command is only applicable to Django view or API files.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
