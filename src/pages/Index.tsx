
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { DataChart } from "@/components/dashboard/DataChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { ExportDialog } from "@/components/dashboard/ExportDialog";
import { Thermometer, CloudRain } from "lucide-react";

interface SensorData {
  id: string;
  timestamp: Date;
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  illuminance: number;
  photoperiod: number;
}

const Index = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time data
  useEffect(() => {
    const generateData = (): SensorData => ({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      temperature: 20 + Math.random() * 15, // 20-35°C
      airHumidity: 40 + Math.random() * 40, // 40-80%
      soilHumidity: 30 + Math.random() * 50, // 30-80%
      illuminance: Math.random() * 100000, // 0-100000 lux
      photoperiod: 8 + Math.random() * 8, // 8-16 hours
    });

    // Initial data
    const initialData: SensorData[] = [];
    for (let i = 0; i < 24; i++) {
      const data = generateData();
      data.timestamp = new Date(Date.now() - (24 - i) * 60 * 60 * 1000);
      initialData.push(data);
    }
    setSensorData(initialData);

    // Update data every 30 seconds
    const interval = setInterval(() => {
      const newData = generateData();
      setSensorData(prev => [...prev.slice(-23), newData]);
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const currentData = sensorData[sensorData.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soy-green-50 to-soy-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-soy-green-800 mb-2">
                Dashboard IoT - Cultivo de Soja
              </h1>
              <p className="text-soy-green-700">
                Monitoramento em tempo real das condições de cultivo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isOnline ? "default" : "destructive"} className="animate-pulse-slow">
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <p className="text-sm text-soy-green-700">
                Última atualização: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <SensorCard
            title="Temperatura"
            value={currentData?.temperature}
            unit="°C"
            icon={Thermometer}
            color="soy-green"
            description="Temperatura ambiente"
            trend={sensorData.length > 1 ? 
              (currentData?.temperature || 0) - (sensorData[sensorData.length - 2]?.temperature || 0) : 0
            }
          />
          <SensorCard
            title="Umidade do Ar"
            value={currentData?.airHumidity}
            unit="%"
            icon={CloudRain}
            color="soy-yellow"
            description="Umidade relativa"
            trend={sensorData.length > 1 ? 
              (currentData?.airHumidity || 0) - (sensorData[sensorData.length - 2]?.airHumidity || 0) : 0
            }
          />
          <SensorCard
            title="Umidade do Solo"
            value={currentData?.soilHumidity}
            unit="%"
            icon={CloudRain}
            color="soy-green"
            description="Umidade do substrato"
            trend={sensorData.length > 1 ? 
              (currentData?.soilHumidity || 0) - (sensorData[sensorData.length - 2]?.soilHumidity || 0) : 0
            }
          />
          <SensorCard
            title="Iluminância"
            value={currentData?.illuminance}
            unit="lux"
            icon={Thermometer}
            color="soy-yellow"
            description="Intensidade luminosa"
            trend={sensorData.length > 1 ? 
              (currentData?.illuminance || 0) - (sensorData[sensorData.length - 2]?.illuminance || 0) : 0
            }
          />
          <SensorCard
            title="Fotoperíodo"
            value={currentData?.photoperiod}
            unit="h"
            icon={Thermometer}
            color="soy-green"
            description="Horas de luz/dia"
            trend={sensorData.length > 1 ? 
              (currentData?.photoperiod || 0) - (sensorData[sensorData.length - 2]?.photoperiod || 0) : 0
            }
          />
        </div>

        {/* Tabs for Charts and Data */}
        <Tabs defaultValue="charts" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/60 backdrop-blur-sm">
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="table">Tabela de Dados</TabsTrigger>
            </TabsList>
            <ExportDialog data={sensorData} />
          </div>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-soy-green-200">
                <CardHeader>
                  <CardTitle className="text-soy-green-800">Temperatura e Umidade</CardTitle>
                  <CardDescription className="text-soy-green-600">Monitoramento das condições climáticas</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataChart 
                    data={sensorData} 
                    dataKeys={["temperature", "airHumidity"]}
                    colors={["#22c55e", "#facc15"]}
                    yAxisLabel="Valor"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-soy-yellow-200">
                <CardHeader>
                  <CardTitle className="text-soy-green-800">Umidade do Solo</CardTitle>
                  <CardDescription className="text-soy-green-600">Controle da irrigação</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataChart 
                    data={sensorData} 
                    dataKeys={["soilHumidity"]}
                    colors={["#16a34a"]}
                    yAxisLabel="Umidade (%)"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-soy-green-200">
                <CardHeader>
                  <CardTitle className="text-soy-green-800">Iluminância</CardTitle>
                  <CardDescription className="text-soy-green-600">Intensidade luminosa ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataChart 
                    data={sensorData} 
                    dataKeys={["illuminance"]}
                    colors={["#eab308"]}
                    yAxisLabel="Lux"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-soy-yellow-200">
                <CardHeader>
                  <CardTitle className="text-soy-green-800">Fotoperíodo</CardTitle>
                  <CardDescription className="text-soy-green-600">Controle do ciclo de luz</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataChart 
                    data={sensorData} 
                    dataKeys={["photoperiod"]}
                    colors={["#ca8a04"]}
                    yAxisLabel="Horas"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Dados Recentes */}
            <Card className="bg-white/80 backdrop-blur-sm border-soy-green-200">
              <CardHeader>
                <CardTitle className="text-soy-green-800">Dados Mais Recentes</CardTitle>
                <CardDescription className="text-soy-green-600">Últimas 10 leituras dos sensores</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={sensorData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table">
            <Card className="bg-white/80 backdrop-blur-sm border-soy-green-200">
              <CardHeader>
                <CardTitle className="text-soy-green-800">Dados Históricos</CardTitle>
                <CardDescription className="text-soy-green-600">Registros detalhados dos sensores</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={sensorData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
