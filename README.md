# Go Command/Query to Handler

Easy navigation between Go Commands/Queries and their corresponding Handlers.

## Features

This extension provides easy navigation from Command and Query structures to their corresponding Handler implementations in Go projects.

- Automatically detects Command and Query structs in Go files
- Shows CodeLens links to quickly navigate to the associated Handler
- Supports both PascalCase and camelCase naming conventions
- Works across multiple files and packages

## Usage

1. Open a Go file containing Command or Query structs
2. A CodeLens link will appear above Command/Query struct definitions
3. Click the link to navigate to the corresponding Handler

### Commands Example

```go
// Command in commands/create_user.go
type CreateUserCommand struct {
    Name  string
    Email string
}

// Handler in handlers/create_user_handler.go
type CreateUserCommandHandler struct {
    repository Repository
}
```

### Queries Example

```go
// Query in queries/get_user.go
type GetUserQuery struct {
    ID string
}

// Handler in handlers/get_user_handler.go
type GetUserQueryHandler struct {
    repository Repository
}
```

## Requirements

- Visual Studio Code
- Go language files

## Extension Settings

This extension doesn't require any specific settings.

## Known Issues

None at this time.

## Release Notes

### 0.0.1

Initial release of Go Command/Query to Handler
- Added support for Command to CommandHandler navigation
- Added support for Query to QueryHandler navigation

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
