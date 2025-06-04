import { useUsers } from "../hooks/useUsers";
import bg from "../assets/bg-curves.png";
import { Avatar, AvatarImage } from "modules/shared/components/ui/avatar";
import { useTheme } from "modules/shared/contexts/ThemeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { formatUserName } from "modules/shared/utils/formatUsername";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Badge } from "modules/shared/components/ui/badge";
import { useMemo } from "react";

export function FlowHome({ project }) {
  const { getUsersByProjectId, loading, error } = useUsers();
  const projectUsers = useMemo(
    () => (project ? getUsersByProjectId(project._id) : []),
    [project, getUsersByProjectId],
  );

  const { theme } = useTheme();

  return (
    <div className="relative flex min-h-[75vh] w-full select-none flex-col overflow-hidden bg-card bg-cover bg-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${bg})`,
          opacity: theme === "light" ? 0.8 : 0.03,
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        {/* Pulse do logo */}
        <div className="duration-[2000] absolute top-[25%] z-10 h-40 w-40 animate-pulse rounded-full bg-primary/40 blur-3xl sm:h-60 sm:w-60" />

        {/* Logo  */}
        <div className="relative z-20 mb-6 transform transition-all duration-700 hover:scale-110">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl" />
          <img
            src="icons/flow.png"
            alt="Claro Flow"
            className="hover:drop-shadow-3xl relative h-24 w-24 drop-shadow-2xl transition-all duration-500 sm:h-32 sm:w-32 md:h-40 md:w-40"
          />
        </div>

        {/* Título e subtítulo */}
        <div className="relative z-20 mb-6 max-w-4xl space-y-4">
          <h1 className="bg-gradient-to-r from-foreground/60 via-primary to-foreground/60 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Flow
          </h1>

          <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />

          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:text-2xl">
            Acompanhamento de demandas •{" "}
            <span className="text-primary-flow font-bold">
              Equipe {project.name}
            </span>
          </p>
        </div>

        {/* Stats and Avatars Container */}
        <div className="relative z-20 flex flex-col items-center space-y-6">
          {/* Stats */}
          {project && (
            <>
              <Badge className="flex items-center justify-center space-x-2 border border-border bg-background px-4 py-2">
                <User className="text-primary-flow h-4 w-4" />
                <span className="text-sm font-medium text-foreground">
                  {projectUsers.length} Membros ativos
                </span>
              </Badge>
            </>
          )}

          {/* Avatars */}
          <div className="mt-4 flex -space-x-2">
            {loading ? (
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 animate-pulse rounded-full bg-muted sm:h-12 sm:w-12"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Erro ao carregar usuários
              </div>
            ) : (
              <>
                {[...projectUsers]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
                  .map((user, index) => (
                    <TooltipProvider key={user._id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.15,
                              ease: "easeOut",
                            }}
                          >
                            <Avatar className="h-10 w-10 border-2 border-background shadow-lg transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-xl sm:h-12 sm:w-12">
                              <AvatarImage
                                src={user.avatar || "/placeholder-avatar.png"}
                                alt={user.NOME}
                                className="object-cover"
                              />
                            </Avatar>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="bg-background/95 backdrop-blur-sm"
                        >
                          <p className="font-medium">
                            {formatUserName(user.NOME)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                {projectUsers.length > 5 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-secondary/20 font-medium text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-12 sm:w-12">
                    <span className="text-xs sm:text-sm">
                      +{projectUsers.length - 5}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
