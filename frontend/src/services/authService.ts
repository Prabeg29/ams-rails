import http from "../utils/http";

export interface LoginProps {
	email: string;
	password: string;
}

export interface RegisterProps {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	phone: string;
	dob: string;
	gender: string;
	address: string;
}

export default {
  register: (payload: RegisterProps) => http.post("/auth/register", payload),
  login: (payload: LoginProps) => http.post("/auth/login", payload),
};
