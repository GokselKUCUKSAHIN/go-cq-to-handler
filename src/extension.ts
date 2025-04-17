// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class GoHandlerCodeLensProvider implements vscode.CodeLensProvider {
	private regex = {
		command: /type\s+(\w+Command)\s+struct/,
		query: /type\s+(\w+Query)\s+struct/
	};

	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
		// Only provide CodeLenses for Go files
		if (document.languageId !== 'go') {
			return [];
		}

		const text = document.getText();
		const codeLenses: vscode.CodeLens[] = [];

		const lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Check for Command struct
			const commandMatch = line.match(this.regex.command);
			if (commandMatch) {
				const range = document.lineAt(i).range;
				const commandName = commandMatch[1];
				// Make sure we keep the 'Command' part when generating the handler name
				let handlerName = commandName.replace(/Command$/, '') + 'CommandHandler';
				
				// Also check for handlers with lowercase first letter (camelCase)
				const handlerNames = [
					handlerName, 
					handlerName.charAt(0).toLowerCase() + handlerName.slice(1)
				];
				
				codeLenses.push(new vscode.CodeLens(range, {
					title: `➜ Go to ${handlerName}`,
					command: 'go-cq-to-handler.navigateToHandler',
					arguments: [handlerNames]
				}));
			}
			
			// Check for Query struct
			const queryMatch = line.match(this.regex.query);
			if (queryMatch) {
				const range = document.lineAt(i).range;
				const queryName = queryMatch[1];
				// Make sure we keep the 'Query' part when generating the handler name
				let handlerName = queryName.replace(/Query$/, '') + 'QueryHandler';
				
				// Also check for handlers with lowercase first letter (camelCase)
				const handlerNames = [
					handlerName, 
					handlerName.charAt(0).toLowerCase() + handlerName.slice(1)
				];
				
				codeLenses.push(new vscode.CodeLens(range, {
					title: `➜ Go to ${handlerName}`,
					command: 'go-cq-to-handler.navigateToHandler',
					arguments: [handlerNames]
				}));
			}
		}

		console.log(`Found ${codeLenses.length} CodeLenses in ${document.fileName}`);
		return codeLenses;
	}
}

async function findHandlerFile(handlerName: string): Promise<string | undefined> {
	console.log(`Searching for handler: ${handlerName}`);
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		return undefined;
	}

	const handlerRegex = new RegExp(`type\\s+(${handlerName}|${handlerName.charAt(0).toLowerCase() + handlerName.slice(1)})\\s+struct`, 'i');
	
	const files = await vscode.workspace.findFiles('**/*.go');
	for (const file of files) {
		const content = fs.readFileSync(file.fsPath, 'utf8');
		
		if (handlerRegex.test(content)) {
			console.log(`Found handler in file: ${file.fsPath}`);
			return file.fsPath;
		}
	}
	console.log(`Handler not found: ${handlerName}`);
	return undefined;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Go Command/Query to Handler extension is now active!');

	// Register CodeLens provider for Go files
	const codeLensProvider = new GoHandlerCodeLensProvider();
	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(
			{ language: 'go' },
			codeLensProvider
		)
	);

	// Register command
	context.subscriptions.push(
		vscode.commands.registerCommand('go-cq-to-handler.navigateToHandler', async (handlerNamesArg: string | string[]) => {
			// Convert to array if it's a single string
			const handlerNames = Array.isArray(handlerNamesArg) ? handlerNamesArg : [handlerNamesArg];
			
			console.log(`Looking for handlers: ${handlerNames.join(', ')}`);
			
			// Try to find any of the handler variants
			let handlerFile: string | undefined;
			let foundHandlerName: string | undefined;
			
			for (const handlerName of handlerNames) {
				handlerFile = await findHandlerFile(handlerName);
				if (handlerFile) {
					foundHandlerName = handlerName;
					break;
				}
			}
			
			if (handlerFile && foundHandlerName) {
				const document = await vscode.workspace.openTextDocument(handlerFile);
				await vscode.window.showTextDocument(document);
				
				// Find and highlight the handler struct
				const text = document.getText();
				const lines = text.split('\n');
				
				// Create a regex to match the handler struct with case insensitivity
				const handlerRegex = new RegExp(`type\\s+(${foundHandlerName}|${foundHandlerName.charAt(0).toLowerCase() + foundHandlerName.slice(1)})\\s+struct`, 'i');
				
				for (let i = 0; i < lines.length; i++) {
					if (handlerRegex.test(lines[i])) {
						const position = new vscode.Position(i, 0);
						vscode.window.activeTextEditor?.revealRange(
							new vscode.Range(position, position),
							vscode.TextEditorRevealType.InCenter
						);
						break;
					}
				}
			} else {
				const handlerNamesStr = handlerNames.join(' or ');
				vscode.window.showWarningMessage(`Handler ${handlerNamesStr} not found.`);
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
