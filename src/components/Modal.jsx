import React, { useEffect } from 'react';
import '../styles/modal.scss';

const Modal = ({ isOpen, onClose, children }) => {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div
					aria-label="Close modal"
					role="button"
					tabIndex={0}
					className="modal-close"
					onClick={onClose}
				/>
				{children}
			</div>
		</div>
	);
};

export default Modal;
