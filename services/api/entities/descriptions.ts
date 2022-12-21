import { ApiService } from '../ApiService';
import { DescriptionData } from '../../../types/description';

const getDescriptionsApi = (apiService: ApiService) => ({
  add: (data: DescriptionData) => apiService.post(`/api/description`, data),
  get: (id: string) =>
    apiService.get<DescriptionData>(`/api/description`, { id }),
  update: (data: { id: string; fields: Partial<DescriptionData> }) =>
    apiService.put<DescriptionData>(`/api/description`, data),
});

export default getDescriptionsApi;
