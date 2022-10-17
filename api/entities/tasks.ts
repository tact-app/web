import ApiService from '../ApiService';
import { TaskData } from '../../components/pages/Inbox/types';

const getTasksApi = (apiService: ApiService) => ({
  getList: (id: string) => apiService.get<{ tasks: Record<string, TaskData>, order: string[] }>(`/api/tasks`, { id }),
  create: (task: TaskData) => apiService.post<TaskData[]>(`/api/tasks/create`, task),
  delete: (listId: string, ids: string[]) => apiService.post<TaskData[]>(`/api/tasks/delete`, { ids, listId }),
  order: (data: { listId: string, taskIds: string[], destination: number }) => apiService.put<TaskData[]>(`/api/tasks/order`, data),
  update: (data: { id: string, fields: Partial<TaskData> }) => apiService.put<TaskData[]>(`/api/tasks/update`, data),
  assignGoal: (data: { taskIds: string[], goalId: string | null}) => apiService.put<TaskData[]>(`/api/tasks/assign-goal`, data),
});

export default getTasksApi;
