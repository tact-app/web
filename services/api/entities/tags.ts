import { ApiService } from '../ApiService';
import { TaskTag } from '../../../components/shared/TasksList/types';

const getTagsApi = (apiService: ApiService) => ({
  list: () => apiService.get<TaskTag[]>(`/api/tags`),
  create: (task: TaskTag) =>
    apiService.post<TaskTag[]>(`/api/tags/create`, task),
});

export default getTagsApi;
