import { useEffect, useState } from "react";
import axiosInstance from "services/axios";

const useVacations = () => {
  const [vacations, setVacations] = useState([]); // state to store vacations data
  const [employees, setEmployees] = useState([]); // state to store employees data

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axiosInstance.get("/vacations");
        setVacations(response.data);
      } catch (error) {
        console.error("Error fetching vacations:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchVacations();
    fetchEmployees();
  }, []);

  return { vacations, employees };
};

export default useVacations;
