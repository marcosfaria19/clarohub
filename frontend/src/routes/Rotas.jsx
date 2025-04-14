// src/routes/Rotas.jsx
import React, { lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DefaultLayout from "../layouts/DefaultLayout";
import SidebarLayout from "../layouts/SidebarLayout";

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
const TeamBoard = lazy(() => import("../modules/claroflow/pages/TeamBoard"));
const ProjectsFlowDashboard = lazy(
  () => import("../modules/claroflow/components/projects/ProjectFlowDashboard"),
);

// Páginas – Insight
const Insights = lazy(() => import("../modules/insight/pages/Insights"));

export default function Rotas() {
  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />,
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
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
            >
              <Clarospark />
            </ProtectedRoute>
          ),
        },
        {
          path: "/flow",
          element: (
            <ProtectedRoute
              allowedRoles={["guest", "basic", "manager", "admin"]}
            >
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
        {
          path: "/projects/admin",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProjectsFlowDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/projects/board",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <TeamBoard />
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
            <ProtectedRoute allowedRoles={["admin"]}>
              <Insights />
            </ProtectedRoute>
          ),
        },
      ],
    },

    { path: "*", element: <Navigate to="/home" replace /> },
  ]);

  return routes;
}
