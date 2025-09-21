export const API_KEY = '8cac6dec66e09ab439c081b251304443'; //export keys to .env file in production
export const ENDPOINT = 'https://api.themoviedb.org/3';
//URL must be movie?api_key not movie/?api_key
export const ENDPOINT_DISCOVER =
	ENDPOINT + '/discover/movie?api_key=' + API_KEY + '&sort_by=vote_count.desc';
export const ENDPOINT_SEARCH = ENDPOINT + '/search/movie?api_key=' + API_KEY;
export const ENDPOINT_MOVIE =
	ENDPOINT + '/movie/507086?api_key=' + API_KEY + '&append_to_response=videos';
