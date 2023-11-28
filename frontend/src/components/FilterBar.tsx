import React from "react";
import {FilterBarProps} from "../types/data";
import {Button, IconButton, MenuItem, Select, TextField} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

const FilterBar: React.FC<FilterBarProps> = ({
    searchNameQuery,
    setSearchNameQuery,
    searchBibJournalQuery,
    setSearchBibJournalQuery,
    searchBibYearQuery,
    setSearchBibYearQuery,
    sortBy,
    setSortBy,
    filterChanged,
    setFilterChanged,
    sortOrder,
    uniqueKeywords,
    countModelsForKeyword,
    selectedKeywords,
    handleKeywordChange,
    toggleSortOrder,
    showAdvancedFilters,
    toggleAdvancedFilters,
    handleResetFilters}) => {
    return (
        <div className="filter-bar">
            <div className="filter-bar__content">
                <div className="filter-bar__basic">
                    <div className="filter-bar__basic-items">
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchNameQuery}
                            onChange={(e) => {
                                setSearchNameQuery(e.target.value);
                                setFilterChanged(true)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                ),
                            }}
                            sx={{
                                '@media only screen and (max-width: 767px)': {
                                    marginBottom: '1rem',
                                }
                            }}
                        />
                        <div className="filter-bar__sort">
                            <span className="filter-bar__sort-label"><b>Sort by</b></span>
                            <div className="filter-bar__sort-options">
                                <Select
                                    className="filter-bar__select"
                                    style={{ marginLeft: '.8rem'}}
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setFilterChanged(true)
                                    }}
                                >
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="inputs">Inputs count</MenuItem>
                                    <MenuItem value="variables">Variables count</MenuItem>
                                    <MenuItem value="regulations">Regulations count</MenuItem>
                                </Select>
                                <IconButton
                                    onClick={toggleSortOrder}
                                    style={{
                                        transition: 'transform 0.3s ease', // Add a transition for smooth rotation
                                        transform: `rotate(${sortOrder === 'desc' ? '0deg' : '180deg'})`, // Rotate the icon
                                        marginLeft: '.7rem',
                                        outline: 'none'
                                    }}>
                                    <SouthOutlinedIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div className="filter-bar__actions">
                        <Button
                            style={{
                                outline: 'none',
                                padding: '.2rem 1rem',
                                margin: '.2rem',
                                backgroundColor: '#3a568c'
                            }}
                            variant="contained"
                            endIcon={<ClearIcon />}
                            onClick={handleResetFilters}
                            disabled={!filterChanged}>
                            Reset Filters
                        </Button>
                        <Button
                            style={{
                                outline: 'none',
                                padding: '.2rem 1rem',
                                margin: '.2rem',
                                backgroundColor: '#3a568c'
                            }}
                            variant="contained"
                            endIcon={<ExpandMoreOutlinedIcon
                                style={{
                                    transition: 'transform 0.3s ease',
                                    transform: `rotate(${!showAdvancedFilters ? '0deg' : '180deg'})` }}
                            />}
                            onClick={toggleAdvancedFilters}>
                            Advanced Filter
                        </Button>
                    </div>
                </div>
                {showAdvancedFilters && (
                    <div className="filter-bar__advanced">
                        <div className="filter-bar__advanced-keywords" style={{width: '-webkit-fill-available'}}>
                            <p className="filter-bar__advanced-keywords-label"><b>Keywords:</b></p>
                            <div className="filter-bar__advanced-keywords-list"><br/>
                                {uniqueKeywords.map((keyword) => (
                                    <label key={keyword}>
                                        {countModelsForKeyword(keyword) === 0 ? (
                                            <input
                                                type="checkbox"
                                                value={keyword}
                                                checked={false}
                                                disabled
                                                className="filter-bar__checkbox--disabled"
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                value={keyword}
                                                checked={selectedKeywords.includes(keyword)}
                                                onChange={() => handleKeywordChange(keyword)}
                                            />
                                        )}
                                        {keyword} [{countModelsForKeyword(keyword)}]
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="filter-bar__advanced__searches">
                            <TextField
                                sx={{
                                    marginTop: '2rem',
                                    marginLeft: '2rem',
                                    '@media only screen and (max-width: 767px)': {
                                        margin: '1rem 0 0 0'
                                    }
                                }}
                                label="Search Publication"
                                variant="outlined"
                                value={searchBibJournalQuery}
                                onChange={(e) => {
                                    setSearchBibJournalQuery(e.target.value);
                                    setFilterChanged(true);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton>
                                            <SearchOutlinedIcon />
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{
                                    marginTop: '2rem',
                                    marginLeft: '2rem',
                                    '@media only screen and (max-width: 767px)': {
                                        margin: '1rem 0 0 0'
                                    }
                                }}
                                label="Search Year"
                                variant="outlined"
                                value={searchBibYearQuery}
                                onChange={(e) => {
                                    setSearchBibYearQuery(e.target.value);
                                    setFilterChanged(true);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton>
                                            <SearchOutlinedIcon />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
