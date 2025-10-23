"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

type ReplyModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
};

export const AdminContactModals = ({
  open,
  onClose,
  onSubmit,
}: ReplyModalProps) => {
  const t = useTranslations("dashboard.adminContacts");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!message.trim()) {
      setError(t("messageRequired"));
      return;
    }
    setError(null);
    onSubmit(message);
    setMessage("");
    onClose();
  };

  const handleClose = () => {
    setMessage("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("replyToClient")}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("typeMessagePlaceholder")}
          rows={6}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} type="button">
            {t("cancel")}
          </Button>
          <Button onClick={handleSend} type="button">
            {t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
