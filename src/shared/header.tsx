"use client";

import { HeaderProps } from "@/src/types/props/general_props";
import {
  IconAccountCircle,
  IconAdd,
  IconCoat,
  IconMenu,
  IconStickNote2,
} from "./icons";
import { useEffect, useState } from "react";

export function Header({ handleNuevo, handleVerReporte }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  function handleMenu() {
    setOpenMenu(!openMenu);
  }

  return (
    <>
      <header className="bg-white border-b border-border">
        <div className="mx-auto max-w-345 flex items-center justify-between px-3 md:px-6 py-3 ">
          <div className="flex space-x-2 items-center">
            <div className="size-8 md:size-10 bg-secondary flex items-center justify-center rounded-lg">
              <IconCoat className="text-black size-6 md:size-7" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-lg font-bold">
                Control de Produccion
              </h1>
              <p className="text-[10px] md:text-xs ">
                Sistema de registro de operaciones - Chompas
              </p>
            </div>
          </div>

          <IconMenu onClick={handleMenu} className="size-7 block md:hidden" />

          <div className="hidden md:flex space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={handleVerReporte}
                className="flex border border-border rounded-xl py-2 px-2 space-x-2 cursor-pointer items-center hover:scale-103 duration-300"
              >
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

      {openMenu && (
        <div className="fixed inset-0 z-50">
          {/* fondo */}
          <div onClick={handleMenu} className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${openMenu ? "opacity-100" : "opacity-0 pointer-events-none"}`}/>

          {/* panel */}
          <div className={`absolute right-0 top-0 w-3/4 max-w-sm h-full bg-white shadow-xl transition-transform duration-300 ${openMenu ? "translate-x-0" : "translate-x-full"}`}>
            Menu
          </div>
        </div>
      )}
    </>
  );
}
