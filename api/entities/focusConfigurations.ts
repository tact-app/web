import { ApiService } from '../ApiService';
import { FocusConfigurationData } from '../../components/pages/Inbox/components/FocusConfiguration/store';

const getFocusConfigurationsApi = (apiService: ApiService) => ({
  get: (id: string) =>
    apiService.get<FocusConfigurationData>(`/api/focus`, { id }),
  add: (task: FocusConfigurationData) => apiService.post(`/api/focus`, task),
  update: (data: { id: string; fields: Partial<FocusConfigurationData> }) =>
    apiService.put(`/api/focus`, data),
});

export default getFocusConfigurationsApi;
