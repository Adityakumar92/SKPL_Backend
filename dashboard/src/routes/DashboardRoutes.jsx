import { createBrowserRouter } from 'react-router-dom';
import App from "../App";
import ViewRoutes from '../routes/ViewRoutes'; // import wrapper

// Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Contact from '../pages/Contact/Contact';
import About from '../pages/About/About';
import Submission from '../pages/Submission/Submission';
import CreateNewRole from '../pages/Role/CreateNewRole';
import ShowAllUser from '../pages/User/ShowAllUser';
import ShowAllRole from '../pages/Role/ShowAllRole';
import CreateNewChecklist from '../pages/Checklist/CreateNewChecklist';
import ShowAllChecklist from '../pages/Checklist/ShowAllChecklist';
import CreateNewSite from '../pages/Site/CreateNewSite';
import ShowAllSite from '../pages/Site/ShowAllSite';
import Login from '../component/Login';
import CreateNewBuilding from '../pages/Building/CreateNewBuilding';
import ShowAllBuilding from '../pages/Building/ShowAllBuilding';
import CreateNewActivity from '../pages/Activity/CreateNewActivity';
import ShowAllActivity from '../pages/Activity/ShowAllActivity';
import CreateNewItemsMaterial from '../pages/Items_Materail/CreateNewItemsMaterial';
import ShowAllItemsMaterial from '../pages/Items_Materail/ShowAllItemsMaterial';
import EditAbout from '../pages/About/EditAbout';
import EditContact from '../pages/Contact/EditContact';
import ShowAllBackendUser from '../pages/BackendUser/ShowAllBackendUser';
import CreateNewUser from '../pages/User/CreateNewUser';
import CreateNewBackendUser from '../pages/BackendUser/CreateNewBackendUser';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard/",
        element: (
          <ViewRoutes moduleKey="dashboard">
            <Dashboard />
          </ViewRoutes>
        )
      },
      {
        path: "submission/",
        element: (
          <ViewRoutes moduleKey="submission">
            <Submission />
          </ViewRoutes>
        )
      },
      {
        path: "contact/",
        children: [
          {
            path: "edit/",
            element: (
              <ViewRoutes moduleKey="contact">
                <EditContact />
              </ViewRoutes>
            )
          },
          {
            path: "",
            element: (
              <ViewRoutes moduleKey="contact">
                <Contact />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "about/",
        children: [
          {
            path: "edit/",
            element: (
              <ViewRoutes moduleKey="about">
                <EditAbout />
              </ViewRoutes>
            )
          },
          {
            path: "",
            element: (
              <ViewRoutes moduleKey="about">
                <About />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "roles/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="roleManagement">
                <CreateNewRole />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="roleManagement">
                <ShowAllRole />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "backendusers/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="userManagement">
                <CreateNewBackendUser />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="userManagement">
                <ShowAllBackendUser />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "users/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="userManagement">
                <CreateNewUser />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="userManagement">
                <ShowAllUser />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "site/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="siteManagement">
                <CreateNewSite />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="siteManagement">
                <ShowAllSite />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "build/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="buildingManagement">
                <CreateNewBuilding />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="buildingManagement">
                <ShowAllBuilding />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "checklist/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="checklistManagement">
                <CreateNewChecklist />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="checklistManagement">
                <ShowAllChecklist />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "activity/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="activityManagement">
                <CreateNewActivity />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="activityManagement">
                <ShowAllActivity />
              </ViewRoutes>
            )
          }
        ]
      },
      {
        path: "items_Material/",
        children: [
          {
            path: "create/",
            element: (
              <ViewRoutes moduleKey="itemsMaterialManagement">
                <CreateNewItemsMaterial />
              </ViewRoutes>
            )
          },
          {
            path: "all/",
            element: (
              <ViewRoutes moduleKey="itemsMaterialManagement">
                <ShowAllItemsMaterial />
              </ViewRoutes>
            )
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

export default router;
