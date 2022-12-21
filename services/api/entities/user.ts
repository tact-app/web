import { ApiService } from '../ApiService';
import { UserData } from '../../../stores/RootStore/UserStore';

const getUserApi = (apiService: ApiService) => ({
  get: (id: string) => apiService.get<UserData>(`/api/user/${id}`),
});

export default getUserApi;
