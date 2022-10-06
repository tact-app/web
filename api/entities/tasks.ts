import ApiService from '../ApiService';
import { TaskData, TaskStatus } from '../../components/pages/Inbox/store/types';

const getTasksApi = (apiService: ApiService) => ({
  getList: (id: string) => apiService.get<{ tasks: Record<string, TaskData>, order: string[] }>(`/api/tasks`, { id }),
  create: (task: TaskData) => apiService.post<TaskData[]>(`/api/tasks/create`, task),
  delete: (taskId: string) => apiService.post<TaskData[]>(`/api/tasks/delete`, { id: taskId }),
  order: (data: { listId: string, source: number, destination: number }) => apiService.post<TaskData[]>(`/api/tasks/order`, data),
  update: (data: { id: string, fields: Partial<TaskData> }) => apiService.post<TaskData[]>(`/api/tasks/update`, data),
});

export default getTasksApi;