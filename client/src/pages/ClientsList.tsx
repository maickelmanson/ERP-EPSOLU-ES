import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ERPDashboardLayout from "@/components/ERPDashboardLayout";
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ClientsList() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    clientType: "PF" as "PF" | "PJ",
    cpfCnpj: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const { data: clients = [], isLoading, refetch } = trpc.clients.list.useQuery();
  const createMutation = trpc.clients.create.useMutation();

  const handleOpenDialog = (client?: any) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        name: client.name || "",
        clientType: client.clientType || "PF",
        cpfCnpj: client.cpfCnpj || "",
        phone: client.phone || "",
        email: client.email || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        notes: client.notes || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        clientType: "PF",
        cpfCnpj: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        notes: "",
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success(editingId ? "Cliente atualizado com sucesso" : "Cliente criado com sucesso");
      setOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar cliente");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ClientTable = ({ clients }: { clients: any[] }) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (clients.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CPF/CNPJ</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cidade</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-4 py-3">
                  <Badge variant={client.clientType === "PF" ? "default" : "secondary"}>
                    {client.clientType}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{client.cpfCnpj || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {client.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-blue-600" />
                      {client.phone}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {client.email ? (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-green-600" />
                      {client.email}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{client.city || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(client)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os clientes cadastrados</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente abaixo
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome e Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome completo ou razão social"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientType">Tipo *</Label>
                    <Select value={formData.clientType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, clientType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                        <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* CPF/CNPJ e Telefone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input
                      id="cpfCnpj"
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Email e CEP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="cliente@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Observações adicionais..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clientes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Total de {clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado{clients.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientTable clients={clients} />
          </CardContent>
        </Card>
      </div>
    </ERPDashboardLayout>
  );
}
