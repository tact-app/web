import ApiService from '../ApiService';
import { TaskTag } from '../../components/pages/Inbox/store/types';

const getTagsApi = (apiService: ApiService) => ({
  get: () => apiService.get<TaskTag[]>(`/api/tags`),
  create: (task: TaskTag) => apiService.post<TaskTag[]>(`/api/tags/create`, task),
});

export default getTagsApi;