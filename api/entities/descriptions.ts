import { ApiService } from '../ApiService';
import { GoalDescriptionData } from '../../components/pages/Goals/types';

const getDescriptionsApi = (apiService: ApiService) => ({
  add: (data: GoalDescriptionData) => apiService.post(`/api/description`, data),
  get: (id: string) =>
    apiService.get<GoalDescriptionData>(`/api/description`, { id }),
  update: (data: { id: string; fields: Partial<GoalDescriptionData> }) =>
    apiService.put<GoalDescriptionData>(`/api/description`, data),
});

export default getDescriptionsApi;
