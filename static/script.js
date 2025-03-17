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
        resultsDiv.innerHTML = data.results.map(article => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <span class="match-score">${article.match_score}% match</span>
                        <h5 class="card-title" title="${escapeHtml(article.title)}">${escapeHtml(article.title)}</h5>
                        ${article.subtitle && article.subtitle !== 'nan' ? 
                          `<p class="card-text text-muted mb-3">${escapeHtml(article.subtitle)}</p>` : ''}
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
                        <a href="${article.url}" target="_blank" class="btn btn-primary btn-sm w-100 btn-read-article">
                            Read Article <i class="fas fa-external-link-alt ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
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