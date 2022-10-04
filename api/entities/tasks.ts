import ApiService from '../ApiService';
import { TaskData } from '../../components/pages/Inbox/store/types';

const getTasksApi = (apiService: ApiService) => ({
  getList: () => apiService.get<TaskData[]>(`/api/tasks`)
});

export default getTasksApi;