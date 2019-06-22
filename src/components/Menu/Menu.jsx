import React, { Component } from 'react';
import './Menu.scss';

class Menu extends Component {

  componentDidMount = () => {
    document.addEventListener("keydown", this.hotKeys);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.hotKeys);
  }

  newFile = () => {
    this.props.openModal("Add file");
  }

  newDirectory = () => {
    this.props.openModal("Add directory");
  }

  delete = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Delete");
      }
    } else {
      openModal("Delete", selection.length);
    }
  }

  rename = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Rename");
    }
  }

  permissions = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Permissions");
    }
  }

  move = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Move");
      }
    } else {
      openModal("Move", selection.length);
    }
  }

  archive = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Archive");
    }
  }

  extract = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Extract");
    }
  }

  copy = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Copy");
      }
    } else {
      openModal("Copy", selection.length);
    }
  }

  upload = (e) => {
    this.props.upload(e.target.files);
  }

  download = () => {
    this.props.download();
  }

  hotKeys = (e) => {
    if (this.props.modalVisible) {
      return;
    }

    switch (e.keyCode) {
      case 112: return this.newFile();
      case 113: return this.newDirectory();
      case 114: return this.rename();
      case 115: return this.permissions();
      case 116: return this.delete();
      default: break;
    }
  }

  render() {
    return (
      <div className="btn-group" role="group" aria-label="First group">
        <input type="file" className="upload" multiple onChange={this.upload} ref={inputFile => this.inputFile = inputFile} />
        <button type="button" className="btn btn-light" id="upload" onClick={() => this.inputFile.click()}>Upload</button>
        <button type="button" className="btn btn-light big" onClick={this.newFile}>New file</button>
        <button type="button" className="btn btn-light small" onClick={this.newFile} title="New file"><span className="glyphicon glyphicon-file"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.newDirectory}>New dir</button>
        <button type="button" className="btn btn-light small" onClick={this.newDirectory} title="New directory"><span className="glyphicon glyphicon-folder-close"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.download}>Download</button>
        <button type="button" className="btn btn-light small" onClick={this.download} title="Download"><span className="glyphicon glyphicon-download-alt"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.rename}>Rename</button>
        <button type="button" className="btn btn-light small" onClick={this.rename} title="Rename"><span className="glyphicon glyphicon-italic"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.permissions}>Permissions</button>
        <button type="button" className="btn btn-light small" onClick={this.permissions} title="Permissions"><span className="glyphicon glyphicon-user"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.copy}>Copy</button>
        <button type="button" className="btn btn-light small" onClick={this.copy} title="Copy"><span className="glyphicon glyphicon-copy"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.move}>Move</button>
        <button type="button" className="btn btn-light small" onClick={this.move} title="Move"><span className="glyphicon glyphicon-paste"></span></button>
        <button type="button" className="btn btn-light big" onClick={this.archive}>Archive</button>
        <button type="button" className="btn btn-light small" onClick={this.archive} title="Archive"><span className="glyphicon glyphicon-book"></span></button>
        {this.props.name.match('.tar.gz') ? <button type="button" className="btn btn-light big" onClick={this.extract}>Extract</button> : null}
        {this.props.name.match('.tar.gz') ? <button type="button" className="btn btn-light small" onClick={this.extract} title="Extract"><span className="glyphicon glyphicon-open"></span></button> : null}
        <button type="button" className="btn btn-light big" onClick={this.delete} >Delete</button>
        <button type="button" className="btn btn-light small" onClick={this.delete} title="Delete"><span className="glyphicon glyphicon-trash"></span></button>
      </div>
    );
  }
}

export default Menu;