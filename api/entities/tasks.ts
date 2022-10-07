import ApiService from '../ApiService';
import { TaskData } from '../../components/pages/Inbox/store/types';

const getTasksApi = (apiService: ApiService) => ({
  getList: (id: string) => apiService.get<{ tasks: Record<string, TaskData>, order: string[] }>(`/api/tasks`, { id }),
  create: (task: TaskData) => apiService.post<TaskData[]>(`/api/tasks/create`, task),
  delete: (listId: string, ids: string[]) => apiService.post<TaskData[]>(`/api/tasks/delete`, { ids, listId }),
  order: (data: { listId: string, taskIds: string[], destination: number }) => apiService.post<TaskData[]>(`/api/tasks/order`, data),
  update: (data: { id: string, fields: Partial<TaskData> }) => apiService.post<TaskData[]>(`/api/tasks/update`, data),
});

export default getTasksApi;