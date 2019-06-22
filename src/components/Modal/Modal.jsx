import React, { Component } from 'react';
import AddFile from './AddFile';
import AddDirectory from './AddDirectory';
import Rename from './Rename';
import Delete from './Delete';
import NothingSelected from './NothingSelected';
import Permissions from './Permissions';
import Move from './Move';
import Archive from './Archive';
import Extract from './Extract';
import Copy from './Copy';
import './Modal.scss';

class Modal extends Component {

  componentDidMount = () => {
    window.addEventListener("click", this.closeOutside);
    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount = () => {
    window.removeEventListener("click", this.closeOutside);
    document.removeEventListener("keydown", this.hotkeys);
  }

  hotkeys = (e) => {
    if (e.keyCode === 27) {
      this.closeModal();
    } else if (e.keyCode === 13) {
      this.saveAndClose();
    }
  }

  saveAndClose = () => {
    this.props.onClick();
    this.props.onClose();
  }

  changePermissions = (permissions) => {
    this.props.onChangePermissions(permissions);
  }

  onChange = (e) => {
    this.props.onChangeValue(e.target.value);
  }

  closeModal = () => {
    this.props.onClose();
  }

  closeOutside = (e) => {
    let modal = document.getElementById("modal");
    if (e.target === modal) {
      this.props.onClose();
    }
  }

  content = () => {
    const { type, reference, fName, permissions, items, path } = this.props;
    switch (type) {
      case 'Copy': return <Copy close={this.closeModal} save={this.saveAndClose} reference={reference} onChange={this.onChange} name={type} path={path} fName={fName} items={items} />;
      case 'Move': return <Move close={this.closeModal} save={this.saveAndClose} reference={reference} onChange={this.onChange} name={type} path={path} fName={fName} items={items} />;
      case 'Permissions': return <Permissions close={this.closeModal} save={this.saveAndClose} changePermissions={this.changePermissions} fName={fName} permissions={permissions} />;
      case 'Extract': return <Extract close={this.closeModal} save={this.saveAndClose} reference={reference} onChange={this.onChange} name={type} fName={fName} path={path} />;
      case 'Archive': return <Archive close={this.closeModal} save={this.saveAndClose} reference={reference} onChange={this.onChange} name={type} fName={fName} path={path} />;
      case 'Rename': return <Rename close={this.closeModal} save={this.saveAndClose} reference={reference} onChange={this.onChange} name={type} fName={fName} />;
      case 'Add directory': return <AddDirectory close={this.closeModal} save={this.saveAndClose} reference={reference} />;
      case 'Delete': return <Delete close={this.closeModal} save={this.saveAndClose} fName={fName} items={items} />;
      case 'Add file': return <AddFile close={this.closeModal} save={this.saveAndClose} reference={reference} />;
      case 'Nothing selected': return <NothingSelected close={this.closeModal} />;
      default:
        break;
    }
  }

  render() {
    const { modalVisible } = this.props;
    return (
      <div>
        {!modalVisible &&
          <div className="modal" id="modal">
            {this.content()}
          </div>}
      </div>
    );
  }
}

export default Modal;