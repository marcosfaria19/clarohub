import React, { useState, useEffect } from "react";
import AppCard from "modules/clarohub/components/AppCard";
import { jwtDecode } from "jwt-decode";
import SublinkModal from "modules/clarohub/components/SublinkModal";
import axiosInstance from "services/axios";
import Container from "modules/shared/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "modules/shared/components/ui/carousel";
import { useMediaQuery } from "modules/shared/hooks/use-media-query";
import { Skeleton } from "modules/shared/components/ui/skeleton";

const Home = () => {
  const [groupedApps, setGroupedApps] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    setIsLoading(true);
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
      .catch((error) => console.error("Erro ao buscar aplicativos:", error))
      .finally(() => setIsLoading(false));
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

  const renderCarousel = (apps) => {
    const cardsPerView = isMobile ? 1 : isTablet ? 3 : 5;
    const showArrows = apps.length > cardsPerView;

    return (
      <Carousel
        opts={{
          align: "start",
          loop: false,
          skipSnaps: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {apps.map((app) => (
            <CarouselItem
              key={app._id}
              className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
            >
              <AppCard
                nome={app.nome}
                imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                rota={app.rota}
                isFavorite={favorites.some((fav) => fav._id === app._id)}
                onFavoriteClick={() => handleFavoriteClick(app)}
                onCardClick={() => handleCardClick(app)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && (
          <>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </>
        )}
      </Carousel>
    );
  };

  const renderSectionTitle = (title, count) => (
    <div className="relative mb-4 flex items-center px-4 sm:px-0">
      <h2 className="family-title mr-4 select-none text-xl font-semibold text-foreground sm:text-2xl">
        {title} <span className="text-lg text-foreground/40">({count})</span>
      </h2>
      <div className="h-px flex-grow bg-gradient-to-r from-foreground/20 to-foreground/0"></div>
    </div>
  );

  const renderSkeletonCarousel = () => {
    const cardsPerView = isMobile ? 1 : isTablet ? 1 : 1;
    return (
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {Array.from({ length: cardsPerView }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
            >
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {desiredOrder.map((family) => (
            <div key={family} className="mb-8 md:mb-10">
              {renderSectionTitle(family, 0)}
              {renderSkeletonCarousel()}
            </div>
          ))}
        </>
      );
    }

    return (
      <>
        {favorites.length > 0 && (
          <div className="mb-8 md:mb-10">
            {renderSectionTitle("Favoritos", favorites.length)}
            {renderCarousel(favorites)}
          </div>
        )}

        {desiredOrder.map(
          (family) =>
            groupedApps[family] && (
              <div key={family} className="mb-8 md:mb-10">
                {renderSectionTitle(family, groupedApps[family].length)}
                {renderCarousel(groupedApps[family])}
              </div>
            ),
        )}
      </>
    );
  };

  return (
    <Container className="px-0 sm:px-4">
      <h1 className="mb-6 select-none px-4 text-2xl font-semibold text-foreground sm:px-0 sm:text-3xl md:mb-8 lg:mb-10">
        Meus Aplicativos
      </h1>

      {renderContent()}

      <SublinkModal
        show={showModal}
        handleClose={handleModalClose}
        selectedApp={selectedApp}
      />
    </Container>
  );
};

export default Home;
