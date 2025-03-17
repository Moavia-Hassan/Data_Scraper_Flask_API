from flask import Flask, request, jsonify, render_template
import pandas as pd
from fuzzywuzzy import fuzz
import os

app = Flask(__name__)

def load_articles():
    try:
        df = pd.read_csv('data/medium_articles_full.csv')
        df = df.fillna({
            'title': '',
            'author': 'Unknown Author',
            'url': '',
            'claps': 0,
            'reading_time': 0
        })
        return df
    except Exception as e:
        print(f"Error loading CSV: {str(e)}")
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
        
        matches = sorted(matches, key=lambda x: x['match_score'], reverse=True)[:20]
        return matches
    except Exception as e:
        print(f"Error in search_articles: {str(e)}")
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
        results = search_articles(df, keyword)
        
        return jsonify({
            'keyword': keyword,
            'results_count': len(results),
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)