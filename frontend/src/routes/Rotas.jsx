import React, { lazy, useEffect } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DefaultLayout from "../layouts/DefaultLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import TasksPage from "modules/insight/pages/TasksPage";

// Layouts

// Páginas – Clarohub
const Login = lazy(() => import("../modules/clarohub/pages/Login"));
const Home = lazy(() => import("../modules/clarohub/pages/Home"));
const OCFacilAdmin = lazy(
  () => import("../modules/clarohub/pages/OCFacilAdmin"),
);
const OCQualinet = lazy(() => import("../modules/clarohub/pages/OCQualinet"));
const NetFacil = lazy(() => import("../modules/clarohub/pages/NetFacil"));
const Clarospark = lazy(() => import("../modules/clarospark/pages/Home"));

// Páginas – Clarohub Admin
const NetFacilAdmin = lazy(
  () => import("../modules/clarohub/pages/NetFacilAdmin"),
);
const AppAdmin = lazy(() => import("../modules/clarohub/pages/AppAdmin"));
const UsersAdmin = lazy(() => import("../modules/clarohub/pages/Users"));

// Páginas – Claroflow
const Claroflow = lazy(() => import("../modules/claroflow/pages/Flow"));

// Páginas – Insight

const InsightsHome = lazy(
  () => import("../modules/insight/pages/DashboardPage"),
);
const InsightsTeam = lazy(() => import("../modules/insight/pages/TeamsPage"));
const InsightsAnalytics = lazy(
  () => import("../modules/insight/pages/AnalyticsPage"),
);

const InsightsVacations = lazy(
  () => import("../modules/insight/pages/VacationsPage"),
);
const InsightsSettings = lazy(
  () => import("../modules/insight/pages/SettingsPage"),
);

// Mapeamento de rotas para títulos
const routeTitles = {
  "/login": "Claro Hub - Login",
  "/": "Claro Hub",
  "/home": "Claro Hub",
  "/ocfacil": "OC Fácil",
  "/netfacil": "Net Fácil",
  "/spark": "Claro Spark",
  "/flow": "Claro Flow",
  "/insights": "Insight",
  "/insights/tasks": "Insight - Demandas",
  "/insights/dashboard": "Insight - Dashboard",
  "/insights/team": "Insight - Equipe",
  "/insights/analytics": "Insight - Analytics",
  "/insights/vacations": "Insight - Férias",
  "/insights/settings": "Insight - Configurações",
};

export default function Rotas() {
  const location = useLocation();

  useEffect(() => {
    const newTitle = routeTitles[location.pathname] || "Claro Hub";
    document.title = newTitle;
  }, [location.pathname]);

  const routes = useRoutes([
    {
      path: "/login",
      element: (
        <ProtectedRoute isLoginPage>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      element: <DefaultLayout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
            >
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
            >
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/ocadmin",
          element: (
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <OCFacilAdmin />
            </ProtectedRoute>
          ),
        },
        {
          path: "/ocfacil",
          element: (
            <ProtectedRoute allowedRoles={["basic", "manager", "admin"]}>
              <OCQualinet />
            </ProtectedRoute>
          ),
        },
        {
          path: "/netfacil",
          element: (
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
            >
              <NetFacil />
            </ProtectedRoute>
          ),
        },
        {
          path: "/spark",
          element: (
            <ProtectedRoute allowedRoles={["basic", "manager", "admin"]}>
              <Clarospark />
            </ProtectedRoute>
          ),
        },
        {
          path: "/flow",
          element: (
            <ProtectedRoute allowedRoles={["basic", "manager", "admin"]}>
              <Claroflow />
            </ProtectedRoute>
          ),
        },
        {
          path: "/netadmin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <NetFacilAdmin />
            </ProtectedRoute>
          ),
        },
        {
          path: "/appadmin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppAdmin />
            </ProtectedRoute>
          ),
        },
        {
          path: "/usersadmin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersAdmin />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      element: <SidebarLayout />,
      children: [
        {
          path: "/insights",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <Navigate to="/insights/vacations" replace />
            </ProtectedRoute>
          ),
        },
        {
          path: "/insights/tasks",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <TasksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/insights/dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <InsightsHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "/insights/team",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <InsightsTeam />
            </ProtectedRoute>
          ),
        },
        {
          path: "/insights/analytics",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <InsightsAnalytics />
            </ProtectedRoute>
          ),
        },

        {
          path: "/insights/vacations",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <InsightsVacations />
            </ProtectedRoute>
          ),
        },
        {
          path: "/insights/settings",
          element: (
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <InsightsSettings />
            </ProtectedRoute>
          ),
        },
      ],
    },

    { path: "*", element: <Navigate to="/home" replace /> },
  ]);

  return routes;
}
