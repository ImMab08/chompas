import { ProductionEntry } from "@/src/types/production";

export interface HeaderProps {
  handleNuevo: () => void;
	handleVerReporte: () => void;
};

export interface DesktopTableProps {
  entries: ProductionEntry[];
  onEdit: (entry: ProductionEntry) => void;
  onDelete: (id: string) => void;
}