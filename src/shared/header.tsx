import { HeaderProps } from "@/src/types/props/header_props";
import { IconAccountCircle, IconAdd, IconCoat, IconStickNote2 } from "./icons";

export function Header({ handleNuevo }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border">
      <div className="mx-auto max-w-345 flex justify-between px-6 py-3 ">
        <div className="flex space-x-2 items-center">
          <div className="size-10 bg-secondary flex items-center justify-center rounded-lg">
            <IconCoat className="text-black size-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Control de Produccion</h1>
            <p className="text-xs">
              Sistema de registro de operaciones - Chompas
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button className="flex border border-border rounded-xl py-2 px-2 space-x-2 cursor-pointer items-center hover:scale-103 duration-300">
              <IconStickNote2 className="text-black size-5" />
              <p className="text-black">Ver reporte</p>
            </button>
            <button
              onClick={handleNuevo}
              className="flex border border-border rounded-xl py-2 px-2 space-x-1 cursor-pointer items-center bg-secondary hover:scale-103 duration-300"
            >
              <IconAdd className="text-black size-5" />
              <p className="text-black">Nuevo reporte</p>
            </button>
          </div>
          <div className="h-full w-0.5 bg-border"></div>
          <button className="w-12 h-full bg-secondary flex items-center justify-center rounded-lg cursor-pointer hover:scale-103 duration-300">
            <IconAccountCircle className="text-black size-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
