import { ApiService } from '../ApiService';
import { SpaceData } from '../../../components/pages/Spaces/types';

const getSpacesApi = (apiService: ApiService) => ({
  list: () => apiService.get<SpaceData[]>(`/api/spaces`),
  add: (data: SpaceData) => apiService.post(`/api/spaces`, data),
  update: (data: { id: string; fields: Partial<SpaceData> }) =>
    apiService.put<SpaceData>(`/api/spaces`, data),
});

export default getSpacesApi;
