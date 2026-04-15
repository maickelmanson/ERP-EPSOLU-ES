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
import { Plus, Edit2, Trash2, Printer } from "lucide-react";
import { toast } from "sonner";

export default function EquipmentList() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    clientId: 0,
    serialNumber: "",
    brand: "",
    model: "",
    equipmentType: "IMPRESSORA",
    color: "",
    warranty: "",
    isWarrantyReturn: false,
    budgetDueDate: "",
    notes: "",
  });

  const { data: equipment = [], isLoading, refetch } = trpc.equipment.list.useQuery({
    clientId: selectedClientId || undefined,
  });
  const { data: clients = [] } = trpc.clients.list.useQuery();
  const createMutation = trpc.equipment.create.useMutation();

  const handleOpenDialog = (equip?: any) => {
    if (equip) {
      setEditingId(equip.id);
      setFormData({
        clientId: equip.clientId || 0,
        serialNumber: equip.serialNumber || "",
        brand: equip.brand || "",
        model: equip.model || "",
        equipmentType: equip.equipmentType || "IMPRESSORA",
        color: equip.color || "",
        warranty: equip.warranty || "",
        isWarrantyReturn: equip.isWarrantyReturn || false,
        budgetDueDate: equip.budgetDueDate ? new Date(equip.budgetDueDate).toISOString().split('T')[0] : "",
        notes: equip.notes || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        clientId: 0,
        serialNumber: "",
        brand: "",
        model: "",
        equipmentType: "IMPRESSORA",
        color: "",
        warranty: "",
        isWarrantyReturn: false,
        budgetDueDate: "",
        notes: "",
      });
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      toast.error("Cliente é obrigatório");
      return;
    }

    if (!formData.brand.trim()) {
      toast.error("Marca é obrigatória");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        budgetDueDate: formData.budgetDueDate ? new Date(formData.budgetDueDate) : undefined,
      });
      toast.success(editingId ? "Equipamento atualizado com sucesso" : "Equipamento criado com sucesso");
      setOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar equipamento");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const EquipmentTable = ({ equipment }: { equipment: any[] }) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (equipment.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Nenhum equipamento cadastrado. Clique em "Novo Equipamento" para começar.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Marca</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Modelo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Série</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Garantia</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((equip: any) => (
              <tr key={equip.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{equip.brand}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{equip.model}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{equip.serialNumber || "-"}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{equip.equipmentType || "IMPRESSORA"}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{equip.color || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{equip.warranty || "-"}</td>
                <td className="px-4 py-3">
                  {equip.isWarrantyReturn ? (
                    <Badge className="bg-red-100 text-red-800">Garantia</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Normal</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(equip)}
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
            <h1 className="text-3xl font-bold text-gray-900">Equipamentos</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os equipamentos cadastrados</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4" />
                Novo Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Equipamento" : "Novo Equipamento"}</DialogTitle>
                <DialogDescription>
                  Preencha os dados do equipamento abaixo
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cliente */}
                <div>
                  <Label htmlFor="clientId">Cliente *</Label>
                  <Select value={String(formData.clientId)} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client: any) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marca e Modelo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Ex: HP, Canon, Xerox"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="Ex: LaserJet Pro M404n"
                    />
                  </div>
                </div>

                {/* Série e Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serialNumber">Número de Série</Label>
                    <Input
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      placeholder="Número de série do equipamento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipmentType">Tipo de Equipamento</Label>
                    <Select value={formData.equipmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IMPRESSORA">Impressora</SelectItem>
                        <SelectItem value="MULTIFUNCIONAL">Multifuncional</SelectItem>
                        <SelectItem value="COPIADORA">Copiadora</SelectItem>
                        <SelectItem value="SCANNER">Scanner</SelectItem>
                        <SelectItem value="OUTRO">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cor e Garantia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="Ex: Branco, Preto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty">Garantia</Label>
                    <Input
                      id="warranty"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      placeholder="Ex: 12 meses"
                    />
                  </div>
                </div>

                {/* Data de Vencimento do Orçamento */}
                <div>
                  <Label htmlFor="budgetDueDate">Data de Vencimento do Orçamento</Label>
                  <Input
                    id="budgetDueDate"
                    name="budgetDueDate"
                    type="date"
                    value={formData.budgetDueDate}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Checkbox Garantia */}
                <div className="flex items-center gap-2">
                  <input
                    id="isWarrantyReturn"
                    name="isWarrantyReturn"
                    type="checkbox"
                    checked={formData.isWarrantyReturn}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <Label htmlFor="isWarrantyReturn" className="cursor-pointer">
                    Este é um retorno de garantia
                  </Label>
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

        {/* Filtro por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={String(selectedClientId || "")} onValueChange={(value) => setSelectedClientId(value ? parseInt(value) : null)}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os clientes</SelectItem>
                {clients.map((client: any) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Equipamentos</CardTitle>
            <CardDescription>
              Total de {equipment.length} equipamento{equipment.length !== 1 ? "s" : ""} cadastrado{equipment.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EquipmentTable equipment={equipment} />
          </CardContent>
        </Card>
      </div>
    </ERPDashboardLayout>
  );
}
