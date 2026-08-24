import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Sends employee profile data to the Flask ML backend endpoint POST /predict.
 * 
 * @param {Object} formData Raw form data from steps 1 & 2
 * @returns {Promise<{attrition: string, probability: number, risk: string}>}
 */
export const predictAttrition = async (formData) => {
  // Format payload precisely matching Flask API expectations
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
    const response = await apiClient.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.error('API Error when communicating with Flask backend:', error);
    throw error;
  }
};

export default apiClient;
