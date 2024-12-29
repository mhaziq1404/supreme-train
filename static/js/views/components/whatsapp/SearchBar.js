export function SearchBar() {
    return `
        <div class="search-bar p-3 border-bottom">
            <div class="input-group">
                <input type="text" 
                       class="form-control" 
                       placeholder="Search messages..." 
                       id="searchMessages"
                       aria-label="Search messages">
                <button class="btn btn-outline-secondary" type="button" id="searchButton">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </div>
    `;
}