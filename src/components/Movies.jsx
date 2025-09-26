import Movie from './Movie';
import '../styles/movies.scss';

const Movies = ({ movies, viewTrailer, isLoading }) => {
	return isLoading ? (
		<div className="loading">Loading movies...</div>
	) : (
		<div
			data-testid="movies"
			className="movies-grid"
		>
			{movies?.results?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.id}
					viewTrailer={viewTrailer}
				/>
			))}
		</div>
	);
};

export default Movies;
