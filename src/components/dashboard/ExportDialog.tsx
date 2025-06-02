
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ExportDialogProps {
  data: any[];
}

export function ExportDialog({ data }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });

  const handleExport = () => {
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return (!dateRange.from || itemDate >= dateRange.from) && 
             (!dateRange.to || itemDate <= dateRange.to);
    });

    if (exportFormat === "csv") {
      exportToCSV(filteredData);
    } else {
      exportToJSON(filteredData);
    }

    toast({
      title: "Dados exportados!",
      description: `${filteredData.length} registros exportados em formato ${exportFormat.toUpperCase()}`,
    });
  };

  const exportToCSV = (data: any[]) => {
    const headers = ["Data/Hora", "Temperatura (°C)", "Umidade Ar (%)", "Umidade Solo (%)", "Iluminância (lux)", "Fotoperíodo (h)"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        new Date(row.timestamp).toLocaleString('pt-BR'),
        row.temperature.toFixed(1),
        row.airHumidity.toFixed(1),
        row.soilHumidity.toFixed(1),
        row.illuminance.toFixed(0),
        row.photoperiod.toFixed(1)
      ].join(","))
    ].join("\n");

    downloadFile(csvContent, "dados_cultivo_soja.csv", "text/csv");
  };

  const exportToJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, "dados_cultivo_soja.json", "application/json");
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-soy-green-600 hover:bg-soy-green-700 text-white">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-soy-green-800">Exportar Dados</DialogTitle>
          <DialogDescription>
            Configure as opções de exportação dos dados de cultivo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-soy-green-700 font-medium">Formato</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV (Excel compatível)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-soy-green-700 font-medium">Período</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "dd/MM/yyyy")
                    ) : (
                      "Data inicial"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "dd/MM/yyyy")
                    ) : (
                      "Data final"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleExport}
            className="bg-soy-green-600 hover:bg-soy-green-700 text-white"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
