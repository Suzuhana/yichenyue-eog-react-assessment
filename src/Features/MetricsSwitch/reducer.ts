import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricsData = string[];

export type ApiErrorAction = {
  error: string;
};

export type MetricsEntry = {
  metrics: string;
};

export type IMetricsSwitchState = {
  metrics: string[];
  activeMetrics: string[];
};

const initialState: IMetricsSwitchState = {
  metrics: [],
  activeMetrics: [],
};

const slice = createSlice({
  name: 'metricsSwitch',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<MetricsData>) => {
      const metrics = action.payload;
      state.metrics = metrics;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    addMetrics: (state, action: PayloadAction<MetricsEntry>) => {
      const { metrics } = action.payload;
      state.activeMetrics.push(metrics);
    },
    removeMetrics: (state, action: PayloadAction<MetricsEntry>) => {
      const { metrics } = action.payload;
      state.activeMetrics = state.activeMetrics.filter(item => item !== metrics);
    },
    removeAllMetrics: state => {
      state.activeMetrics = [];
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
