import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ERPDashboardLayout from "@/components/ERPDashboardLayout";
import { Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  AGUARDANDO: "bg-gray-100 text-gray-800",
  EM_CHECKLIST: "bg-blue-100 text-blue-800",
  ORCAMENTO_ENCAMINHADO: "bg-purple-100 text-purple-800",
  APROVADO: "bg-green-100 text-green-800",
  AGUARDANDO_PECA: "bg-orange-100 text-orange-800",
  EM_ANDAMENTO: "bg-cyan-100 text-cyan-800",
  EM_TESTES: "bg-indigo-100 text-indigo-800",
  FINALIZACAO: "bg-yellow-100 text-yellow-800",
  PRONTA: "bg-lime-100 text-lime-800",
  ENTREGUE: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  AGUARDANDO: "Aguardando",
  EM_CHECKLIST: "Em Checklist",
  ORCAMENTO_ENCAMINHADO: "Orçamento Encaminhado",
  APROVADO: "Aprovado",
  AGUARDANDO_PECA: "Aguardando Peça",
  EM_ANDAMENTO: "Em Andamento",
  EM_TESTES: "Em Testes",
  FINALIZACAO: "Finalização",
  PRONTA: "Pronta",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export default function ServiceOrderList() {
  const [selectedTab, setSelectedTab] = useState("active");
  const { data: allOrders = [], isLoading } = trpc.serviceOrders.list.useQuery();
  const changeStatusMutation = trpc.serviceOrders.changeStatus.useMutation();

  const filterOrders = (status?: string) => {
    if (!status) return allOrders;
    return allOrders.filter((order: any) => order.status === status);
  };

  const activeOrders = filterOrders("EM_ANDAMENTO");
  const pendingOrders = filterOrders("AGUARDANDO");
  const approvedOrders = filterOrders("APROVADO");

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await changeStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const OrderTable = ({ orders }: { orders: any[] }) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Nenhuma ordem de serviço encontrada
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">OS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Equipamento</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prioridade</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.clientId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.equipmentId}
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.priorityScore}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={changeStatusMutation.isPending}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(statusLabels).map(([status, label]) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ERPDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as ordens de serviço</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Ordem
          </Button>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço</CardTitle>
            <CardDescription>
              Visualize e gerencie ordens de serviço por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="active">
                  Fila Ativa ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Aguardando ({pendingOrders.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Aprovadas ({approvedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todas ({allOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                <OrderTable orders={activeOrders} />
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <OrderTable orders={pendingOrders} />
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                <OrderTable orders={approvedOrders} />
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <OrderTable orders={allOrders} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ERPDashboardLayout>
  );
}
