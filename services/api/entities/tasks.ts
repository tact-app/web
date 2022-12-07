import { ApiService } from '../ApiService';
import { TaskData } from '../../../components/shared/TasksList/types';

const getTasksApi = (apiService: ApiService) => ({
  list: (id: string) =>
    apiService.get<{ tasks: Record<string, TaskData>; order: string[] }>(
      `/api/tasks`,
      { id }
    ),
  create: (listId: string, task: TaskData, placement: 'top' | 'bottom') =>
    apiService.post<TaskData[]>(`/api/tasks/create`, {
      listId,
      task,
      placement,
    }),
  delete: (listId: string, ids: string[]) =>
    apiService.delete<TaskData[]>(`/api/tasks/delete`, { ids, listId }),
  order: (data: { listId: string; taskIds: string[]; destination: number }) =>
    apiService.put<TaskData[]>(`/api/tasks/order`, data),
  swap: (data: {
    fromListId: string;
    toListId: string;
    taskIds: string[];
    destination?: number;
  }) => apiService.put<TaskData[]>(`/api/tasks/swap`, data),
  update: (data: { id: string; fields: Partial<TaskData> }) =>
    apiService.put<TaskData[]>(`/api/tasks/update`, data),
  assignGoal: (data: { taskIds: string[]; goalId: string | null }) =>
    apiService.put<TaskData[]>(`/api/tasks/assign-goal`, data),
});

export default getTasksApi;
