import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, Clock, CheckCircle } from "lucide-react";
import ERPDashboardLayout from "@/components/ERPDashboardLayout";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto">
              EP
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EPSOLUÇÕES</h1>
          <p className="text-xl text-gray-600 mb-8">Sistema de Gestão de Ordens de Serviço</p>
          <p className="text-gray-500 mb-4">Faça login para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <ERPDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Clientes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-blue-600">{stats?.totalClients || 0}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Total de clientes</p>
            </CardContent>
          </Card>

          {/* Fila Ativa */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fila Ativa</CardTitle>
              <FileText className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-amber-500">{stats?.totalOrders || 0}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Ordens aguardando</p>
            </CardContent>
          </Card>

          {/* Em Andamento */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-orange-500">{stats?.activeOrders || 0}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Ordens em processamento</p>
            </CardContent>
          </Card>

          {/* Concluídas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Ordens entregues</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao EPSOLUÇÕES ERP</CardTitle>
            <CardDescription>
              Sistema de Gestão de Ordens de Serviço para Assistência Técnica e Locação de Impressoras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Use o menu lateral para navegar entre as funcionalidades do sistema:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  <strong>Dashboard:</strong> Visualize estatísticas e resumos do sistema
                </li>
                <li>
                  <strong>Clientes:</strong> Gerencie informações de clientes PF e PJ
                </li>
                <li>
                  <strong>Ordens de Serviço:</strong> Crie, edite e acompanhe ordens de serviço
                </li>
                <li>
                  <strong>Equipamentos:</strong> Registre equipamentos e seus dados técnicos
                </li>
                <li>
                  <strong>Buscar:</strong> Pesquise por clientes, equipamentos ou ordens
                </li>
                <li>
                  <strong>Log de Exclusões:</strong> Acompanhe registros de exclusões do sistema
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPDashboardLayout>
  );
}
