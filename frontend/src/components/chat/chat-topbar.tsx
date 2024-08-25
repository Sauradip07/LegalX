"use client";

import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { getSelectedModel } from "@/lib/model-helper";

interface ChatTopbarProps {
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
}

export default function ChatTopbar({
  setSelectedModel,
  isLoading,
  chatId,
  messages,
}: ChatTopbarProps) {
  // const [models, setModels] = React.useState<string[]>([]);
  // const [open, setOpen] = React.useState(false);
  // const [currentModel, setCurrentModel] = React.useState<string | null>(null);

  // useEffect(() => {
  //   setCurrentModel(getSelectedModel());

  //   const env = process.env.NODE_ENV;

  //   const fetchModels = async () => {
  //     if (env === "production") {
  //       const fetchedModels = await fetch(process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags");
  //       const json = await fetchedModels.json();
  //       const apiModels = json.models.map((model : any) => model.name);
  //       setModels([...apiModels]);
  //     } 
  //     else {
  //       const fetchedModels = await fetch("/api/tags") 
  //       const json = await fetchedModels.json();
  //       const apiModels = json.models.map((model : any) => model.name);
  //       setModels([...apiModels]);
  //   }
  //   }
  //   fetchModels();
  // }, []);

  // const handleModelChange = (model: string) => {
  //   setCurrentModel(model);
  //   setSelectedModel(model);
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem("selectedModel", model);
  //   }
  //   setOpen(false);
  // };

  return (
    null
  );
}
