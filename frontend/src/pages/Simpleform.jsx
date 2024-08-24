"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { TiUpload } from "react-icons/ti";
import Man from "../assets/Man.png";
import Image from "next/image";

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Please add a file",
  }),
});

export function Simpleform() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
      file: null,
    },
  });

  function onSubmit(data) {}

  return (
    <div className="p-5 flex flex-col h-screen justify-between items-center">
      <div>
        <h1 className="font-semibold font-subfont lg:text-5xl text-4xl text-center">
          How can I help you today ?
        </h1>
      </div>
      <div className="">
        <Image src={Man} width={250} className="" alt="logo" />
      </div>
      <div className="w-full md:max-w-[69%] md:mx-auto">
        <Form {...form}>
          <Toaster />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="font-subfont flex flex-col px-2 my-2">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid w-full  items-center gap-1.5 my-2">
                        <Label
                          className="font-extrabold ml-2"
                          htmlFor="picture"
                        >
                          Add File
                        </Label>
                        <Input
                          className="w-full"
                          id="picture"
                          type="file"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <div className="w-full my-2">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="" placeholder="Enter your prompt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="float-right ml-2">
                  <Button className="my-2" type="submit">
                    <TiUpload size={25} />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
