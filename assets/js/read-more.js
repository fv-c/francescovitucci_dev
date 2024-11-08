    document.addEventListener("DOMContentLoaded", async function () {
        // Leggi il file JSON
        const response = await fetch('{{ site.url }}/assets/posts.json');
        const posts = await response.json();

        // Recupera le categorie del post corrente come array di stringhe
        const currentCategories = JSON.parse('{{ page.categories | jsonify }}'); // Assicura che sia un array JSON valido

        // Filtra i post per categorie corrispondenti, trasformando la stringa di categorie in un array
        const filteredPosts = posts.filter(post => {
            const postCategories = post.categories.split(",").map(category => category.trim()); // Converti le categorie in un array
            return postCategories.some(category => currentCategories.includes(category));
        });

        // Limita a 3 post consigliati
        const recommendedPosts = filteredPosts.slice(0, 3);

        // Genera l'HTML per i post consigliati
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

        // Inserisci l'HTML generato nel wrapper
        document.querySelector(".blogReadMoreWrapper").innerHTML = html;
    });