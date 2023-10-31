import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ModelsApi} from "../services";
import {Model} from "../types/data";
import {Button, IconButton, MenuItem, Select, TextField, CircularProgress, Pagination} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import {useRecoilState, useRecoilValue} from "recoil";
import {
    filterChangedAtom,
    filteredModelsAtom, pageNumberAtom,
    searchBibJournalQueryAtom,
    searchBibYearQueryAtom,
    searchNameQueryAtom, selectedKeywordsAtom, showAdvancedAFiltersAtom,
    sortByAtom,
    sortOrderAtom
} from "../state/filtersAtom";
import {numberOfModelsSelector} from "../state/filtersSelector";

const ModelsPage: React.FC = () => {
    const { data: models, isLoading } = useQuery({
        queryKey: ['models'],
        queryFn: () => ModelsApi.getAll()
    });

    const [searchNameQuery, setSearchNameQuery] = useRecoilState<string>(searchNameQueryAtom);
    const [searchBibJournalQuery, setSearchBibJournalQuery] = useRecoilState<string>(searchBibJournalQueryAtom);
    const [searchBibYearQuery, setSearchBibYearQuery] = useRecoilState<string>(searchBibYearQueryAtom);
    const [sortBy, setSortBy] = useRecoilState<string>(sortByAtom);
    const [sortOrder, setSortOrder] = useRecoilState<string>(sortOrderAtom);
    const [selectedKeywords, setSelectedKeywords] = useRecoilState<string[]>(selectedKeywordsAtom);
    const [filteredModels, setFilteredModels] = useRecoilState<Model[]>(filteredModelsAtom);
    const [showAdvancedFilters, setShowAdvancedFilters] = useRecoilState<boolean>(showAdvancedAFiltersAtom);
    const numberOfModels = useRecoilValue<number>(numberOfModelsSelector);
    const [filterChanged, setFilterChanged] = useRecoilState<boolean>(filterChangedAtom);
    const [pageNumber, setPageNumber] = useRecoilState(pageNumberAtom);

    const itemsPerPage = 10;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedModels = filteredModels.slice(startIndex, endIndex);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setFilterChanged(true);
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
        setFilterChanged(!showAdvancedFilters);
    }

    const journalRegex = /journal=\{([^}]+)}/;
    const yearRegex = /year=\{([^}]+)}/;

    useEffect(() => {
        // First, filter models based on both search query and selected keywords
        const filteredByKeywordsAndSearch = models?.filter((model: Model) => {
            // Check if the model's keywords contain all the selected keyword
            const keywordMatch = selectedKeywords.length === 0 || selectedKeywords.every((keyword) => model.keywords.includes(keyword));

            // Check if the model's name matches the search query
            const nameMatch = model.name.toLowerCase().includes(searchNameQuery.toLowerCase());

            const journalRegexMatch = model.bib.match(journalRegex);
            const yearRegexMatch = model.bib.match(yearRegex);

            let journalMatch = false;
            let yearMatch = false;

            if (journalRegexMatch) {
                journalMatch = journalRegexMatch[1].toLowerCase().includes(searchBibJournalQuery.toLowerCase());
            }

            if (yearRegexMatch) {
                yearMatch = yearRegexMatch[1].includes(searchBibYearQuery);
            }

            return keywordMatch && nameMatch && journalMatch && yearMatch;


        }) || [];

        // Then, sort the filtered models
        const sortedModels = filteredByKeywordsAndSearch.sort((a: Model, b: Model) => {
            let comparison = 0;

            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'variables':
                    comparison = a.variables - b.variables;
                    break;
                case 'inputs':
                    comparison = a.inputs - b.inputs;
                    break;
                case 'regulations':
                    comparison = a.regulations - b.regulations;
                    break;
                default:
                    break;
            }

            if (sortOrder === 'asc') {
                return comparison;
            } else if (sortOrder === 'desc') {
                return -comparison; // Reverse the order for DESC
            }
            return 0;
        });

        setFilteredModels(sortedModels);
    }, [selectedKeywords, models, searchNameQuery, searchBibJournalQuery, searchBibYearQuery, sortBy, sortOrder]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    // Extract unique keywords from the filtered models
    const uniqueKeywords = [...new Set(filteredModels.flatMap((model) => model.keywords))];

    const handleKeywordChange = (keyword: string) => {
        setFilterChanged(true);
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
        } else {
            setSelectedKeywords([...selectedKeywords, keyword]);
        }
    };

    const countModelsForKeyword = (keyword: string) => {
        return filteredModels.filter((model) => model.keywords.includes(keyword)).length;
    };

    const handleResetFilters = () => {
        setSearchNameQuery('');
        setSelectedKeywords([]);
        setSortBy('name');
        setSortOrder('asc');
        setShowAdvancedFilters(false);
        setSearchBibJournalQuery('');
        setSearchBibYearQuery('');
        setFilterChanged(false);
    };

    return (
        <>
            <div className="header">
                <h1 className="title"><span className="subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/"><button>About Us</button></Link>
            </div>
            <div className="filter_bar_container">
            <div className="filter_bar">
                <div className="basic_filter">
                    <div className="basicFilter_items">
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
                        <div className="sortBy_container">
                            <span className="sortBy_label"><b>Sort by</b></span>
                            <div className="sortBy_items">
                                <Select
                                    className="sortBy_select"
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
                    <div className="buttons">
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
                    <div className="advanced_filter">
                        <div className="advancedFilter_keywords" style={{width: '-webkit-fill-available'}}>
                            <p className="keywords_label"><b>Keywords:</b></p>
                            <div className="keywords"><br/>
                                {uniqueKeywords.map((keyword) => (
                                    <label key={keyword}>
                                        <input
                                            type="checkbox"
                                            value={keyword}
                                            checked={selectedKeywords.includes(keyword)}
                                            onChange={() => handleKeywordChange(keyword)}
                                        />
                                        {keyword} [{countModelsForKeyword(keyword)}]
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="advancedFilter_searchBars">
                            <TextField
                                sx={{
                                    marginTop: '2rem',
                                    marginLeft: '2rem',
                                    '@media only screen and (max-width: 767px)': {
                                        margin: '1rem 0 0 0'
                                    }
                                }}
                                label="Search Journal"
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
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div>
                    <ul className="model_list">
                        <h2 className="list_title">Models List [{numberOfModels}]</h2>
                        {paginatedModels?.map((model) => (
                            <li key={model.id}>
                                <div className="model_item">
                                    <div className="model_info">
                                        <h4>{model.name}</h4>
                                        <div className="model_details">
                                            <div className="model_details_data">
                                                <b>Keywords:</b> {model.keywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className={selectedKeywords.includes(keyword) ? "selectedKeyword" : ""}
                                                    onClick={() => handleKeywordChange(keyword)}
                                                    style={{cursor: 'pointer'}}>[{keyword}]&nbsp;
                                                </span>))}
                                            </div>
                                            <div className="model_details_numbers">
                                                <p className="model_details_data"><b>Inputs:</b> {model.inputs}</p>
                                                <p className="model_details_data"><b>Regulations:</b> {model.regulations}</p>
                                                <p className="model_details_data"><b>Variables:</b> {model.variables}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link className="details_link" to={`/models/${model.id}`}><button className="details_button">Details {'>'}</button></Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        shape="rounded"
                        color="primary"
                        count={Math.ceil(filteredModels.length / itemsPerPage)}
                        page={pageNumber}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '70vw',
                            margin: '2rem 0 3rem 8.5rem'
                        }}
                        sx={{
                            '& .MuiPaginationItem-page': {
                                backgroundColor: '#3a568c',
                                color: 'white',
                                outline: 'none',
                                '&.Mui-selected': {
                                    backgroundColor: '#d05d5d',
                                },
                                '&:hover': {
                                    backgroundColor: '#d05d5d',
                                    opacity: '.7'
                                },
                            },
                            '@media only screen and (max-width: 767px)': {
                                width: '100vw',
                                margin: '0 auto 1rem auto'
                            }
                        }}
                        onChange={(_, value) => setPageNumber(value)}
                    />
                </div>
            )}
        </>
    )
};

export default ModelsPage;
