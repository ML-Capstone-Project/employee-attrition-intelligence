import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_EMPLOYEES } from '../data/mockData';

const AppContext = createContext(null);
const STORAGE_KEY = 'attritionAppState';

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || DEMO_EMPLOYEES);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)), [employees]);

  const addEmployee = (employee) => setEmployees((current) => [...current.filter((item) => item.id !== employee.id), employee]);
  const saveDecision = (employeeId, decision) => setEmployees((current) => current.map((employee) => employee.id === employeeId ? { ...employee, ...decision, reviewStatus: 'Reviewed' } : employee));
  const getEmployee = (employeeId) => employees.find((employee) => employee.id === employeeId);
  return <AppContext.Provider value={{ employees, addEmployee, saveDecision, getEmployee }}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);