import { useState, useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, threshold = 50) => {
	const [isFetching, setIsFetching] = useState(false);
	const isFetchingRef = useRef(false);
	const ticking = useRef(false); // evita múltiplos rAF

	useEffect(() => {
		isFetchingRef.current = isFetching;
	}, [isFetching]);

	const handleScroll = useCallback(() => {
		if (!ticking.current) {
			ticking.current = true;

			requestAnimationFrame(() => {
				const { scrollHeight, scrollTop, clientHeight } =
					document.documentElement;

				if (
					scrollHeight - scrollTop <= clientHeight + threshold &&
					!isFetchingRef.current
				) {
					setIsFetching(true);
				}

				ticking.current = false;
			});
		}
	}, [threshold]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		if (!isFetching) return;

		const fetchMore = async () => {
			await callback();
			setIsFetching(false);
		};

		fetchMore();
	}, [isFetching, callback]);

	return { isFetching };
};

export default useInfiniteScroll;
