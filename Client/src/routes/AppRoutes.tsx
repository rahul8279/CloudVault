import { Navigate, Route, Routes } from "react-router"
import LoginPage from "../Pages/Auth/LoginPage"
import AppLayout from "../components/AppLayout"
import DashboardPage from "../Pages/Dashboard/DashboardPage"
import DirectoryPage from "../Pages/DirectoryPage/DirectoryPage"
import PageNotFound from "../Pages/PageNotFound"

function AppRoutes(){
   return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="files" element={<DirectoryPage />} />
        <Route path="files/:directoryId" element={<DirectoryPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
   )
}

export default AppRoutes
