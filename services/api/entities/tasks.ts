import { ApiService } from '../ApiService';
import { TaskData } from '../../../components/shared/TasksList/types';

const getTasksApi = (apiService: ApiService) => ({
  list: (id: string) =>
    apiService.get<{ tasks: Record<string, TaskData>; order: string[] }>(
      `/api/tasks`,
      { id }
    ),
  all: () =>
    apiService.get<TaskData[]>(`/api/tasks/all`),
  map: (taskIds: string[]) =>
    apiService.post<Record<string, TaskData>>(`/api/tasks/map`, { taskIds }),
  create: (listId: string, task: TaskData, placement: 'top' | 'bottom') =>
    apiService.post<TaskData[]>(`/api/tasks/create`, {
      listId,
      task,
      placement,
    }),
  createBulk: (listId: string, tasks: TaskData[], order?: string[]) =>
    apiService.post<void>(`/api/tasks/create/bulk`, {
      listId,
      tasks,
      order,
    }),
  delete: (ids: string[], listId?: string) =>
    apiService.delete(`/api/tasks/delete`, { ids, listId }),
  order: (data: { listId: string; taskIds: string[]; destination: number }) =>
    apiService.put<TaskData[]>(`/api/tasks/order`, data),
  orderReset: (data: { listId: string; order: string[]; }) =>
    apiService.put<TaskData[]>(`/api/tasks/order/reset`, data),
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
