import { ReactNode, useState } from "react";

import Modal from "../components/common/Modal";

export const useModal = () => {
	const [modal, setModal] = useState<ReactNode | undefined>();

	const closeModal = () => {
		setModal(undefined);
	};

	const triggerModal = (title: string, modal: ReactNode) => {
		const completeModal = (
			<Modal onOutsideClick={closeModal} title={title}>
				{modal}
			</Modal>
		);
		setModal(completeModal);
	};

	return { modal, triggerModal, closeModal };
};
