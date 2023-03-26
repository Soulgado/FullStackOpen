const Filter = ({ filterName, handleFilterChange }) => {
    return (
        <div>
            Filter shown with
            <input type="text" value={filterName} onChange={handleFilterChange} />
        </div>
    );
}

export default Filter;