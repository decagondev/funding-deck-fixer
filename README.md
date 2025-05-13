# Funding Deck Fixer

A web application that helps analyze and improve startup pitch decks.

## Features

- Analyze pitch deck content for clarity and investor appeal
- Get slide-by-slide feedback
- Identify missing elements in your pitch deck
- Get actionable recommendations to improve your deck
- API documentation with Swagger

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the server:

```bash
node src/main.js
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

3. The application should now be running. You should see a "Server connected and ready" message at the top of the page if everything is working correctly.

## API Documentation

The API is documented using Swagger UI. You can access the Swagger UI by navigating to:

```
http://localhost:3000/api-docs
```

This provides:
- Interactive documentation
- Ability to test API endpoints directly from the browser
- Detailed request and response schemas

### Available Endpoints

- `GET /api/status` - Check the API status
- `POST /api/analyze` - Analyze pitch deck content

## Usage

1. Paste your pitch deck content into the text area (separate slides with blank lines)
2. Click "Analyze Deck"
3. View the detailed feedback and recommendations

## Troubleshooting

If you see "Server not connected" error:
- Make sure the server is running on port 3000
- Check for any errors in the console where you started the server
- Ensure no firewall is blocking localhost connections