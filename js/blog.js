document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog logic initialized');

    const blogListView = document.getElementById('blog-list-view');
    const singlePostView = document.getElementById('single-post-view');
    const blogGrid = document.getElementById('blog-grid');
    const backBtn = document.getElementById('back-to-blog');

    // DOM Elements for Single Post
    const postTitle = document.getElementById('post-title');
    const postDate = document.getElementById('post-date');
    const postAuthor = document.getElementById('post-author');
    const postContent = document.getElementById('post-content');

    let allPosts = [];

    // Check if we are trying to load a specific post based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postIdStr = urlParams.get('id');

    // Fetch posts
    fetch('/data/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response cannot be fetched. Assuming no posts yet.');
            }
            return response.json();
        })
        .then(data => {
            allPosts = data.posts || [];

            // Sort by date descending (newest first) if we want, but usually CMS list widget preserves order.
            // Let's enforce sort just in case.
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (postIdStr !== null && !isNaN(parseInt(postIdStr))) {
                // Show single post
                const index = parseInt(postIdStr);
                if (index >= 0 && index < allPosts.length) {
                    renderSinglePost(index);
                } else {
                    // Invalid ID, show list
                    renderList();
                }
            } else {
                // Show list
                renderList();
            }
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            blogGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No posts available yet. Check back soon!</p>';
        });

    function renderList() {
        blogListView.style.display = 'block';
        singlePostView.style.display = 'none';

        // Remove URL parameter purely for clean URL history
        window.history.replaceState({}, document.title, window.location.pathname);

        blogGrid.innerHTML = ''; // Clear loading text

        if (allPosts.length === 0) {
            blogGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No posts available yet. Check back soon!</p>';
            return;
        }

        allPosts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'blog-card fade-in-up';
            card.style.animationDelay = `${index * 0.1}s`;

            const dateObj = new Date(post.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            // Generate card HTML
            let html = `<span class="blog-date">${formattedDate}</span>
                        <h3>${post.title}</h3>`;

            if (post.summary) {
                html += `<p>${post.summary}</p>`;
            } else {
                // Generate a brief excerpt if no summary
                const excerpt = post.body ? post.body.substring(0, 100) + '...' : '';
                html += `<p>${excerpt}</p>`;
            }

            html += `<span class="read-more">Read Article &rarr;</span>`;

            card.innerHTML = html;

            // Click listener for routing
            card.addEventListener('click', () => {
                navigateToPost(index);
            });

            blogGrid.appendChild(card);
        });

        // Trigger reveal observer manually if window isn't scrolled
        setTimeout(() => {
            document.querySelectorAll('.blog-card').forEach(el => el.classList.add('is-visible', 'fade-in-up'));
        }, 100);
    }

    function renderSinglePost(index) {
        const post = allPosts[index];
        blogListView.style.display = 'none';
        singlePostView.style.display = 'block';

        const dateObj = new Date(post.date);
        postDate.textContent = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        postTitle.textContent = post.title;
        postAuthor.textContent = post.author || 'Your Journey Coach';

        // Use marked.js to parse the Markdown body into HTML
        if (typeof marked !== 'undefined') {
            postContent.innerHTML = marked.parse(post.body || '');
        } else {
            postContent.innerHTML = `<p>${post.body}</p>`;
            console.warn('Marked.js not loaded. Displaying raw output.');
        }

        // Setup back button
        backBtn.onclick = (e) => {
            e.preventDefault();
            renderList();
        };

        // Update URL to match current post (allows sharing URLs)
        const newUrl = window.location.pathname + '?id=' + index;
        window.history.pushState({ path: newUrl }, '', newUrl);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function navigateToPost(index) {
        renderSinglePost(index);
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const postIdStr = urlParams.get('id');

        if (postIdStr !== null && !isNaN(parseInt(postIdStr))) {
            const index = parseInt(postIdStr);
            if (index >= 0 && index < allPosts.length) {
                renderSinglePost(index);
            }
        } else {
            renderList();
        }
    });

});
