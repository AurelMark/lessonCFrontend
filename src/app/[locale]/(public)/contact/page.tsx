"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/componentsUI/button";
import { Input } from "@/componentsUI/input";
import { Loader2, Mail, MapPinHouse, Phone } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactCreate, ContactCreateSchema } from "@/validation/contact";
import { useTranslations } from "use-intl";
import { Textarea } from "@/componentsUI/textarea";
import Link from "next/link";
import { PhoneInput } from "@/componentsUI/phone-input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMessageContact } from "@/api/contact";
import Footer from "@/custom/Footer";

export default function ContactPage() {
  const t = useTranslations();

  const form = useForm<ContactCreate>({
    resolver: zodResolver(ContactCreateSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      message: "",
      phone: "",
    },
    mode: "onTouched",
  });

  const handleCreateMessage = useMutation({
    mutationFn: (payload: ContactCreate) => createMessageContact(payload),
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("messageSentSuccess")}</div>
        </>
      );
      form.reset();
    },
    onError: () => {
      toast.error(t("loginError"));
    },
  });

  const onSubmit = (data: ContactCreate) => {
    handleCreateMessage.mutate(data);
  };

  return (
    <>
      <section className="py-4 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-between relative h-full lg:mb-0 mb-10 order-last lg:order-first">
              <div className="absolute inset-0">
                <Image
                  src="/placeholder.svg"
                  alt="Contact section"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-blue-950 opacity-60" />
              </div>
              <h1 className="relative z-10 font-bold text-4xl mt-11 ml-11 text-white">
                {t("contactForm.contactUs")}
              </h1>
              <div className="relative z-10 p-5 lg:p-11 w-full mt-auto">
                <Card className="rounded-lg shadow-lg bg-card">
                  <CardContent className="p-6">
                    <ContactInfo icon="phone" label="069910011" />
                    <ContactInfo icon="email" label="phonetics.md@gmail.com" />
                    <ContactInfo
                      icon="address"
                      label="Strada Vasile Alecsandri 105, Mun. Chișinău"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="bg-card p-5 lg:p-11 order-first lg:order-last mb-8 lg:mb-0 border-[3px] border-muted shadow-2xl">
              <h2 className="font-semibold text-4xl mb-11">
                {t("contactForm.sendUsAMessage")}
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  autoComplete="on"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactForm.firstName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactForm.lastName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactForm.email")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactForm.phone")}</FormLabel>
                        <FormControl>
                          <PhoneInput defaultCountry="MD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactForm.message")}</FormLabel>
                        <FormControl>
                          <Textarea rows={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={handleCreateMessage.isPending}
                    className="w-full h-12 rounded-full text-base font-semibold"
                  >
                    {handleCreateMessage.isPending ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      t("contactForm.send")
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

type ContactInfoProps = {
  icon: "phone" | "email" | "address";
  label: string;
};

function ContactInfo({ icon, label }: ContactInfoProps) {
  const icons = {
    phone: <Phone className="!w-6 !h-6" />,
    email: <Mail className="!w-6 !h-6" />,
    address: <MapPinHouse className="!w-6 !h-6" />,
  };

  const hrefType: Record<"phone" | "email", string> = {
    phone: "tel:+37369910011",
    email: "mailto:phonetics.md@gmail.com",
  };

  function isHrefKey(val: string): val is keyof typeof hrefType {
    return val === "phone" || val === "email";
  }

  return (
    <div className="grid grid-cols-[16px_1fr] mb-6 last:mb-0">
      {icons[icon]}
      {isHrefKey(icon) ? (
        <Link
          href={hrefType[icon]}
          className="text-base font-normal leading-6 ml-5"
        >
          {label}
        </Link>
      ) : (
        <span className="text-base font-normal leading-6 ml-5">{label}</span>
      )}
    </div>
  );
}
