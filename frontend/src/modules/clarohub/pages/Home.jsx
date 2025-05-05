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
import { Input } from "modules/shared/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

const Home = () => {
  const [groupedApps, setGroupedApps] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allApps, setAllApps] = useState([]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/apps`)
      .then((response) => {
        const appsData = response.data;
        const filteredApps = filterAppsByPermissions(appsData);
        const grouped = groupAppsByFamily(filteredApps);
        setGroupedApps(grouped);
        setAllApps(filteredApps);

        const savedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
      })
      .catch((error) => console.error("Erro ao buscar aplicativos:", error))
      .finally(() => {
        setIsLoading(false);
      });
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

  const normalize = (text) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const filterAppsBySearch = (apps) => {
    if (!searchTerm) return apps;

    const term = normalize(searchTerm);
    return apps.filter((app) =>
      normalize(`${app.nome} ${app.info}`).includes(term),
    );
  };

  const handleCardClick = (app) => {
    if (["Atlas", "Visium", "Nuvem", "Consultar SLA"].includes(app.nome)) {
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
    "Central do Colaborador",
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
          <AnimatePresence mode="popLayout">
            {apps.map((app) => (
              <CarouselItem
                key={app._id}
                className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                >
                  <AppCard
                    nome={app.nome}
                    info={app.info}
                    imagemUrl={`${process.env.REACT_APP_BACKEND_URL}${app.imagemUrl}`}
                    logoCard={`${process.env.REACT_APP_BACKEND_URL}${app.logoCard}`}
                    rota={app.rota}
                    isFavorite={favorites.some((fav) => fav._id === app._id)}
                    onFavoriteClick={() => handleFavoriteClick(app)}
                    onCardClick={() => handleCardClick(app)}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </AnimatePresence>
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

    const filteredAllApps = filterAppsBySearch(allApps);
    const filteredFavorites = filterAppsBySearch(favorites);
    const hasResults =
      filteredAllApps.length > 0 || filteredFavorites.length > 0;
    const nothingFound = searchTerm && !hasResults;

    if (searchTerm && filteredAllApps.length > 0) {
      return (
        <>
          <div className="mb-8 md:mb-10">
            {renderSectionTitle("Resultados da Busca", filteredAllApps.length)}
            {renderCarousel(filteredAllApps)}
          </div>

          <AnimatePresence>
            {nothingFound && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                <Search className="h-10 w-10" />
                <p>Nenhum aplicativo encontrado para "{searchTerm}"</p>
                <p className="text-sm">Tente outros termos de busca</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    }

    return (
      <>
        {filteredFavorites.length > 0 && (
          <div className="mb-8 md:mb-10">
            {renderSectionTitle("Favoritos", filteredFavorites.length)}
            {renderCarousel(filteredFavorites)}
          </div>
        )}

        {desiredOrder.map((family) => {
          const familyApps = groupedApps[family];
          const filteredFamilyApps = filterAppsBySearch(familyApps || []);
          return (
            filteredFamilyApps.length > 0 && (
              <div key={family} className="mb-8 md:mb-10">
                {renderSectionTitle(family, filteredFamilyApps.length)}
                {renderCarousel(filteredFamilyApps)}
              </div>
            )
          );
        })}

        <AnimatePresence>
          {nothingFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center justify-center gap-2 text-muted-foreground"
            >
              <Search className="h-10 w-10" />
              <p>Nenhum aplicativo encontrado para "{searchTerm}"</p>
              <p className="text-sm">Tente outros termos de busca</p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <Container className="px-0 sm:px-4">
      <h1 className="mb-6 select-none px-4 text-2xl font-semibold text-foreground sm:px-0 sm:text-3xl md:mb-4">
        Meus Aplicativos
      </h1>

      <div className="mb-6 px-4 sm:px-0">
        <div className="relative max-w-[300px]">
          <Input
            type="text"
            placeholder="Buscar aplicativos..."
            value={searchTerm}
            maxLength={20}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

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
