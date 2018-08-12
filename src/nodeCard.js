import React from "react";
import Modal from "./modal";

const NCModal = ({
  toggleModal,
  modalIsOpen
}) => (
  <Modal isOpen={modalIsOpen} toggleModal={toggleModal}>
    <div>hello</div>
  </Modal>
);

export default NCModal;
