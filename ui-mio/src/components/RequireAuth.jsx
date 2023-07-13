import {Navigate, useLocation} from "react-router";
import {useAuthProvider} from "../auth/auth";

export function RequireAuth({children}) {
    const auth = useAuthProvider()
    const token = auth.getToken();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" state={{from: location}} replace/>;
    }

    return children;
}
