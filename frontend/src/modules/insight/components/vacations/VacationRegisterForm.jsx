import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "modules/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "modules/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "modules/shared/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "modules/shared/components/ui/radio-group";
import { Button } from "modules/shared/components/ui/button";
import { Textarea } from "modules/shared/components/ui/textarea";
import { Calendar } from "modules/shared/components/ui/calendar";
import { CalendarIcon, PlusIcon, AlertCircle } from "lucide-react";
import { cn } from "modules/shared/lib/utils";
import { useForm } from "react-hook-form";
import { useUsers } from "modules/claroflow/hooks/useUsers";
import { capitalizeFirstLetters } from "modules/shared/utils/formatUsername";

const VacationRegisterForm = React.memo(
  ({
    trigger,
    className = "",
    onSuccess,
    scheduleVacation,
    updateVacation,
    loading: externalLoading,
    vacations,
    initialData,
    isEditMode = false,
    onCancel,
  }) => {
    const { users, loading: usersLoading } = useUsers();
    const validUsers = users.filter(
      (u) =>
        u.GESTOR !== "ELVIS CLEBER ALVES DA SILVA" &&
        u.GESTOR !== "RODRIGO JOSE RODRIGUES GIL",
    );

    const [open, setOpen] = useState(isEditMode || false);
    const [localLoading, setLocalLoading] = useState(false);
    const [hasOverlap, setHasOverlap] = useState(false);
    const [vacationDays, setVacationDays] = useState(0);

    const loading = Boolean(externalLoading) || localLoading || usersLoading;

    const form = useForm({
      defaultValues: {
        employeeId: initialData?.employeeId || undefined,
        dateRange: initialData
          ? {
              from: new Date(initialData.startDate),
              to: new Date(initialData.endDate),
            }
          : undefined,
        reason: initialData?.reason || "",
        type: initialData?.type || "vacation",
      },
    });

    const watchEmployeeId = form.watch("employeeId");
    const watchDateRange = form.watch("dateRange");
    const watchStartDate = watchDateRange?.from;
    const watchEndDate = watchDateRange?.to;

    const formatDate = useCallback((date) => {
      return date?.toLocaleDateString("pt-BR") || "";
    }, []);

    const checkVacationOverlap = useCallback(
      (employeeId, startDate, endDate) => {
        if (!employeeId || !startDate || !endDate || !vacations) return false;

        return vacations.some(
          (vacation) =>
            vacation.employeeId === employeeId &&
            vacation._id !== initialData?._id &&
            startDate <= new Date(vacation.endDate) &&
            endDate >= new Date(vacation.startDate),
        );
      },
      [vacations, initialData],
    );

    const calculateVacationDays = useCallback((startDate, endDate) => {
      if (!startDate || !endDate) return 0;
      const oneDay = 24 * 60 * 60 * 1000;
      return Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    }, []);

    useEffect(() => {
      if (watchEmployeeId && watchStartDate && watchEndDate) {
        const hasConflict = checkVacationOverlap(
          watchEmployeeId,
          watchStartDate,
          watchEndDate,
        );
        setHasOverlap(hasConflict);
        setVacationDays(calculateVacationDays(watchStartDate, watchEndDate));
      } else {
        setHasOverlap(false);
        setVacationDays(0);
      }
    }, [
      watchEmployeeId,
      watchStartDate,
      watchEndDate,
      checkVacationOverlap,
      calculateVacationDays,
    ]);

    useEffect(() => {
      if (isEditMode && initialData) {
        form.reset({
          employeeId: initialData.userId,
          dateRange: {
            from: new Date(initialData.startDate),
            to: new Date(initialData.endDate),
          },
          reason: initialData.reason || "",
          type: initialData.type || "vacation",
        });
      }
    }, [isEditMode, initialData, form]);

    useEffect(() => {
      if (isEditMode) {
        setOpen(true);
      }
    }, [isEditMode]);

    const validateForm = useCallback((values) => {
      if (!values.employeeId) {
        return {
          field: "employeeId",
          message: "Por favor selecione um colaborador",
        };
      }

      const startDate = values.dateRange?.from;
      const endDate = values.dateRange?.to;

      if (!startDate) {
        return {
          field: "dateRange",
          message: "Por favor selecione um intervalo de datas",
        };
      }

      if (!endDate) {
        return {
          field: "dateRange",
          message: "Por favor selecione a data final do intervalo",
        };
      }

      if (endDate < startDate) {
        return {
          field: "dateRange",
          message: "A data final deve ser igual ou posterior à data inicial",
        };
      }

      return null;
    }, []);

    const onSubmit = useCallback(
      async (values) => {
        setLocalLoading(true);

        const validationError = validateForm(values);
        if (validationError) {
          form.setError(validationError.field, {
            type: "manual",
            message: validationError.message,
          });
          setLocalLoading(false);
          return;
        }

        if (hasOverlap) {
          form.setError("dateRange", {
            type: "manual",
            message: "Este período se sobrepõe a férias já agendadas",
          });
          setLocalLoading(false);
          return;
        }

        try {
          const employee = validUsers.find((e) => e._id === values.employeeId);
          if (!employee) {
            throw new Error("Colaborador não encontrado");
          }

          const payload = {
            startDate: values.dateRange.from,
            endDate: values.dateRange.to,
            reason: values.reason,
            type: values.type,
          };

          if (isEditMode && initialData) {
            await updateVacation(initialData._id, payload);
          } else {
            await scheduleVacation({
              ...payload,
              employeeId: values.employeeId,
              employee: employee.NOME,
              gestor: employee.GESTOR,
              login: employee.LOGIN,
              permissoes: employee.PERMISSOES,
              project: employee.project,
            });
          }

          form.reset();
          setOpen(false);
          onSuccess?.();
        } catch (error) {
          form.setError("root", {
            type: "manual",
            message:
              error.message || "Ocorreu um erro ao processar sua solicitação",
          });
        } finally {
          setLocalLoading(false);
        }
      },
      [
        form,
        validUsers,
        hasOverlap,
        scheduleVacation,
        updateVacation,
        onSuccess,
        isEditMode,
        initialData,
        validateForm,
      ],
    );

    const handleOpenChange = useCallback(
      (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
          setHasOverlap(false);
          setVacationDays(0);
          if (isEditMode) {
            onCancel?.();
          }
        }
      },
      [form, onCancel, isEditMode],
    );

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {!isEditMode && (
          <DialogTrigger asChild>
            {trigger || (
              <Button className={className} size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Agendar Férias
              </Button>
            )}
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Férias" : "Agendar Novas Férias"}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes para agendar férias ou folga para um membro
              da equipe.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um colaborador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...validUsers]
                          .sort((a, b) => a.NOME.localeCompare(b.NOME))
                          .filter(
                            (employee) =>
                              employee._id && employee._id.trim() !== "",
                          )
                          .map((employee) => (
                            <SelectItem key={employee._id} value={employee._id}>
                              {capitalizeFirstLetters(employee.NOME)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="vacation" />
                          </FormControl>
                          <FormLabel className="font-normal">Férias</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="dayoff" />
                          </FormControl>
                          <FormLabel className="font-normal">Folga</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Período</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value?.from && "text-muted-foreground",
                            )}
                          >
                            {field.value?.from ? (
                              field.value.to ? (
                                `${formatDate(field.value.from)} - ${formatDate(field.value.to)}`
                              ) : (
                                formatDate(field.value.from)
                              )
                            ) : (
                              <span>Selecione o intervalo</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={() => false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {vacationDays > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Período selecionado:{" "}
                  <span className="font-medium">{vacationDays} dias</span>
                </motion.div>
              )}

              <AnimatePresence>
                {hasOverlap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-md bg-destructive/15 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">
                          Conflito de agendamento
                        </p>
                        <p className="text-sm text-destructive/80">
                          Este período se sobrepõe a férias já agendadas para
                          este colaborador. Por favor, selecione um período
                          diferente.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione observações (opcional)"
                        className="resize-none"
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="rounded-md bg-destructive/15 p-3">
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleOpenChange(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || hasOverlap}>
                  {loading
                    ? "Enviando..."
                    : isEditMode
                      ? "Atualizar"
                      : "Agendar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

export default VacationRegisterForm;
