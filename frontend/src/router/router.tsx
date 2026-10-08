import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import RootLayout from '../layouts/RootLayout'

import EmployeeOverview from '../pages/employee/Overview'
import EmployeeQualifications from '../pages/employee/Qualifications'
import EmployeeCompetencies from '../pages/employee/Competencies'
import EmployeeRenewals from '../pages/employee/Renewals'

import SupervisorOverview from '../pages/supervisor/Overview'
import SupervisorRenewals from '../pages/supervisor/Renewals'

import AdminOverview from '../pages/admin/Overview'
import AdminQualifications from '../pages/admin/Qualifications'
import AdminCompetencies from '../pages/admin/Competencies'
import AdminLog from '../pages/admin/Log'

// The NotFound page is used for any route that doesn't match the above routes.
import NotFound from '../pages/NotFound'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/employee/overview" replace />} />
          <Route path="employee">
            <Route
              index
              element={<Navigate to="/employee/overview" replace />}
            />
            <Route path="overview" element={<EmployeeOverview />} />
            <Route path="qualifications" element={<EmployeeQualifications />} />
            <Route path="competencies" element={<EmployeeCompetencies />} />
            <Route path="renewals" element={<EmployeeRenewals />} />
          </Route>
          <Route path="supervisor">
            <Route
              index
              element={<Navigate to="/supervisor/overview" replace />}
            />
            <Route path="overview" element={<SupervisorOverview />} />
            <Route path="renewals" element={<SupervisorRenewals />} />
          </Route>
          <Route path="admin">
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="qualifications" element={<AdminQualifications />} />
            <Route path="competencies" element={<AdminCompetencies />} />
            <Route path="log" element={<AdminLog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
