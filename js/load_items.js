
// ----------- Creating Fetch API Loader ---------------------

// Create HTML elements in JavaScript
const loaderContainer = document.createElement('div');
loaderContainer.classList.add('loader-container');

const loader = document.createElement('div');
loader.classList.add('loader');

// Add the loader to the container
loaderContainer.appendChild(loader);

// Add the container to the document body
document.body.appendChild(loaderContainer);

// Inline CSS styles for the loader
loaderContainer.style.position = 'fixed';
loaderContainer.style.top = '0';
loaderContainer.style.left = '0';
loaderContainer.style.width = '100%';
loaderContainer.style.height = '100%';
loaderContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
loaderContainer.style.display = 'flex';
loaderContainer.style.justifyContent = 'center';
loaderContainer.style.alignItems = 'center';
loaderContainer.style.zIndex = '9999';

// CSS styles for the rotation animation
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
}
`;
document.head.appendChild(style);

// Function to show the loader
function showLoader() {
    loaderContainer.style.display = 'flex';
}

// Function to hide the loader
function hideLoader() {
    loaderContainer.style.display = 'none';
}

// Add a counter for active Fetch requests
let activeFetchRequests = 0;

// Intercept all outgoing Fetch requests
document.addEventListener('fetchStart', function () {
    activeFetchRequests++;
    showLoader();
});

// Intercept all received Fetch responses
document.addEventListener('fetchEnd', function () {
    activeFetchRequests--;
    if (activeFetchRequests === 0) {
        hideLoader();
    }
});

// Configure the fetch event to intercept Fetch requests and responses
document.addEventListener('DOMContentLoaded', function () {
    // Save a reference to the original fetch method
    const originalFetch = window.fetch;

    // Override the fetch method to dispatch custom events
    window.fetch = function (url, options) {
        const fetchPromise = originalFetch(url, options);

        // Dispatch the fetchStart event when a Fetch request is initiated
        document.dispatchEvent(new Event('fetchStart'));

        // Intercept the response and dispatch the fetchEnd event when the response is received
        fetchPromise.then(function (response) {
            document.dispatchEvent(new Event('fetchEnd'));
            return response;
        });

        return fetchPromise;
    };
});

// ------------- Loading objects ------------------

function loadProducts(category_id, table, nameCategory) {
    fetch(`../routes/load_products.php?category_id=${category_id}`)
        .then(response => response.json())
        .then(products => {
            createProductTable(products, table, nameCategory, category_id)
        })
        .catch(error => {
            console.error('Error', error);
        });
}

function loadFeatures(product_id, row) {
    // Make a fetch request to load feature data from the server
    fetch(`../routes/load_feature.php?product_id=${product_id}`, {
        method: 'GET',
    })
        .then(response => response.json()) // Assuming the server responds with JSON data
        .then(data => {
            displayFeature(data, row)
        })
        .catch(error => {
            console.error('Error', error);
        });
}

function hideFeatures(row) {
    // Check if the next row is a details row
    var nextRow = row.nextSibling;
    if (nextRow && nextRow.classList.contains("details-row")) {
        // If it's a details row, remove it
        row.parentNode.removeChild(nextRow);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('../routes/load_categories.php', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(categories => {
            const itemsPerPage = 10;
            const totalPages = Math.ceil(categories.length / itemsPerPage);
            const totalRecords = categories.length;
            let currentPage = 1;

            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        })
        .catch(error => {
            console.error('Error', error);
        });
});

// ------------ Main Table Load -----------

function createTable(category) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Create table body
    const bodyRow = document.createElement("tr");
    const bodyName = document.createElement("td");

    bodyName.textContent = category.name;

    const bodyCount = document.createElement("td");
    bodyCount.textContent = category.article_count;
    bodyRow.appendChild(bodyName);
    bodyRow.appendChild(bodyCount);
    tbody.appendChild(bodyRow);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
function displayCategories(currentPage, itemsPerPage, categories) {
    const tbody = document.getElementById("category-list");
    tbody.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    for (let i = startIndex; i < endIndex; i++) {
        if (categories[i]) {
            const tr = document.createElement("tr");
            const tdName = document.createElement("td");
            const tdButton = document.createElement("td");

            const button = document.createElement("button");
            button.className = "btn btn-primary";
            button.style.marginRight = "20px";
            button.title = "Show Products";
            if (categories[i].article_count == 0) {
                button.disabled = true
            }
            button.textContent = "+"; // Initial state
            button.addEventListener("click", () => {
                const table = tr.nextElementSibling;
                if (table) {
                    // Toggle table visibility
                    table.style.display = table.style.display === "none" ? "" : "none";

                    // Toggle button text and class
                    if (button.textContent === "+") {
                        loadProducts(categories[i].id, table, categories[i].name)
                        button.textContent = "-";
                        button.title = "Close Products";

                    } else {
                        button.textContent = "+";
                        button.title = "Show Products";

                    }
                }
            });
            tdButton.appendChild(button);
            tdName.appendChild(document.createTextNode(categories[i].name));
            const tdArticleCount = document.createElement("td");
            tdArticleCount.textContent = categories[i].article_count;

            // Create and append the table below the row
            const table = createTable(categories[i]);
            table.style.display = "none"; // Initially hidden
            const trTable = document.createElement("tr");
            const tdTable = document.createElement("td");
            tdTable.appendChild(table);
            trTable.appendChild(tdTable);
            trTable.style.display = "none"; // Initially hidden

            tr.appendChild(tdButton);
            tr.appendChild(tdName);
            tr.appendChild(tdArticleCount);
            tbody.appendChild(tr);
            tbody.appendChild(trTable);
        }
    }
}

// ------------- Main Table Pagination -------------

function displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    // Go to First Page on the Right Button
    const firstRightLi = document.createElement("li");
    firstRightLi.className = "page-item";
    const firstRightA = document.createElement("button");
    firstRightA.className = "page-link";
    firstRightA.textContent = "<<";

    // Disable the button if on the first page
    if (currentPage === 1) {
        firstRightLi.classList.add("disabled");
    } else {
        firstRightA.addEventListener("click", () => {
            currentPage = 1;
            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        });
    }

    firstRightLi.appendChild(firstRightA);
    pagination.appendChild(firstRightLi);

    // Previous Page Button
    if (currentPage > 1) {
        const prevLi = document.createElement("li");
        prevLi.className = "page-item";
        const prevA = document.createElement("button");
        prevA.className = "page-link";
        prevA.textContent = "<";
        prevA.addEventListener("click", () => {
            currentPage--;
            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        });
        prevLi.appendChild(prevA);
        pagination.appendChild(prevLi);
    }

    // Page Numbers
    const maxPages = Math.min(totalPages, currentPage + 4);
    const minPages = Math.max(1, currentPage - 4);

    for (let i = minPages; i <= maxPages; i++) {
        const li = document.createElement("li");
        li.className = "page-item";
        const a = document.createElement("button");
        a.className = "page-link";
        a.href = "#";
        a.textContent = i;

        // Add 'active' class to the current page
        if (i === currentPage) {
            li.classList.add("active");
        }

        a.addEventListener("click", () => {
            currentPage = i;
            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        });

        li.appendChild(a);
        pagination.appendChild(li);
    }

    // Next Page Button
    if (currentPage < totalPages) {
        const nextLi = document.createElement("li");
        nextLi.className = "page-item";
        const nextA = document.createElement("button");
        nextA.className = "page-link";
        nextA.href = "#";
        nextA.textContent = ">";
        nextA.addEventListener("click", () => {
            currentPage++;
            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        });
        nextLi.appendChild(nextA);
        pagination.appendChild(nextLi);
    }

    // Go to Last Page on the Left Button
    const lastLeftLi = document.createElement("li");
    lastLeftLi.className = "page-item";
    const lastLeftA = document.createElement("button");
    lastLeftA.className = "page-link";
    lastLeftA.href = "#";
    lastLeftA.textContent = ">>";

    // Disable the button if on the last page
    if (currentPage === totalPages) {
        lastLeftLi.classList.add("disabled");
    } else {
        lastLeftA.addEventListener("click", () => {
            currentPage = totalPages;
            displayCategories(currentPage, itemsPerPage, categories);
            displayPagination(totalPages, totalRecords, currentPage, itemsPerPage, categories);
        });
    }

    lastLeftLi.appendChild(lastLeftA);
    pagination.appendChild(lastLeftLi);

    // Display the number of pages and records being shown
    const pageInfo = document.getElementById("paginationNumber");
    pageInfo.innerText = `Page ${currentPage} of ${totalPages} | Showing records ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, totalRecords)} of ${totalRecords}`;
}

// ---------- Creating The Products Table Individually --------------

function createProductTable(data, container, nameCategory, category_id) {
    // Create the title
    container.innerHTML = '<td></td>'

    // The variable category_id exists, so we can remove the element
    $('#productTable' + category_id).remove();

    var title = document.createElement("h3");
    title.textContent = "Products From " + nameCategory;
    container.appendChild(title);

    // Create the table
    var table = document.createElement("table");
    table.id = "productTable" + category_id;
    table.className = "table table-striped";
    container.appendChild(table);

    // Create the table header
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var headerRow = document.createElement("tr");
    thead.appendChild(headerRow);

    var headers = ["", "Name", "Feature Count"];
    headers.forEach(function (headerText) {
        var th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Create the table body
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    data.forEach(function (product) {
        var row = document.createElement("tr");
        tbody.appendChild(row);

        // Create the cell for product.id with a button
        var idCell = document.createElement("td");
        var idButton = document.createElement("button");
        idButton.textContent = "+"; // By default, the button has text "+"
        idButton.className = "btn btn-primary"; // Add Bootstrap classes for button styling
        idButton.title = "Show Features"; // Add Bootstrap classes for button styling

        if (product.product_count == 0) {
            idButton.disabled = true
        }
        // Add a custom attribute to store the button state (open or closed details)
        idButton.dataset.state = "closed"; // Initially, details are closed

        idButton.onclick = function () {
            if (idButton.dataset.state === "closed") {
                // If details are closed, change the text to "-" and load feature data
                idButton.textContent = "-";
                idButton.dataset.state = "open";
                idButton.title = "Close Features";
                loadFeatures(product.id, row);
            } else {
                // If details are open, change the text to "+" and hide the details
                idButton.textContent = "+";
                idButton.dataset.state = "closed";
                idButton.title = "Show Features";
                hideFeatures(row);
            }
        };
        idCell.appendChild(idButton);
        row.appendChild(idCell);

        // Other cells (name and product_count)
        var cells = [product.name, product.product_count];
        cells.forEach(function (cellData) {
            var cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);
        });
    });

    // Set up DataTables
    $(document).ready(function () {
        $('#productTable' + category_id).DataTable();
    });
}

//------------- Create a Product Features Table ---------------------

function displayFeature(data, row) {
    // Create a table to display the features
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    table.className = "table table-striped"; // Add a CSS class for styling the table

    // Iterate through the feature data and create rows (tr) and cells (td) for each feature
    data.forEach(feature => {
        var tr = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.textContent = feature.name;
        tr.appendChild(tdName);

        var tdValue = document.createElement("td");
        tdValue.textContent = feature.feature;
        tr.appendChild(tdValue);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Create a cell that spans all columns for the details table
    var detailsCell = document.createElement("td");
    detailsCell.colSpan = row.cells.length;
    detailsCell.appendChild(table);

    // Create a new row for the details below the current row
    var detailsRow = document.createElement("tr");
    detailsRow.appendChild(detailsCell);

    // Add a class to the details row for styling
    detailsRow.className = "details-row";

    // Insert the details row below the current row
    row.parentNode.insertBefore(detailsRow, row.nextSibling);
}

//------------- up button functionality --------
window.onscroll = function () {
    if (document.documentElement.scrollTop > 100) {
        document.querySelector('.scroll-top-button').classList.add('show');
    } else {
        document.querySelector('.scroll-top-button').classList.remove('show');
    }
}
document.querySelector('.scroll-top-button').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
