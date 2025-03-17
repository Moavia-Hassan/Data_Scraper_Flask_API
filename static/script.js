document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    if (!searchInput.value.trim()) {
        return;
    }
    
    // Show loading spinner
    loadingDiv.classList.remove('d-none');
    resultsDiv.innerHTML = '';
    
    try {
        const response = await fetch(`/search?keyword=${encodeURIComponent(searchInput.value.trim())}`);
        const data = await response.json();
        console.log('Search results:', data); // Debug log
        
        if (data.error) {
            showError(data.error);
            return;
        }
        
        if (data.results.length === 0) {
            showNoResults(searchInput.value);
            return;
        }
        
        // Display results
        resultsDiv.innerHTML = data.results.map(article => {
            // Create a clean version of the article for display
            const displayArticle = {
                title: article.title,
                author: article.author,
                url: article.url,
                reading_time: article.reading_time,
                claps: article.claps,
                date: article.date,
                match_score: article.match_score
            };
            
            return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <span class="match-score">${article.match_score}% match</span>
                        <h5 class="card-title" title="${escapeHtml(article.title)}">${escapeHtml(article.title)}</h5>
                        <div class="article-meta">
                            <div class="mb-2">
                                <i class="fas fa-user-edit"></i> ${escapeHtml(article.author)}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span>
                                    <i class="far fa-clock"></i> ${article.reading_time} min read
                                </span>
                                <span>
                                    <i class="fas fa-hands-clapping"></i> ${formatClaps(article.claps)}
                                </span>
                            </div>
                        </div>
                        <div class="btn-group w-100 mt-3" role="group">
                            <a href="${article.url}" target="_blank" class="btn btn-primary btn-sm">
                                Read Article <i class="fas fa-external-link-alt ms-1"></i>
                            </a>
                            <button onclick='downloadArticleData(${JSON.stringify(displayArticle).replace(/'/g, "&#39;")})' class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-download"></i> JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');
        
    } catch (error) {
        console.error('Search error:', error); // Debug log
        showError('An error occurred while searching. Please try again.');
    } finally {
        loadingDiv.classList.add('d-none');
    }
});

// Helper Functions
function showError(message) {
    document.getElementById('results').innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle me-2"></i>${escapeHtml(message)}
            </div>
        </div>
    `;
}

function showNoResults(searchTerm) {
    document.getElementById('results').innerHTML = `
        <div class="col-12">
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle me-2"></i>No articles found matching "${escapeHtml(searchTerm)}"
            </div>
        </div>
    `;
}

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatClaps(claps) {
    if (!claps) return '0 claps';
    const numClaps = parseInt(claps);
    if (isNaN(numClaps)) return '0 claps';
    
    if (numClaps >= 1000000) {
        return `${(numClaps / 1000000).toFixed(1)}M claps`;
    } else if (numClaps >= 1000) {
        return `${(numClaps / 1000).toFixed(1)}K claps`;
    }
    return `${numClaps} claps`;
}

// Add download functionality
function downloadArticleData(article) {
    const dataStr = JSON.stringify(article, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${article.title.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.json`);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}