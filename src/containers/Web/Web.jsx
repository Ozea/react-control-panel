import React, { Component, useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { bulkAction, getWebList, handleAction } from '../../ControlPanelService/Web';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import WebDomain from '../../components/WebDomain/WebDomain';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/ControlPanel/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import './Web.scss';
import { webFull } from '../../mocks/web';

const Web = props => {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    webDomains: [],
    webFav: [],
    loading: false,
    toggledAll: false,
    modalText: '',
    modalVisible: false,
    modalActionUrl: '',
    sorting: window.GLOBAL.App.i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(removeControlPanelContentFocusedElement());
    fetchData();

    return () => {
      dispatch(removeControlPanelContentFocusedElement());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleContentSelection);
    window.addEventListener("keydown", handleFocusedElementShortcuts);

    return () => {
      window.removeEventListener("keydown", handleContentSelection);
      window.removeEventListener("keydown", handleFocusedElementShortcuts);
    };
  }, [controlPanelFocusedElement, focusedElement, state.webDomains]);

  const handleContentSelection = event => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      if (focusedElement) {
        dispatch(MainNavigation.removeFocusedElement());
      }
    }

    if (event.keyCode === 38) {
      event.preventDefault();
      handleArrowUp();
    } else if (event.keyCode === 40) {
      event.preventDefault();
      handleArrowDown();
    }
  }

  const initFocusedElement = webDomains => {
    webDomains[0]['FOCUSED'] = webDomains[0]['NAME'];
    setState({ ...state, webDomains });
    dispatch(addControlPanelContentFocusedElement(webDomains[0]['NAME']));
  }

  const handleArrowDown = () => {
    let webDomains = [...state.webDomains];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(webDomains);
      return;
    }

    let focusedElementPosition = webDomains.findIndex(webDomain => webDomain.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== webDomains.length - 1) {
      let nextFocusedElement = webDomains[focusedElementPosition + 1];
      webDomains[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, webDomains });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let webDomains = [...state.webDomains];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(webDomains);
      return;
    }

    let focusedElementPosition = webDomains.findIndex(webDomain => webDomain.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = webDomains[focusedElementPosition - 1];
      webDomains[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, webDomains });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 76: return handleLogs();
        case 83: return handleSuspend();
        case 8: return handleDelete();
        case 13: return handleEdit();
        default: break;
      }
    }
  }

  const handleLogs = () => {
    props.history.push(`/list/web-log?domain=${controlPanelFocusedElement}&type=access`);
  }

  const handleEdit = () => {
    props.history.push(`/edit/web?domain=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { webDomains } = state;
    let currentWebDomainData = webDomains.filter(webDomain => webDomain.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentWebDomainData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentWebDomainData.spnd_confirmation, `/${suspendedStatus}/web?domain=${controlPanelFocusedElement}&token=${token}`);
  }

  const handleDelete = () => {
    const { webDomains } = state;
    let currentWebDomainData = webDomains.filter(webDomain => webDomain.NAME === controlPanelFocusedElement)[0];

    displayModal(currentWebDomainData.delete_confirmation, `/delete/web/?domain=${controlPanelFocusedElement}&token=${token}`);
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getWebList()
      .then(result => {
        setState({
          ...state,
          webDomains: reformatData(result.data.data),
          webFav: result.data.webFav,
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const reformatData = data => {
    let webDomains = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      webDomains.push(data[i]);
    }

    return webDomains;
  }

  const webDomains = () => {
    const webFav = { ...state.webFav };
    let webDomains = [...state.webDomains];

    webDomains.forEach(webDomain => {
      webDomain.FOCUSED = controlPanelFocusedElement === webDomain.NAME;

      if (webFav[webDomain.NAME]) {
        webDomain.STARRED = webFav[webDomain.NAME];
      } else {
        webDomain.STARRED = 0;
      }
    });

    let sortedResult = sortArray(webDomains);

    return sortedResult.map((item, index) => {
      return <WebDomain data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    let duplicate = [...state.selection];
    let webDomainsDuplicate = state.webDomains;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = webDomainsDuplicate.findIndex(webDomain => webDomain.NAME === name);
    webDomainsDuplicate[incomingItem].isChecked = !webDomainsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, webDomains: webDomainsDuplicate, selection: duplicate });
  }

  const sortArray = array => {
    let sortingColumn = sortBy(state.sorting);

    if (state.order === "descending") {
      return array.sort((a, b) => (a[sortingColumn] < b[sortingColumn]) ? 1 : ((b[sortingColumn] < a[sortingColumn]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortingColumn] > b[sortingColumn]) ? 1 : ((b[sortingColumn] > a[sortingColumn]) ? -1 : 0));
    }
  }

  const sortBy = sorting => {
    const { Date, Domain, Disk, Bandwidth, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Domain: return 'ALIAS';
      case window.GLOBAL.App.i18n['IP Addresses']: return 'IP';
      case Disk: return 'U_DISK';
      case Bandwidth: return 'U_BANDWIDTH';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    let webFavDuplicate = state.webFav;

    if (type === 'add') {
      webFavDuplicate[value] = 1;

      addFavorite(value, 'web')
        .then(() => {
          setState({ ...state, webFav: webFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      webFavDuplicate[value] = undefined;

      deleteFavorite(value, 'web')
        .then(() => {
          setState({ ...state, webFav: webFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const webDomainsDuplicate = [...state.webDomains];

    if (toggled) {
      let webDomainNames = [];

      let webDomains = webDomainsDuplicate.map(webDomain => {
        webDomainNames.push(webDomain.NAME);
        webDomain.isChecked = true;
        return webDomain;
      });

      setState({ ...state, webDomains, selection: webDomainNames, toggledAll: toggled });
    } else {
      let webDomains = webDomainsDuplicate.map(webDomain => {
        webDomain.isChecked = false;
        return webDomain;
      });

      setState({ ...state, webDomains, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    if (state.selection.length && action) {
      setState({ ...state, loading: true }, () => {
        bulkAction(action, state.selection)
          .then(result => {
            if (result.status === 200) {
              fetchData();
              toggleAll(false);
            }
          })
          .catch(err => console.error(err));
      });
    }
  }

  const displayModal = (text, url) => {
    setState({
      ...state,
      modalVisible: !state.modalVisible,
      modalText: text,
      modalActionUrl: url
    });
  }

  const modalConfirmHandler = () => {
    handleAction(state.modalActionUrl)
      .then(() => {
        fetchData();
        modalCancelHandler();
      })
      .catch(err => console.error(err));
  }

  const modalCancelHandler = () => {
    setState({
      ...state,
      modalVisible: false,
      modalText: '',
      modalActionUrl: ''
    });
  }

  return (
    <div className="web">
      <Toolbar mobile={false} >
        <LeftButton name="Add Web Domain" href="/add/web/" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='webList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="webList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="web-domains-wrapper">
        {state.loading ? <Spinner /> : webDomains()}
      </div>
      <div className="total">{state.totalAmount}</div>
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={state.modalVisible}
        text={state.modalText} />
    </div>
  );
}

export default Web;