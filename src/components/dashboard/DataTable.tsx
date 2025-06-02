
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: any[];
}

export function DataTable({ data }: DataTableProps) {
  const getStatusBadge = (temperature: number, humidity: number) => {
    if (temperature >= 20 && temperature <= 30 && humidity >= 50 && humidity <= 70) {
      return <Badge className="bg-green-100 text-green-800">Ideal</Badge>;
    } else if (temperature >= 15 && temperature <= 35 && humidity >= 40 && humidity <= 80) {
      return <Badge className="bg-yellow-100 text-yellow-800">Aceitável</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Atenção</Badge>;
    }
  };

  return (
    <div className="rounded-lg border border-soy-green-200 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="bg-soy-green-50 sticky top-0">
            <TableRow>
              <TableHead className="text-soy-green-800 font-semibold">Horário</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Temp. (°C)</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Umid. Ar (%)</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Umid. Solo (%)</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Iluminância (lux)</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Fotoperíodo (h)</TableHead>
              <TableHead className="text-soy-green-800 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(-10).reverse().map((row, index) => (
              <TableRow 
                key={row.id} 
                className={index % 2 === 0 ? "bg-white" : "bg-soy-green-25"}
              >
                <TableCell className="font-medium text-soy-green-700">
                  {new Date(row.timestamp).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-soy-green-600">
                  {row.temperature.toFixed(1)}
                </TableCell>
                <TableCell className="text-soy-green-600">
                  {row.airHumidity.toFixed(1)}
                </TableCell>
                <TableCell className="text-soy-green-600">
                  {row.soilHumidity.toFixed(1)}
                </TableCell>
                <TableCell className="text-soy-green-600">
                  {row.illuminance.toFixed(0)}
                </TableCell>
                <TableCell className="text-soy-green-600">
                  {row.photoperiod.toFixed(1)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(row.temperature, row.airHumidity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
