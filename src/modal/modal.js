import React from "react";
import {Icons} from 'oce-components/build'
import './style.css'

const Modal = ({ isOpen, toggleModal, content, children }) => {
  return isOpen ? (
    <div className={'Wrapper'}>
      <div className={'Background'} onClick={toggleModal} />
      <div className={'Dialog'}>
        <div className={'Actions'}>
          <div className={'Close'} onClick={toggleModal}><Icons.Cross width='20' height='20' color='#333' /></div>
        </div>
        <div className={'Content'}>
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
