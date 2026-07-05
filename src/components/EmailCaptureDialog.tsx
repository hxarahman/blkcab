import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

interface EmailCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmailCaptureDialog = ({ open, onOpenChange }: EmailCaptureDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = emailSchema.parse({ email });

      const { error: insertError } = await supabase.from("players").insert({
        email: validated.email.toLowerCase(),
        marketing_opt_in: true,
      });

      // 23505 = already on the list — treat as success
      if (insertError && insertError.code !== "23505") throw insertError;

      trackEvent("email_signup", { source: "email_capture_dialog" });

      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as online ordering launches.",
      });
      
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid email",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Couldn't save your email — please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Online Ordering Coming Soon</DialogTitle>
          <DialogDescription className="text-base pt-2">
            We're working on bringing online ordering to BLK CAB®. Enter your email to be notified when it launches.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          <Button
            type="submit"
            variant="cta"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SUBMITTING..." : "NOTIFY ME"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
