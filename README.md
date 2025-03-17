# Medium Article Search Engine

A Flask-based web application that allows users to search through Medium articles using a modern, responsive interface.

## Live Demo

The application is deployed and accessible at:
[https://data-scraper-flask-api.vercel.app/](https://data-scraper-flask-api.vercel.app/)

## Project Overview

This project consists of two main parts:
1. Data Collection: A web scraper that collected 500 Medium articles with comprehensive information
2. Search Interface: A Flask API with a modern frontend to search through the collected articles

## Features

### Data Collection
- Scraped 500 Medium articles including:
  - Article titles and URLs
  - Author information
  - Claps count and reading time
  - Content and subtitles
  - Image sources

### Search API
- RESTful Flask API with fuzzy search capability
- Search through article titles with partial matching
- Returns detailed article information in JSON format
- Includes match percentage for search relevance

### Frontend Interface
- Modern, responsive design
- Real-time search functionality
- Clean card-based results display
- Match percentage indicators
- Reading time and claps count display
- Direct links to articles
- Mobile-friendly layout

## Project Structure

```
├── app.py                      # Flask application
├── data/
│   └── medium_articles_full.csv # Scraped articles data
├── requirements.txt            # Python dependencies
├── vercel.json                # Vercel deployment configuration
├── static/                     # Static assets
│   ├── script.js              # Frontend JavaScript
│   └── style.css              # CSS styles
└── templates/                  # HTML templates
    └── index.html             # Main search page
```

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Access the application at:
- http://localhost:5000

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Sign up on [Vercel](https://vercel.com)
3. Import your forked repository
4. Vercel will automatically detect it as a Python project
5. The deployment will use the configuration in `vercel.json`

## API Endpoints

- `GET /`: Main search interface
- `GET /search?keyword=<search_term>`: Search API endpoint
  - Returns JSON with matching articles
  - Includes match percentage and article details

## Search Features

- Fuzzy matching for better search results
- Match percentage indication
- Results sorted by relevance
- Limited to top 20 most relevant results
- Handles partial matches and typos

## Technical Details

- Frontend: HTML5, CSS3, JavaScript
- Backend: Python Flask
- Search Algorithm: Fuzzy string matching
- Data Storage: CSV
- UI Framework: Bootstrap 5
- Icons: Font Awesome
- Deployment: Vercel