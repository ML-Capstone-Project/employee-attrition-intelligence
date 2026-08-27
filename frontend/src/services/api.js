import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Sends employee profile data to the Flask ML backend.
 *
 * @param {Object} formData Raw form data from steps 1 & 2
 * @returns {Promise<{attrition: string, probability: number, risk: string}>}
 */
export const predictAttrition = async (formData) => {
  const payload = {
    Age: Number(formData.Age),
    JobLevel: Number(formData.JobLevel),
    JobSatisfaction: Number(formData.JobSatisfaction),
    EnvironmentSatisfaction: Number(formData.EnvironmentSatisfaction),
    JobInvolvement: Number(formData.JobInvolvement),
    MonthlyIncome: Number(formData.MonthlyIncome),
    OverTime: formData.OverTime === 'Yes' ? 'Yes' : 'No',
    WorkLifeBalance: Number(formData.WorkLifeBalance),
    YearsAtCompany: Number(formData.YearsAtCompany),
    YearsInCurrentRole: Number(formData.YearsInCurrentRole),
    YearsWithCurrManager: Number(formData.YearsWithCurrManager),
    JobRole: String(formData.JobRole || '').trim(),
  };

  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/predict`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error(
      'API Error when communicating with Flask backend:',
      error
    );

    throw error;
  }
};

export const loginEmployee = async (email, password) => {
  const response = await apiClient.post(`${API_BASE_URL}/api/auth/employee/login`, { email, password });
  localStorage.setItem('authToken', response.data.token);
  return { ...response.data.user, id: response.data.user.employee_id, employeeId: response.data.user.employee_id, whatsapp: response.data.user.whatsapp_number };
};

export const signupEmployee = async (account) => {
  const response = await apiClient.post(`${API_BASE_URL}/api/auth/employee/signup`, { name: account.name, employee_id: account.employeeId, email: account.email, password: account.password, whatsapp_number: account.whatsapp });
  return response.data.employee;
};

export const loginHR = async (email, password, accounts) => {
  const response = await apiClient.post(`${API_BASE_URL}/api/auth/hr/login`, { email, password });
  localStorage.setItem('authToken', response.data.token);
  return { ...response.data.user, id: response.data.user.hr_id };
};

export const submitAssessment = async (assessment) => (await apiClient.post(`${API_BASE_URL}/api/assessments`, assessment)).data;
export const getEmployeesForHR = async () => (await apiClient.get(`${API_BASE_URL}/api/hr/employees`)).data.employees;
export const getEmployeeDetails = async (employeeId) => (await apiClient.get(`${API_BASE_URL}/api/hr/employees/${employeeId}`)).data.employee;
export const saveHRDecision = async (employeeId, decision) => (await apiClient.post(`${API_BASE_URL}/api/hr/employees/${employeeId}/review`, decision)).data;
export const getEmployeeStatus = async () => (await apiClient.get(`${API_BASE_URL}/api/employee/status`)).data.employee;
export const getHRDashboard = async () => (await apiClient.get(`${API_BASE_URL}/api/hr/dashboard`)).data;

export default apiClient;