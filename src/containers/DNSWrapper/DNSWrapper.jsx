import QueryString from 'qs';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DnsRecords from '../DNSRecords/DNSRecords';
import DomainNameSystems from '../DomainNameSystems/DomainNameSystems';

export default function DNSWrapper(props) {
  const history = useHistory();
  const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });
  const [isDnsRecords, setIsDnsRecords] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain) {
      setIsDnsRecords(true);
    } else {
      setIsDnsRecords(false);
    }
  }, [history.location]);

  return (
    <>
      {
        isDnsRecords
          ? <DnsRecords {...props} changeSearchTerm={props.handleSearchTerm} />
          : <DomainNameSystems {...props} changeSearchTerm={props.handleSearchTerm} />
      }
    </>
  );
}