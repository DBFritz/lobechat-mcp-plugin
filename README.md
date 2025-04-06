# Lobe Chat MCP and OpenAPI Plugin Server

A server that allows you to connect to MCP (Model Context Protocol) servers and OpenAPI servers and use them as plugins in LobeChat.


## Quick Start

1. Create a `config.json` file (or copy from `config.example.json`):

```json
{
  "publicUrl": "http://localhost:3000",
  "upstream": [],
  "servers": {
    "example": {
      "type": "mcp:sse",
      "url": "http://localhost:8080/v1",
      "options": {
        "eventSourceInit": {}
      },
      "author": "Your Name",
      "createdAt": "2023-01-01",
      "homepage": "https://github.com/username/your-project",
      "meta": {
        "avatar": "https://example.com/avatar.png",
        "title": "Example MCP Plugin",
        "description": "An example MCP plugin for LobeChat",
        "tags": ["example", "mcp"]
      }
    }
  }
}
```

2. Start the server:

```bash
# Start with default config.json in current directory
npx -y lobechat-mcp-plugin

# Or specify a config file path
CONFIG_PATH=./my-config.json npx -y lobechat-mcp-plugin

# Specify a custom port (default is 3000)
PORT=8080 npx -y lobechat-mcp-plugin
```

3. Add the plugin to LobeChat by following the steps in the [LobeChat documentation](https://lobehub.com/docs/usage/plugins/custom-plugin#installing-custom-plugins):
  - In the chat window, open the plugin list in the toolbar
  - Open the plugin store
  - Add a new custom plugin
  - Provide the Manifest URL: `http://localhost:3000/<plugin-name>/manifest.json`
  - Install the plugin

By making this way, the plugin does not get automatically updated when you restart the server or the API changes. In order to always fetch the latest version, you can make the server your default marketplace by configuring the `PLUGINS_INDEX_URL` enviroment variable with the url of your lobechat-mcp-plugin server (e.g. `http://localhost:3000`). In that case you will be able to see all the plugins in the `/discover/plugins` page from your lobechat instance.[^1]

[^1]: The plugins view in the marketplace is cached, so it can take up to 12 hours for any new plugin or modification to appear. The store inside the chat always shows the latest plugins.

## Defining the configuration options

### MCP SSE Server

For connecting to an MCP server over SSE:

```json
{
  "type": "mcp:sse",
  "url": "http://localhost:8080/v1",
  "options": {
    "eventSourceInit": {}, // for customizing the first request, you can provide auth headers for example
    "sourceInit": {}, // for customizing subsequent requests
  },
  // ... other metadata
}
```

### MCP Command Server

For spawning a local command that implements MCP:

```json
{
  "type": "mcp:command",
  "command": "python",
  "args": ["mcp_server.py"],
  "env": {}, // for customizing the environment variables
  // ... other metadata
}
```

The commands are executed in the same host as the lobechat-mcp-plugin server, so provide a valid path to the command.


## Localization

The server supports localization of the plugin metadata. The metadata can be provided for a specific language by adding a `meta:<language>` property to the plugin configuration. The language should be a valid IETF language tag.

```json
{
  ...
  "servers": {
    "example": {
      ...
      "meta:es-ES": {
        "title": "Ejemplo de plugin MCP",
        "description": "Un ejemplo de plugin MCP para LobeChat"
      }
    }
  }
}
```

## Development

### API Endpoints

The server provides the following endpoints:

  - `GET /` or `GET /index*.json` - Returns a list of available plugins, combining local plugins with upstream plugins. Used for listing the plugins in the marketplace.
  - `GET /:identifier/manifest.json` - Returns the manifest for a specific plugin, including its tools and metadata. Used for installing the plugin.
  - `POST /gateway` - Serves as a gateway for Lobe Chat plugin interactions. This is the main entrypoint for every request from Lobe Chat to the any plugin.
  - `POST /:identifier/:name` - Handles tool calls for a specific plugin tool, passing the request body as arguments. This is redirected internally by the gateway to run the tool.

## Development

```bash
# Clone the repository
git clone <repository-url>
cd lobechat-mcp-plugin

# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build
```