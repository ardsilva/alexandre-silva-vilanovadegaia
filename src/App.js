import { useEffect, useState, useCallback } from 'react';
import {
	Routes,
	Route,
	createSearchParams,
	useSearchParams,
	useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from './data/moviesSlice';
import Modal from './components/Modal';
import useInfiniteScroll from './hooks/useInfiniteScroll';
import {
	ENDPOINT_SEARCH,
	ENDPOINT_DISCOVER,
	ENDPOINT,
	API_KEY,
} from './constants';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import YouTubePlayer from './components/YoutubePlayer';
import './app.scss';

const App = () => {
	const { movies } = useSelector((state) => state.movies);
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get('search');
	const [videoKey, setVideoKey] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		setVideoKey(null);
	}, []);

	const loadMoreMovies = useCallback(() => {
		if (searchQuery) {
			dispatch(
				fetchMovies(
					`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${currentPage + 1}`
				)
			);
		} else {
			dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${currentPage + 1}`));
		}
		setCurrentPage((prev) => prev + 1);
	}, [dispatch, searchQuery, currentPage]);

	// We use isFetching from our Hook in the Movies component to show loading state
	const { isFetching } = useInfiniteScroll(loadMoreMovies);

	const fetchMoviesList = useCallback(
		(query = searchQuery, updateParams = true) => {
			const endpoint = query
				? `${ENDPOINT_SEARCH}&query=${query}`
				: ENDPOINT_DISCOVER;

			dispatch(fetchMovies(endpoint));

			if (updateParams) {
				if (query) {
					setSearchParams(createSearchParams({ search: query }));
				} else {
					setSearchParams();
				}
			}
		},
		[dispatch, setSearchParams, searchQuery]
	);

	const searchMovies = useCallback(
		(query) => {
			navigate('/');
			fetchMoviesList(query, true);
		},
		[navigate, fetchMoviesList]
	);

	const viewTrailer = useCallback((movie) => {
		setIsModalOpen(true);
		getMovie(movie.id);
	}, []);

	const getMovie = async (id) => {
		const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

		setVideoKey(null);
		const videoData = await fetch(URL).then((response) => response.json());

		if (videoData.videos && videoData.videos.results.length) {
			const trailer = videoData.videos.results.find(
				(vid) => vid.type === 'Trailer'
			);
			setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
		}
	};

	useEffect(() => {
		fetchMoviesList(searchQuery, false);
	}, [fetchMoviesList, searchQuery]);

	return (
		<div className="App">
			<Header
				searchMovies={searchMovies}
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>

			<div className="container">
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
				>
					{videoKey ? (
						<YouTubePlayer videoKey={videoKey} />
					) : (
						<div style={{ padding: '30px', color: 'white' }}>
							<h6>No trailer available. Try another movie.</h6>
						</div>
					)}
				</Modal>

				<Routes>
					<Route
						path="/"
						element={
							<Movies
								movies={movies}
								viewTrailer={viewTrailer}
								isLoading={isFetching}
							/>
						}
					/>
					<Route
						path="/starred"
						element={<Starred viewTrailer={viewTrailer} />}
					/>
					<Route
						path="/watch-later"
						element={<WatchLater viewTrailer={viewTrailer} />}
					/>
					<Route
						path="*"
						element={<h1 className="not-found">Page Not Found</h1>}
					/>
				</Routes>
			</div>
		</div>
	);
};

export default App;
