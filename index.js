const apiKey = 'rtEGSvgsSX86EblH8V2VEH7GwkcDuyx2';

function fetchArticles() {
    const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                updateArticles(data.results);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateArticles(articles) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear existing content

    articles.forEach((articleData, index) => {
        const articleElement = document.createElement('article');
        articleElement.classList.add('news-item');
        articleElement.dataset.index = index;
        
        articleElement.innerHTML = `
            <div class="info-top">
                <img class="author-avatar" src="./photos/ava.svg" alt="Author's avatar">
                <span class="author-name">${articleData.byline || 'NY Times'}</span>
                <span class="separator gray-text">in</span> 
                <span class="topic-name">Topics Name ·</span> 
                <span class="publish-date gray-text">${new Date(articleData.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="content">
                <div class="text-content">
                    <h2 class="article-title">${articleData.title || 'Title not available'}</h2>
                    <p class="article-description">${articleData.abstract || articleData.lead_paragraph || articleData.snippet || 'Description not available'}</p>
                </div>
                <img class="article-image" src="${articleData.multimedia && articleData.multimedia.length > 0 ? articleData.multimedia[0].url : './photos/default-image.svg'}" alt="Article Image">
            </div>
            <div class="info-bottom">
                <button class="tag-button">JavaScript</button>
                <span class="read-time">12 min read</span>
                <span class="separator">-</span>
                <span class="selected-for-you">Selected for you</span>
                <div class="gray-squares">
                    <div class="gray-square"></div>
                    <div class="gray-square"></div>
                    <div class="gray-square"></div>
                </div>
            </div>
        `;
        
        articleElement.addEventListener('click', function() {
            console.log(`Redirecting to article.html?articleIndex=${index}`);
            window.location.href = `article.html?articleIndex=${index}`;
        });

        mainContent.appendChild(articleElement);
    });
}

function fetchArticleDetails(index) {
    const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0 && data.results[index]) {
                updateArticleDetails(data.results[index]);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateArticleDetails(articleData) {
    const authorName = document.querySelector('.author-name');
    const meta = document.querySelector('.meta');
    const articleTitle = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    const articleImage = document.querySelector('.scaled-image');
    const contentSection = document.querySelector('.content-section');

    authorName.textContent = articleData.byline ? articleData.byline : 'Unknown Author';
    meta.textContent = `${new Date(articleData.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • ${Math.ceil((articleData.word_count || 1000) / 200)} min read • Member-only`;
    articleTitle.textContent = articleData.title || 'No Title Available';
    subtitle.textContent = articleData.abstract || 'No Subtitle Available';
    if (articleData.multimedia && articleData.multimedia.length > 0) {
        articleImage.src = articleData.multimedia[0].url;
    } else {
        articleImage.src = './photos/default-image.svg'; 
    }

    contentSection.innerHTML = `
        <h2 class="subheader">Subheader</h2>
        <p>${articleData.lead_paragraph || 'No lead paragraph available.'}</p>
        <p>${articleData.snippet || 'No snippet available.'}</p>
        <p>${articleData.abstract || 'No abstract available.'}</p>
    `;
}

function goBack() {
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('main-page')) {
        fetchArticles();
    } else if (document.body.classList.contains('detail-page')) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleIndex = urlParams.get('articleIndex');
        if (articleIndex !== null) {
            fetchArticleDetails(articleIndex);
        }
    }
});