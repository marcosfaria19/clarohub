import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { FiMapPin, FiGlobe, FiHome, FiUser } from "react-icons/fi";
import { Badge } from "modules/shared/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";

import { Button } from "modules/shared/components/ui/button";
import { Separator } from "modules/shared/components/ui/separator";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";

export function TaskCard({ task }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="group rounded-lg border-border bg-background shadow-sm transition-all hover:cursor-pointer hover:bg-accent/40 hover:opacity-80"
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base font-semibold">
            <span>#{task.IDDEMANDA}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            {/* Localização */}
            <div className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-destructive" />
              <div>
                <span className="font-medium text-foreground">
                  {task.CIDADE}
                </span>
                <span className="mx-1 text-muted-foreground">/</span>
                <span className="font-medium text-foreground">{task.UF}</span>
              </div>
            </div>

            {/* Regional e Base */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FiGlobe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Regional:</span>
                <span className="font-medium text-foreground">
                  {task.REGIONAL}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FiHome className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Base:</span>
                <span className="font-medium text-foreground">{task.BASE}</span>
              </div>
            </div>

            {/* Endereço com truncagem eficiente */}
            <div className="text-sm">
              <p
                className="line-clamp-1 text-muted-foreground"
                title={task.ENDERECO_VISTORIA}
              >
                {task.ENDERECO_VISTORIA}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card-spark text-foreground sm:max-w-2xl">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                Demanda #{task.IDDEMANDA}
              </DialogTitle>
              <Badge className="gap-2 py-1">{task.status.name}</Badge>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60dvh] pr-4">
            <div className="space-y-6">
              {/* Seção Principal */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      LOCALIZAÇÃO
                    </h4>
                    <div className="flex items-center gap-3 text-foreground">
                      <FiMapPin className="h-5 w-5 text-destructive" />
                      <span className="font-medium">
                        {task.CIDADE} / {task.UF}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      ENDEREÇO
                    </h4>
                    <p className="font-medium text-foreground">
                      {task.ENDERECO_VISTORIA}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      DETALHES
                    </h4>
                    <dl className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <dt className="text-sm text-muted-foreground">
                          Regional
                        </dt>
                        <dd className="font-medium">{task.REGIONAL}</dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-sm text-muted-foreground">Base</dt>
                        <dd className="font-medium">{task.BASE}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Histórico */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Histórico de Alterações
                </h3>
                <div className="space-y-4">
                  {task.history?.map((entry, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-0 top-3 h-full w-6">
                        <div className="h-3 w-3 rounded-full bg-primary/20">
                          <div className="h-1.5 w-1.5 translate-x-0.5 translate-y-0.5 rounded-full bg-primary" />
                        </div>
                        {index < task.history.length - 1 && (
                          <div className="absolute -bottom-2 left-[5px] top-4 w-px bg-border" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className="gap-2">
                            {entry.newStatus.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.changedAt)}
                          </span>
                        </div>

                        <p className="text-sm text-foreground">{entry.obs}</p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FiUser className="h-4 w-4" />
                          <span>{entry.user.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="sm:flex sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="mt-4 sm:mt-0"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
