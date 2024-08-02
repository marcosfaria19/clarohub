import React, { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import { jwtDecode } from "jwt-decode";
import SublinkModal from "../components/SublinkModal";
import axiosInstance from "../../../services/axios";

const Home = () => {
  const [groupedApps, setGroupedApps] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/apps`)
      .then((response) => {
        const appsData = response.data;
        const filteredApps = filterAppsByPermissions(appsData);
        const groupedApps = groupAppsByFamily(filteredApps);
        setGroupedApps(groupedApps);

        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
      })
      .catch((error) => console.error("Erro ao buscar aplicativos:", error));
  }, []);

  const handleFavoriteClick = (app) => {
    const updatedFavorites = [...favorites];
    const appIndex = updatedFavorites.findIndex((fav) => fav._id === app._id);

    if (appIndex > -1) {
      updatedFavorites.splice(appIndex, 1);
    } else {
      updatedFavorites.push(app);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const filterAppsByPermissions = (apps) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return [];
    }
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
    const userAccessLevel = decodedToken.PERMISSOES || "";

    const accessHierarchy = {
      guest: ["guest"],
      basic: ["guest", "basic"],
      manager: ["guest", "basic", "manager"],
      admin: ["guest", "basic", "manager", "admin"],
    };

    const accessibleFamilies = accessHierarchy[userAccessLevel] || [];

    return apps.filter((app) => accessibleFamilies.includes(app.acesso));
  };

  const groupAppsByFamily = (apps) => {
    return apps.reduce((groups, app) => {
      const family = app.familia;
      if (!groups[family]) {
        groups[family] = [];
      }
      groups[family].push(app);
      return groups;
    }, {});
  };

  const handleCardClick = (app) => {
    if (["Atlas", "Visium", "Nuvem"].includes(app.nome)) {
      setSelectedApp(app);
      setShowModal(true);
    } else {
      window.open(app.rota, "_blank");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const desiredOrder = [
    "Projetos",
    "Plataformas",
    "PowerApps",
    "SharePoint",
    "Gestão",
  ];

  return (
    <div className="px-72 py-12 bg-dark">
      <h2 className="mb-12 text-3xl font-semibold text-white select-none">
        Meus Aplicativos
      </h2>

      {favorites.length > 0 && (
        <div className="family-section mb-12">
          <h2 className="family-title text-2xl mb-5 text-white font-semibold select-none">
            Favoritos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {favorites.map((app) => (
              <div key={app._id} className="col">
                <AppCard
                  nome={app.nome}
                  imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                  logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                  rota={app.rota}
                  isFavorite={favorites.some((fav) => fav._id === app._id)}
                  onFavoriteClick={() => handleFavoriteClick(app)}
                  onCardClick={() => handleCardClick(app)}
                />
              </div>
            ))}
          </div>
          <hr className="border-solid border-neutral-500 mt-8" />
        </div>
      )}

      {desiredOrder.map(
        (family) =>
          groupedApps[family] && (
            <div key={family} className="family-section mb-12">
              <h2 className="family-title text-2xl mb-8 text-white font-semibold select-none">
                {family}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {groupedApps[family]?.map((app) => (
                  <div key={app._id} className="col">
                    <AppCard
                      nome={app.nome}
                      imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                      logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                      rota={app.rota}
                      isFavorite={favorites.some((fav) => fav._id === app._id)}
                      onFavoriteClick={() => handleFavoriteClick(app)}
                      onCardClick={() => handleCardClick(app)}
                    />
                  </div>
                ))}
              </div>
              <hr className="border-solid border-neutral-500 mt-8" />
            </div>
          )
      )}

      <SublinkModal
        show={showModal}
        handleClose={handleModalClose}
        selectedApp={selectedApp}
      />
    </div>
  );
};

export default Home;
