import ApiService from '../ApiService';
import { TaskData, TaskStatus } from '../../components/pages/Inbox/store/types';

const getTasksApi = (apiService: ApiService) => ({
  getList: () => apiService.get<TaskData[]>(`/api/tasks`),
  create: (task: TaskData) => apiService.post<TaskData[]>(`/api/tasks/create`, task),
  order: (data: { id: string, index: number }) => apiService.post<TaskData[]>(`/api/tasks/order`, data),
  status: (data: { id: string, status: TaskStatus }) => apiService.post<TaskData[]>(`/api/tasks/status`, data),
});

export default getTasksApi;