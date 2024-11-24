
const mainContent = document.getElementById('main-content');
const PRODUCTS_PER_PAGE = 6;


async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}


async function renderProducts(page = 1) {
    const data = await fetchData('https://dummyjson.com/products');
    if (!data) return;

    const products = data.products;
    const totalProducts = products.length;
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const paginatedProducts = products.slice(start, end);

    mainContent.innerHTML = '<h2>All Products</h2>';
    paginatedProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <strong>${product.title}</strong><br>
            Price: $${product.price}
        `;
        div.onclick = () => renderProductDetails(product.id);
        mainContent.appendChild(div);
    });

    renderPagination(totalProducts, page, renderProducts);
}


function renderPagination(totalItems, currentPage, callback) {
    const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) return;

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
        button.textContent = i;
        button.onclick = () => callback(i);
        paginationDiv.appendChild(button);
    }

    mainContent.appendChild(paginationDiv);
}


async function renderProductDetails(productId) {
    const product = await fetchData(`https://dummyjson.com/products/${productId}`);
    if (!product) return;

    mainContent.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <img src="${product.thumbnail}" alt="${product.title}" width="300">
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <button onclick="renderProducts()">Back to Products</button>
    `;
}


renderProducts();
