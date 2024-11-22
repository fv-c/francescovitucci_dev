    document.addEventListener("DOMContentLoaded", async function () {

        const response = await fetch('{{ site.url }}/assets/posts.json');
        const posts = await response.json();


        const currentCategories = JSON.parse('{{ page.categories | jsonify }}'); 


        const filteredPosts = posts.filter(post => {
            const postCategories = post.categories.split(",").map(category => category.trim());
            return postCategories.some(category => currentCategories.includes(category));
        });


        const recommendedPosts = filteredPosts.slice(0, 3);


        let html = '';
        recommendedPosts.forEach(post => {
            html += `
            <div class="blogPostContainer">
                <a href="${post.url}" class="blogPostFeatImg" style="background-image: url('${siteUrl}/assets/img/blog/lowRes/${post.featImg}');"></a>
                <a href="${post.url}" class="blogCategory">${post.categories}</a>
                <a href="${post.url}" class="blogTitle">${post.title}</a>
                <p class="blogExcerpt">${post.excerpt}</p>
            </div>
        `;
        });


        document.querySelector(".blogReadMoreWrapper").innerHTML = html;
    });