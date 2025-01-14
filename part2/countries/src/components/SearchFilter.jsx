function SearchFilter({ newSearch, handleSearchChange }) {
  return (
    <div>
      filter countries <input value={newSearch} onChange={handleSearchChange} />
    </div>
  );
}

export default SearchFilter;
