import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricsData = string[];

export type ApiErrorAction = {
  error: string;
};

export type ActiveMetricEntries = {
  activeMetrics: string[];
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
    setActiveMetrics: (state, action: PayloadAction<ActiveMetricEntries>) => {
      const { activeMetrics } = action.payload;
      state.activeMetrics = activeMetrics;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
