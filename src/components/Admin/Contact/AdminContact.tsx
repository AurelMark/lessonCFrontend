"use client";

import {
  ContactReply,
  GetEmails,
  GetEmailsArray,
} from "@/validation/contact";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/componentsUI/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsUI/tooltip";
import {
  Send,
  Trash2,
  Mail,
  Phone,
  MessageCircle,
  User,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmailsById, replyEmailToClient } from "@/api/contact";
import { toast } from "sonner";
import { useState } from "react";
import { AdminContactModals } from "./AdminContactModals";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type TContactsListProps = {
  data: GetEmailsArray;
};

const ContactsList = ({ data }: TContactsListProps) => {
  const t = useTranslations("dashboard.adminContacts");
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const replyingId = searchParams.get("id") || null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const replyToClientMessage = useMutation<any, Error, ContactReply>({
    mutationFn: (data: ContactReply) => replyEmailToClient(data),
    onSuccess: () => {
      toast.success(t("ReplySentSuccess"));
      queryClient.invalidateQueries({ queryKey: ["contactsEmail"] });
    },
    onError: () => {
      toast.error(t("ReplySentFailed"));
    },
  });

  function getContactFromParams(
    searchParams: ReturnType<typeof useSearchParams>
  ): Partial<GetEmails> & { page: string } {
    return {
      id: searchParams.get("id") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      message: searchParams.get("message") || "",
      phone: searchParams.get("phone") || "",
      email: searchParams.get("email") || "",
      page: searchParams.get("page") || "",
    };
  }

  const deleteMutation = useMutation({
    mutationFn: deleteEmailsById,
    onSuccess: () => {
      toast.success(
        <>
          <div className="font-bold">{t("contactDeletedSuccess")}</div>
        </>
      );
      queryClient.invalidateQueries({ queryKey: ["contactsEmail"] });
    },
  });

  const handleOnReply = (contact: GetEmails) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(contact).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
    setReplyModalOpen(true);
  };

  const handleOnDelete = (id: string) => deleteMutation.mutate(id);

  function clearUrlParams() {
    router.replace(pathname);
  }

  const handleCloseModal = () => {
    setReplyModalOpen(false);
    clearUrlParams();
  };

  const handleOnSubmit = (message: string) => {
    const contact = getContactFromParams(searchParams);
    const fullName = `${contact.firstName} ${contact.lastName}`.trim();

    const dataToSend: ContactReply = {
      id: contact.id!,
      email: contact.email!,
      phone: contact.phone!,
      fullName,
      subject: "Reply from admin",
      message,
    };
    replyToClientMessage.mutate(dataToSend);
    handleCloseModal();
  };

  return (
    <div className="space-y-4">
      {data.map((contact, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 flex flex-col gap-2 shadow relative bg-background"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-500" />
            <strong>
              {contact.firstName} {contact.lastName}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-500" />
            <span>{t("email")}: </span>
            <Link className="!text-blue-500" href={`mailto:${contact.email}`}>
              {contact.email}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-500" />
            <span>{t("phone")}: </span>
            <Link className="!text-blue-500" href={`tel:${contact.phone}`}>
              {contact.phone}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary-500" />
            <span>{t("message")}: </span>
            {contact.message}
          </div>
          <div className="absolute top-2 right-2 flex gap-4">
            {!contact.isReply && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={
                        replyToClientMessage.isPending &&
                        replyingId === contact.id
                      }
                      onClick={() => handleOnReply(contact)}
                    >
                      {replyToClientMessage.isPending &&
                      replyingId === contact.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Send />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("reply")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => contact.id && handleOnDelete(contact.id)}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p> {t("delete")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
      <AdminContactModals
        open={replyModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
};

export default ContactsList;
