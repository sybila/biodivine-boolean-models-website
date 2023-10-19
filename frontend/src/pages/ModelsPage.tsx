import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ModelsApi} from "../services";
import {Model} from "../types/data";
import {Button, IconButton, MenuItem, Select, TextField} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import {useRecoilState} from "recoil";
import {
    filteredModelsAtom,
    searchBibJournalQueryAtom,
    searchBibYearQueryAtom,
    searchNameQueryAtom, selectedKeywordsAtom, showAdvancedAFiltersAtom,
    sortByAtom,
    sortOrderAtom
} from "../state/filtersAtom";

const ModelsPage: React.FC = () => {
    const { data: models, isLoading } = useQuery({
        queryKey: ['models'],
        queryFn: () => ModelsApi.getAll()
    });

    const [searchNameQuery, setSearchNameQuery] = useRecoilState<string>(searchNameQueryAtom);
    const [searchBibJournalQuery, setSearchBibJournalQuery] = useRecoilState<string>(searchBibJournalQueryAtom);
    const [searchBibYearQuery, setSearchBibYearQuery] = useRecoilState<string>(searchBibYearQueryAtom);
    const [sortBy, setSortBy] = useRecoilState<string>(sortByAtom); // Default sorting field
    const [sortOrder, setSortOrder] = useRecoilState<string>(sortOrderAtom); // Default sort order is ASC
    const [selectedKeywords, setSelectedKeywords] = useRecoilState<string[]>(selectedKeywordsAtom);
    const [filteredModels, setFilteredModels] = useRecoilState<Model[]>(filteredModelsAtom);
    const [showAdvancedFilters, setShowAdvancedFilters] = useRecoilState<boolean>(showAdvancedAFiltersAtom);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
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

    // Extract unique keywords from the filtered models
    const uniqueKeywords = [...new Set(filteredModels.flatMap((model) => model.keywords))];

    const handleKeywordChange = (keyword: string) => {
        // Toggle the selected state of the keyword
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
        } else {
            setSelectedKeywords([...selectedKeywords, keyword]);
        }
    };

    const handleResetFilters = () => {
        // Reset search query, selected keywords, and sort options
        setSearchNameQuery('');
        setSelectedKeywords([]);
        setSortBy('name');
        setSortOrder('asc');
        setShowAdvancedFilters(false);
        setSearchBibJournalQuery('');
        setSearchBibYearQuery('');
    };

    return (
        <>
            <div className="header">
                <h1 className="title"><span className="subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/"><button>About Us</button></Link>
            </div>
            <div className="filter_bar">
                <div className="basic_filter">
                    <div style={{marginBottom: '.8rem'}}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchNameQuery}
                            onChange={(e) => setSearchNameQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                        <Select
                            className="sortBy_select"
                            style={{ marginLeft: '2rem'}}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
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
                    <div className="buttons">
                        <Button
                            style={{
                                outline: 'none',
                                padding: '.2rem 1rem',
                                margin: '.2rem',
                            }}
                            variant="contained"
                            endIcon={<ClearIcon />}
                            onClick={handleResetFilters}>
                            Reset Filters
                        </Button>
                        <Button
                            style={{
                                outline: 'none',
                                padding: '.2rem 1rem',
                                margin: '.15rem'
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
                        <div>
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
                                        {keyword}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <TextField
                            style={{marginTop: '2rem', marginLeft: '2rem'}}
                            label="Search Journal"
                            variant="outlined"
                            value={searchBibJournalQuery}
                            onChange={(e) => setSearchBibJournalQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                        <TextField
                            style={{marginTop: '2rem', marginLeft: '2rem'}}
                            label="Search Year"
                            variant="outlined"
                            value={searchBibYearQuery}
                            onChange={(e) => setSearchBibYearQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchOutlinedIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </div>
                )}
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <h2>Models List</h2>
                    <ul className="model_list">
                        {filteredModels?.map((model) => (
                            <li key={model.id}>
                                <div className="model_item">
                                    <div className="model_info">
                                        <h4>{model.name}</h4>
                                        <div className="model_details">
                                            <p className="model_details_data"><b>Keywords:</b> [{model.keywords.join(', ')}]</p>
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
                </div>
            )}
        </>
    )
};

export default ModelsPage;
