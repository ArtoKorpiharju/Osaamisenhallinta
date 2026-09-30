import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import RootLayout from '../layouts/RootLayout'

import EmployeeOverview from '../pages/employee/Overview'
import EmployeeQualifications from '../pages/employee/Qualifications'
import EmployeeCompetencies from '../pages/employee/Competencies'
import EmployeeRenewals from '../pages/employee/Renewals'

import ManagerOverview from '../pages/manager/Overview'
import ManagerQualifications from '../pages/manager/Qualifications'
import ManagerCompetencies from '../pages/manager/Competencies'
import ManagerRenewals from '../pages/manager/Renewals'

import AdminOverview from '../pages/admin/Overview'
import AdminQualifications from '../pages/admin/Qualifications'
import AdminCompetencies from '../pages/admin/Competencies'
import AdminLog from '../pages/admin/Log'

// Each role has its own URL, but all currently share the same settings screen.
import Settings from '../pages/Settings'
// The NotFound page is used for any route that doesn't match the above routes.
import NotFound from '../pages/NotFound'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/employee/overview" replace />} />
          <Route path="employee">
            <Route index element={<Navigate to="/employee/overview" replace />} />
            <Route path="overview" element={<EmployeeOverview />} />
            <Route path="qualifications" element={<EmployeeQualifications />} />
            <Route path="competencies" element={<EmployeeCompetencies />} />
            <Route path="renewals" element={<EmployeeRenewals />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="manager">
            <Route index element={<Navigate to="/manager/overview" replace />} />
            <Route path="overview" element={<ManagerOverview />} />
            <Route path="qualifications" element={<ManagerQualifications />} />
            <Route path="competencies" element={<ManagerCompetencies />} />
            <Route path="renewals" element={<ManagerRenewals />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="admin">
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="qualifications" element={<AdminQualifications />} />
            <Route path="competencies" element={<AdminCompetencies />} />
            <Route path="log" element={<AdminLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
