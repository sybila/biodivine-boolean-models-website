import React, {useEffect, useMemo} from 'react';
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ModelsApi} from "../services";
import {FilterOptions} from "../types/data";
import {CircularProgress, Pagination} from "@mui/material";
import {useRecoilState} from "recoil";
import {
    filterChangedAtom,
    pageNumberAtom,
    searchBibJournalQueryAtom,
    searchBibYearQueryAtom,
    searchNameQueryAtom, selectedKeywordsAtom, showAdvancedAFiltersAtom,
    sortByAtom,
    sortOrderAtom
} from "../state/filtersAtom";
import useFilteredModels from "../hooks/useFilteredModels";
import FilterBar from "../components/FilterBar";

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
    const [showAdvancedFilters, setShowAdvancedFilters] = useRecoilState<boolean>(showAdvancedAFiltersAtom);
    const [filterChanged, setFilterChanged] = useRecoilState<boolean>(filterChangedAtom);
    const [pageNumber, setPageNumber] = useRecoilState(pageNumberAtom);

    const filterOptions: FilterOptions = {
        searchNameQuery,
        searchBibJournalQuery,
        searchBibYearQuery,
        sortBy,
        sortOrder,
        selectedKeywords
    }

    const filteredModels = useFilteredModels(models!, filterOptions);
    const numberOfModels = filteredModels.length;

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

    const uniqueKeywords = useMemo(() => {
        return [...new Set(models?.flatMap((model) => model.keywords))];
    }, [models]);

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNumber]);

    return (
        <>
            <div className="header">
                <h1 className="title"><span className="subtitle">Model Repository/</span>BIODIVINE</h1>
                <Link to="/"><button>About Us</button></Link>
            </div>
            <FilterBar
                searchNameQuery={searchNameQuery}
                setSearchNameQuery={setSearchNameQuery}
                searchBibJournalQuery={searchBibJournalQuery}
                setSearchBibJournalQuery={setSearchBibJournalQuery}
                searchBibYearQuery={searchBibYearQuery}
                setSearchBibYearQuery={setSearchBibYearQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterChanged={filterChanged}
                setFilterChanged={setFilterChanged}
                sortOrder={sortOrder}
                uniqueKeywords={uniqueKeywords}
                countModelsForKeyword={countModelsForKeyword}
                selectedKeywords={selectedKeywords}
                handleKeywordChange={handleKeywordChange}
                toggleSortOrder={toggleSortOrder}
                showAdvancedFilters={showAdvancedFilters}
                toggleAdvancedFilters={toggleAdvancedFilters}
                handleResetFilters={handleResetFilters} />
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
                                                    className={selectedKeywords.includes(keyword) ? "selectedKeyword keyword" : "keyword"}
                                                    onClick={() => handleKeywordChange(keyword)}>[{keyword}]
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
