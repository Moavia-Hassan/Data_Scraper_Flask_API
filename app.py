from flask import Flask, request, jsonify, render_template
import pandas as pd
from fuzzywuzzy import fuzz
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def load_articles():
    try:
        df = pd.read_csv('medium_articles_full.csv')
        # Fill NaN values with empty strings or appropriate defaults
        df = df.fillna({
            'title': '',
            'author': 'Unknown Author',
            'url': '',
            'claps': 0,
            'reading_time': 0,
            'content': '',
            'image_sources': ''
        })
        logger.debug(f"Loaded CSV with columns: {df.columns.tolist()}")
        return df
    except Exception as e:
        logger.error(f"Error loading CSV: {str(e)}")
        raise

def search_articles(df, keyword, threshold=60):
    try:
        matches = []
        keyword = keyword.lower()
        
        for _, row in df.iterrows():
            title = str(row['title']).lower()
            ratio = fuzz.partial_ratio(keyword, title)
            
            if ratio >= threshold:
                matches.append({
                    'title': row['title'],
                    'author': row['author'],
                    'url': row['url'],
                    'reading_time': int(row['reading_time']) if pd.notnull(row['reading_time']) else 0,
                    'claps': int(row['claps']) if pd.notnull(row['claps']) else 0,
                    'match_score': ratio
                })
        
        # Sort by match score and limit to top 20 results for better performance
        matches = sorted(matches, key=lambda x: x['match_score'], reverse=True)[:20]
        logger.debug(f"Found {len(matches)} matches, returning top 20")
        return matches
    except Exception as e:
        logger.error(f"Error in search_articles: {str(e)}")
        raise

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    try:
        keyword = request.args.get('keyword', '').strip()
        if not keyword:
            return jsonify({'error': 'Please provide a keyword parameter'}), 400
        
        df = load_articles()
        logger.debug(f"Searching for keyword: {keyword}")
        results = search_articles(df, keyword)
        
        response_data = {
            'keyword': keyword,
            'results_count': len(results),
            'results': results
        }
        logger.debug(f"Sending response with {len(results)} results")
        return jsonify(response_data)
    except Exception as e:
        logger.error(f"Error in search endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)