import { CircularProgress, Pagination } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import FilterBar from '../components/FilterBar';
import useFilteredModels from '../hooks/useFilteredModels';
import { ModelsApi } from '../services';
import {
    filterChangedAtom,
    pageNumberAtom,
    searchBibJournalQueryAtom,
    searchBibYearQueryAtom,
    searchNameQueryAtom,
    selectedKeywordsAtom,
    showAdvancedAFiltersAtom,
    sortByAtom,
    sortOrderAtom,
} from '../state/filtersAtom';
import { FilterOptions } from '../types/data';

const ModelsPage = () => {
    const { data: models, isLoading } = useQuery({
        queryKey: ['models'],
        queryFn: () => ModelsApi.getAll(),
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
        selectedKeywords,
    };

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
    };

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
            <div className="page__header">
                <h1 className="page__title">
                    <span className="page__subtitle">Model Repository/</span>BIODIVINE
                </h1>
                <Link to="/">
                    <button className="page__button">About Us</button>
                </Link>
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
                handleResetFilters={handleResetFilters}
            />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div>
                    <ul className="models-page__list">
                        <h2 className="page__content-title models-page__list-title">Models List [{numberOfModels}]</h2>
                        {paginatedModels?.map((model) => (
                            <li key={model.id}>
                                <div className="models-page__item">
                                    <div className="models-page__item-info">
                                        <h4 className="models-page__item-title">{model.name}</h4>
                                        <div className="models-page__item-details">
                                            <div className="models-page__item-details-data">
                                                <b>Keywords:</b>{' '}
                                                {model.keywords.map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className={
                                                            selectedKeywords.includes(keyword)
                                                                ? 'models-page__keyword--selected models-page__keyword'
                                                                : 'models-page__keyword'
                                                        }
                                                        onClick={() => handleKeywordChange(keyword)}
                                                    >
                                                        [{keyword}]
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="models-page__item-details-numbers">
                                                <p className="models-page__item-details-data">
                                                    <b>Inputs:</b> {model.inputs}
                                                </p>
                                                <p className="models-page__item-details-data">
                                                    <b>Regulations:</b> {model.regulations}
                                                </p>
                                                <p className="models-page__item-details-data">
                                                    <b>Variables:</b> {model.variables}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link className="models-page__details-link" to={`/models/${model.id}`}>
                                        <button className="page__button models-page__details-button">
                                            Details {'>'}
                                        </button>
                                    </Link>
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
                            margin: '2rem 0 3rem 8.5rem',
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
                                    opacity: '.7',
                                },
                            },
                            '@media only screen and (max-width: 767px)': {
                                width: '100vw',
                                margin: '0 auto 1rem auto',
                            },
                        }}
                        onChange={(_, value) => setPageNumber(value)}
                    />
                </div>
            )}
        </>
    );
};

export default ModelsPage;
