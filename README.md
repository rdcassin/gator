# Gator - RSS Feed CLI Tool 🐊

A command-line RSS feed aggregator that helps you stay up to date with your favorite blogs and news sources.

## Prerequisites

* Node.js (version 16 or higher)
* npm or yarn
* PostgreSQL database

## Installation

1.  **Clone this repository:**
    ```bash
    git clone [https://github.com/your-username/gator-cli.git](https://github.com/your-username/gator-cli.git) # Replace with your repo URL
    cd gator-cli
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
4.  **(Optional) Install globally:**
    If you install globally, you can run `gator <command>` directly from any directory.
    ```bash
    npm install -g .
    ```

## Configuration

Create a `.gatorconfig.json` file in your **home directory** (e.g., `~/.gatorconfig.json` on Linux/macOS, `C:\Users\YourUser\.gatorconfig.json` on Windows) with the following structure:

```json
{
  "db_url": "postgres://username:password@localhost/gator?sslmode=disable",
  "current_user_name": "your_username"
}
```

* db_url: Your PostgreSQL database connection string. Ensure the database gator exists and the user has permissions.
* current_user_name: The username you wish to register or use as the default.

## Usage

Commands are executed using npm start <command> (if not installed globally) or simply gator <command> (if installed globally).

### Basic Commands

**`npm start register <username>`**
Register a new user. You need to do this once for each user.
Example: `npm start register john`

**`npm start login <username>`**
Switch to a different user. This changes the active user context for subsequent commands.
Example: `npm start login jane`

**`npm start addfeed <name> <url>`**
Add a new RSS feed to the system. This feed becomes available for any user to follow.
Example: `npm start addfeed "Tech News" https://example.com/rss`

**`npm start feeds`**
List all available RSS feeds that have been added to the system.

**`npm start follow <feed_name>`**
Follow an existing feed for the currently logged-in user. You will start seeing posts from this feed when you browse.
Example: `npm start follow "Tech News"`

**`npm start browse [limit]`**
Browse recent posts from all feeds currently followed by the active user.
[limit] (optional): The maximum number of posts to display. Defaults to a sensible number if not specified (e.g., 20).
Example: `npm start browse 10`
Example (default limit): `npm start browse`

## Example Workflow

```bash
# Register a new user
npm start register john

# Log in as that user (optional, but good practice if you have multiple users)
npm start login john

# Add a new feed to the system
npm start addfeed "Tech News" https://example.com/rss

# Follow the newly added feed
npm start follow "Tech News"

# Browse the latest 10 posts from all followed feeds
npm start browse 10
```

## Troubleshooting

- **Database connection issues**: Make sure PostgreSQL is running and the database URL is correct
- **Permission errors**: Ensure your PostgreSQL user has the necessary permissions
- **Command not found**: If using `npm start`, make sure you're in the project directory