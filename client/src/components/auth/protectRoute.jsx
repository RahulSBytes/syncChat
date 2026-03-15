import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore.js"

export default function ProtectRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    const loader = useAuthStore((state) => state.loader);
    if (loader) return <div className="h-screen w-screen flex justify-center items-center">
        <span className="text-2xl font-handwriting font-bold text-secondary dark:text-secondary-dark mr-3">Sit tight</span>
        <span className="loading loading-dots loading-xl text-secondary dark:text-secondary-dark"></span>
    </div>
    return user ? children : <Navigate to={'/auth/login'} replace />
}