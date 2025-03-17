# Medium Article Scraper

A robust Python-based web scraper for extracting comprehensive information from Medium articles. This project is designed to collect detailed data from Medium articles for analysis and research purposes.

## Features

- Scrapes detailed information from Medium articles including:
  - Article title
  - Author information and profile URL
  - Article content
  - Claps count
  - Reading time
  - Subtitles
  - Image sources

- Built-in features:
  - Robust error handling
  - Progress tracking with checkpoints
  - Random delays to respect rate limits
  - Failed URL tracking
  - Data cleaning and normalization

## Project Structure

- `Medium_Article_Scraper.ipynb`: Main Jupyter notebook containing the scraper implementation
- `medium_articles_full.csv`: Output file containing scraped article data
- `failed_urls.csv`: Log of URLs that failed during scraping

## Requirements

- Python 3.x
- Required libraries:
  - requests
  - beautifulsoup4
  - pandas
  - tqdm

## Usage

1. Ensure all required libraries are installed
2. Place your input URLs in a CSV file named 'url_technology.csv'
3. Run the Jupyter notebook cells sequentially
4. The script will automatically:
   - Process up to 500 articles
   - Save checkpoints every 50 articles
   - Create a final CSV with all successfully scraped data
   - Log any failed URLs separately

## Output

The scraper generates a comprehensive CSV file containing:
- Article metadata (title, author, etc.)
- Content analysis (reading time, claps)
- Full article text
- Image sources
- Error logs for failed scraping attempts