import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
const fetchConferenceById = async (id = 1) => {
   try {
      const response = await axios.get(`${API_URL}/conference_page/c/${id}/`);
      return response.data;
   } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
   }
};
const fetchSurveys = async () => {
   try {
      const response = await axios.get(`${API_URL}/conference_page/surveys/`);
      return response.data;
   } catch (error) {
      console.error("Error fetching surveys:", error);
      throw error;
   }
};
export { fetchConferenceById, fetchSurveys };
