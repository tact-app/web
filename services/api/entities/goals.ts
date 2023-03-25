import { ApiService } from '../ApiService';
import { GoalData } from '../../../components/pages/Goals/types';

const getGoalsApi = (apiService: ApiService) => ({
  list: (id: string) =>
    apiService.get<{ goals: Record<string, GoalData>; }>(
      `/api/goals`,
      { id }
    ),
  create: (goal: GoalData) =>
    apiService.post<GoalData[]>(`/api/goals/create`, goal),
  delete: (ids: string[]) =>
    apiService.post<GoalData[]>(`/api/goals/delete`, { ids }),
  update: (data: { id: string; fields: Partial<GoalData> }) =>
    apiService.put<GoalData[]>(`/api/goals`, data),
});

export default getGoalsApi;
