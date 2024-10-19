import axios from "axios";

class Api {
    constructor() {
        this.baseUrl = "https://online-learning-app.onrender.com";
        // this.baseUrl = "http://localhost:5656";
    }

    getToken() {
        return localStorage.getItem("token");
    }

    signup(data) {
        return axios.post(`${this.baseUrl}/user/create`, data);
    }

    signin(data) {
        return axios.post(`${this.baseUrl}/user/login`, data);
    }

    getUsers(){
        return axios.get(`${this.baseUrl}/user/list`);
    }

    addCourse(data) {
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/courses/create`, data, { headers: { token } });
    }

    getCourses() {
        return axios.get(`${this.baseUrl}/courses`);
    }

    getCourseById(id) {
        return axios.get(`${this.baseUrl}/courses/${id}`);
    }

    updateCourse(id, data) {
        const token = this.getToken();
        return axios.put(`${this.baseUrl}/courses/${id}`, data, { headers: { token } });
    }

    deleteCourse(id) {
        const token = this.getToken();
        return axios.delete(`${this.baseUrl}/courses/${id}`, { headers: { token } });
    }

    uploadMedia(data) {
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/media/upload`, data, { headers: { token } });
    }

    listMedia() {
        const token = this.getToken();
        return axios.get(`${this.baseUrl}/media`, { headers: { token } });
    }

    addCategory(data) {
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/category/create`, data, { headers: { token } });
    }

    getCategories() {
        return axios.get(`${this.baseUrl}/category`);
    }

    getUserProfile() {
        const token = this.getToken();
        return axios.get(`${this.baseUrl}/users/profile`, { headers: { token } });
    }

    updateUserProfile(data) {
        const token = this.getToken();
        return axios.put(`${this.baseUrl}/users/profile`, data, { headers: { token } });
    }

    enrollUserInCourse(data) {
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/user-courses/user-enroll`, data, { headers: { token } });
    }

    getUserCourses(id) {
        const token = this.getToken();
        return axios.get(`${this.baseUrl}/user-courses/user-courses/${id}`, { headers: { token } });
    }

    getMedia(){
        const token = this.getToken();
        return axios.get(`${this.baseUrl}/media/`, { headers: { token } });
    }
    addMedia(data){
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/media/create`, data, { headers: { token } });
    }

    markVideoAsCompleted(data){
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/user-courses/update-completed-video`, data, { headers: { token } });
    }
    getCourseDetails(data){
        const token = this.getToken();
        return axios.post(`${this.baseUrl}/user-courses/getUserCoursesDetails`, data, { headers: { token } });
    }
}

const api = new Api();
export default api;
