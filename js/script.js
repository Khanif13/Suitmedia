// ============ STATE ============
let state = JSON.parse(localStorage.getItem("state")) || {
    page: 1,
    size: 10,
    sort: "-published_at"
};

const postContainer = document.getElementById("postContainer");
const pagination = document.getElementById("pagination");
const showingText = document.getElementById("showingText");

// ============ HEADER BEHAVIOR ============
let lastScroll = 0;
const nav = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll) {
        nav.style.top = "-100px";
    } else {
        nav.style.top = "0";
        nav.style.backgroundColor = "rgba(255,255,255,0.95)";
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// ============ FETCH DATA ============
async function fetchPosts() {
    // const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${state.page}&page[size]=${state.size}&append[]=small_image&append[]=medium_image&sort=${state.sort}`;
    const url = `/api/api/ideas?page[number]=${state.page}&page[size]=${state.size}&append[]=small_image&append[]=medium_image&sort=${state.sort}`;

    const res = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    });
    const json = await res.json();
    console.log(json);
    return json;
}

// ============ RENDER POSTS ============
function renderPosts(data) {

    postContainer.innerHTML = "";
    const posts = data.data;

    posts.forEach(post => {
        const rawImageUrl =
            post.medium_image?.[0]?.url_full ||
            post.medium_image?.[0]?.url ||
            post.small_image?.[0]?.url_full ||
            post.small_image?.[0]?.url;

        // Cek apakah URL sudah absolute atau relative
        const imageUrl = rawImageUrl?.startsWith("http")
            ? rawImageUrl
            : rawImageUrl
                ? `https://suitmedia-backend.suitdev.com${rawImageUrl}`
                : "https://via.placeholder.com/400x300?text=No+Image";

        console.log("Gambar path:", rawImageUrl);
        console.log("Full URL:", imageUrl);

        postContainer.innerHTML += `
    <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
            <img src="${imageUrl}" class="card-img-top" loading="lazy" alt="${post.title}" style="aspect-ratio: 4/3; object-fit: cover;">
            <div class="card-body">
                <small class="text-muted">${new Date(post.published_at).toLocaleDateString("id-ID", {
            day: 'numeric', month: 'long', year: 'numeric'
        })}</small>
                <h5 class="card-title post-title">${post.title}</h5>
            </div>
        </div>
    </div>
  `;
    });



    const start = (state.page - 1) * state.size + 1;
    const end = Math.min(state.page * state.size, data.meta.total);
    showingText.textContent = `Showing ${start} - ${end} of ${data.meta.total}`;
}


// ============ RENDER PAGINATION ============
function renderPagination(data) {
    pagination.innerHTML = "";
    const totalPages = data.meta.last_page;

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === state.page ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click", (e) => {
            e.preventDefault();
            state.page = i;
            update();
        });
        pagination.appendChild(li);
    }
}

// ============ HANDLERS ============
function setupHandlers() {
    document.getElementById("sortBy").value = state.sort;
    document.getElementById("itemPerPage").value = state.size;

    document.getElementById("sortBy").addEventListener("change", (e) => {
        state.sort = e.target.value;
        state.page = 1;
        update();
    });

    document.getElementById("itemPerPage").addEventListener("change", (e) => {
        state.size = parseInt(e.target.value);
        state.page = 1;
        update();
    });
}

// ============ UPDATE MAIN FUNCTION ============
async function update() {
    console.log("Updating with state:", state);
    localStorage.setItem("state", JSON.stringify(state));
    const data = await fetchPosts();
    renderPosts(data);
    renderPagination(data);
}

// ============ INIT ============
setupHandlers();
update();