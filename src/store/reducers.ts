import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/MetricsSwitch/reducer';
import { reducer as realTimeMeasurementsReducer } from '../Features/RealTimePanel/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  realTimeMeasurements: realTimeMeasurementsReducer,
};
