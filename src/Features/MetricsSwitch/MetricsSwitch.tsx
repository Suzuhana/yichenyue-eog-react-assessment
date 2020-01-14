import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import gql from 'graphql-tag';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = gql`
  {
    getMetrics
  }
`;

const getMetrics = (state: IState) => {
  const { metrics, activeMetrics } = state.metrics;
  return {
    metrics,
    activeMetrics,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricsSwitch />
    </Provider>
  );
};

const animatedSelect = makeAnimated();

const MetricsSwitch = () => {
  const dispatch = useDispatch();
  const { metrics, activeMetrics } = useSelector(getMetrics, shallowEqual);

  const [result] = useQuery({
    query,
  });

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricsDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedSelect}
      isMulti
      options={metrics.map(entry => ({ value: entry, label: entry }))}
      value={activeMetrics.map(entry => ({ value: entry, label: entry }))}
      onChange={activeOptions => {
        dispatch(
          actions.setActiveMetrics({
            activeMetrics: activeOptions ? activeOptions.map((elem: any) => elem.value) : [],
          }),
        );
      }}
    />
  );
};
