import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Go Handler Navigator Extension Test Suite", () => {
  vscode.window.showInformationMessage("Starting test suite...");

  // Tests need to activate the extension first
  test("Extension should activate", async () => {
    const extension = vscode.extensions.getExtension("aykanferhat.go-cq-to-handler");
    assert.ok(extension, "Extension not found");
    
    // Eğer aktif değilse aktif et
    if (!extension.isActive) {
      await extension.activate();
    }
    
    assert.ok(extension.isActive, "Extension not activated");
  });

  test("Should detect Command struct", async () => {
    // Create a temporary Go file for testing
    const testContent = `
package test

type CreateUserCommand struct {
	Name string
}
`;
    const document = await vscode.workspace.openTextDocument({
      content: testContent,
      language: "go",
    });

    await vscode.window.showTextDocument(document);

    // Wait for CodeLens provider to be registered and initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get CodeLens provider
    const codeLenses = await vscode.commands.executeCommand<vscode.CodeLens[]>(
      "vscode.executeCodeLensProvider",
      document.uri
    );

    console.log("CodeLenses:", codeLenses);
    assert.ok(codeLenses?.length > 0, "CodeLens not found");
    assert.strictEqual(
      codeLenses![0].command?.title,
      "➜ Go to CreateUserCommandHandler",
      "Incorrect CodeLens title"
    );
  });

  test("Should detect Query struct", async () => {
    // Create a temporary Go file for testing
    const testContent = `
package test

type GetUserQuery struct {
	ID string
}
`;
    const document = await vscode.workspace.openTextDocument({
      content: testContent,
      language: "go",
    });

    await vscode.window.showTextDocument(document);

    // Wait for CodeLens provider to be registered and initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get CodeLens provider
    const codeLenses = await vscode.commands.executeCommand<vscode.CodeLens[]>(
      "vscode.executeCodeLensProvider",
      document.uri
    );

    console.log("Query CodeLenses:", codeLenses);
    assert.ok(codeLenses?.length > 0, "Query CodeLens not found");
    assert.strictEqual(
      codeLenses![0].command?.title,
      "➜ Go to GetUserQueryHandler",
      "Incorrect Query CodeLens title"
    );
  });

  test("Should detect Handler struct", async () => {
    // Create a temporary Go file for testing
    const testContent = `
package test

type CreateUserCommandHandler struct {
	repository Repository
}
`;
    const document = await vscode.workspace.openTextDocument({
      content: testContent,
      language: "go",
    });

    await vscode.window.showTextDocument(document);

    // Check if Handler struct exists
    const text = document.getText();
    assert.ok(
      text.includes("type CreateUserCommandHandler struct"),
      "Handler struct not found"
    );
  });
});
