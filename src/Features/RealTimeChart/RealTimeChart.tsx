import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import gql from 'graphql-tag';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import moment from 'moment';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <RealTimeChart />
    </Provider>
  );
};

const RealTimeChart = () => {
  const dispatch = useDispatch();
  const { startTimeStamp, currentTimeStamp, dataArray, unitMapping, metricToUnitMapping } = useSelector(
    (state: IState) => state.realTimeChart,
  );
  const { activeMetrics, colorMapping } = useSelector((state: IState) => state.metrics);
  const measurements = dataArray.map(entry => entry.measurements);

  const convertToDatapoints = (
    measurements: {
      metric: string;
      at: number;
      unit: string;
      value: number;
    }[][],
  ) => {
    if (measurements[0] === undefined) {
      return [];
    }
    let length = measurements[0].length;
    const res = [];

    for (let i = 0; i < length; i++) {
      let temp = {};
      measurements.forEach(entry => {
        temp = { ...temp, ...{ [entry[i].metric]: entry[i].value, timeStamp: entry[i].at } };
      });
      res.push(temp);
    }

    return res;
  };

  const dataPoints = convertToDatapoints(measurements);

  const queryArray = activeMetrics
    .reduce(
      (accumulator, currentValue) =>
        `${accumulator},{ metricName: "${currentValue}", after: ${startTimeStamp}, before: ${currentTimeStamp} }`,
      '',
    )
    .substr(1);

  const query = gql`
  {
    getMultipleMeasurements(input: [${queryArray}]) {
      metric
      measurements {
        metric
        at
        unit
        value
      }
    }
  }
`;

  const [result] = useQuery({
    query,
  });

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.realTimeChartApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.measurementsDataReceived(getMultipleMeasurements));
  }, [dispatch, data, error]);

  return (
    <ResponsiveContainer width="90%" height="65%">
      <LineChart data={dataPoints} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <XAxis
          type="number"
          dataKey="timeStamp"
          domain={[startTimeStamp, 'auto']}
          tickFormatter={str => moment(str).format('HH:mm')}
        />
        {Object.keys(unitMapping).map(unitName => (
          <YAxis type="number" key={unitName} yAxisId={unitName} unit={unitName} />
        ))}
        {activeMetrics.map(activeMetric => (
          <Line
            dot={false}
            isAnimationActive={false}
            dataKey={activeMetric}
            type="natural"
            key={activeMetric}
            yAxisId={metricToUnitMapping[activeMetric]}
            stroke={colorMapping[activeMetric]}
          />
        ))}
        <CartesianGrid />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};
