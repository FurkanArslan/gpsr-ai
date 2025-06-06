"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Check,
  X,
  User,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  File,
  Package,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useAdminRepresentativeRequest } from "@/hooks/admin/use-admin-representative-request";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface RepresentativeRequestModalProps {
  requestId: string | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function RepresentativeRequestModal({
  requestId,
  open,
  onClose,
  onApprove,
  onReject,
}: RepresentativeRequestModalProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: request,
    isLoading,
    updateNotes,
  } = useAdminRepresentativeRequest(requestId);

  const saveNotes = async () => {
    if (!requestId) return;

    try {
      setIsSubmitting(true);
      await updateNotes.mutateAsync({ id: requestId, notes: adminNotes });
      toast.success("Notes saved successfully");
    } catch (error) {
      toast.error("Failed to save notes");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!requestId) return;

    try {
      setIsSubmitting(true);
      await onApprove(requestId);
      toast.success("Request approved successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to approve request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;

    try {
      setIsSubmitting(true);
      await onReject(requestId);
      toast.success("Request rejected successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <DialogTitle>Representative Request Details</DialogTitle>
              <DialogDescription>
                Review the details of this authorized representative request
              </DialogDescription>
            </div>

            {!isLoading && request && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    request.region === "eu"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {request.region.toUpperCase()} Representation
                </Badge>
                {renderStatusBadge(request.status)}
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-6">
            <TabsTrigger value="details">Request Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Admin Notes</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6">
            <TabsContent value="details" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <Building2 className="mr-2 h-5 w-5 text-primary" />
                        Company Information
                      </h3>

                      <div className="space-y-4 bg-muted/50 rounded-lg p-4 border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Company Name
                            </p>
                            <p className="font-medium">
                              {request?.company_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Company Number
                            </p>
                            <p className="font-medium">
                              {request?.company_number}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p className="font-medium">
                            {request?.street_address}, {request?.city},{" "}
                            {request?.postal_code}, {request?.country}
                          </p>
                        </div>

                        {request?.vat_number && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              VAT Number
                            </p>
                            <p className="font-medium">{request?.vat_number}</p>
                          </div>
                        )}

                        {request?.website_url && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Website
                            </p>
                            <div className="flex items-center">
                              <a
                                href={request?.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium flex items-center"
                              >
                                {request?.website_url}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Business Role
                          </p>
                          <p className="font-medium capitalize">
                            {request?.business_role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <User className="mr-2 h-5 w-5 text-primary" />
                        Contact Information
                      </h3>

                      <div className="space-y-4 bg-muted/50 rounded-lg p-4 border">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Contact Name
                          </p>
                          <p className="font-medium">{request?.contact_name}</p>
                        </div>

                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a
                            href={`mailto:${request?.contact_email}`}
                            className="text-primary hover:underline"
                          >
                            {request?.contact_email}
                          </a>
                        </div>

                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a
                            href={`tel:${request?.contact_phone}`}
                            className="text-primary hover:underline"
                          >
                            {request?.contact_phone}
                          </a>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Position
                          </p>
                          <p className="font-medium">
                            {request?.contact_position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Package className="mr-2 h-5 w-5 text-primary" />
                      Product Information
                    </h3>

                    <div className="space-y-4 bg-muted/50 rounded-lg p-4 border">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Product Category
                        </p>
                        <p className="font-medium">
                          {request?.product_category}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Product Information
                        </p>
                        <p className="whitespace-pre-wrap">
                          {request?.product_information}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                      Compliance Information
                    </h3>

                    <div className="space-y-4">
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="ce-marking">
                          <AccordionTrigger>CE/UKCA Marking</AccordionTrigger>
                          <AccordionContent>
                            <p className="font-medium">
                              {request?.ce_ukca_marking}
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="technical-file">
                          <AccordionTrigger>
                            Technical File Status
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="font-medium">
                              {request?.technical_file_ready}
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="required-tests">
                          <AccordionTrigger>Required Tests</AccordionTrigger>
                          <AccordionContent>
                            <p className="font-medium">
                              {request?.required_tests_conducted}
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="test-reports">
                          <AccordionTrigger>Test Reports</AccordionTrigger>
                          <AccordionContent>
                            <p className="font-medium">
                              {request?.test_reports_available}
                            </p>
                            {request?.test_reports_file_url && (
                              <div className="mt-2">
                                <a
                                  href={request.test_reports_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-primary hover:underline"
                                >
                                  <File className="h-4 w-4 mr-2" />
                                  View Test Report File
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Confirmations
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            request?.confirm_accuracy
                              ? "bg-green-100"
                              : "bg-red-100"
                          } mr-2`}
                        >
                          {request?.confirm_accuracy ? (
                            <Check className="h-3 w-3 text-green-700" />
                          ) : (
                            <X className="h-3 w-3 text-red-700" />
                          )}
                        </div>
                        <p className="text-sm">
                          Confirmed that all information provided is accurate
                          and complete
                        </p>
                      </div>

                      <div className="flex items-start">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            request?.confirm_responsibility
                              ? "bg-green-100"
                              : "bg-red-100"
                          } mr-2`}
                        >
                          {request?.confirm_responsibility ? (
                            <Check className="h-3 w-3 text-green-700" />
                          ) : (
                            <X className="h-3 w-3 text-red-700" />
                          )}
                        </div>
                        <p className="text-sm">
                          Understands that Dorukwell does not verify technical
                          files, and compliance remains the manufacturer's
                          responsibility
                        </p>
                      </div>

                      <div className="flex items-start">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            request?.confirm_terms
                              ? "bg-green-100"
                              : "bg-red-100"
                          } mr-2`}
                        >
                          {request?.confirm_terms ? (
                            <Check className="h-3 w-3 text-green-700" />
                          ) : (
                            <X className="h-3 w-3 text-red-700" />
                          )}
                        </div>
                        <p className="text-sm">
                          Agrees to Dorukwell's Authorised Representative
                          service terms
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-6 space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="font-medium mb-2 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Test Reports File
                    </h3>

                    {request?.test_reports_file_url ? (
                      <a
                        href={request.test_reports_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <File className="h-4 w-4 mr-2" />
                        View Test Report File
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No test report file available
                      </p>
                    )}
                  </div>

                  <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200">
                    <h3 className="font-medium mb-2 text-amber-800">
                      Additional Documents
                    </h3>
                    <p className="text-amber-700 text-sm">
                      The customer has not uploaded any additional documents
                      yet. They will be prompted to upload required
                      documentation after their request is approved.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add private notes about this representative request. These
                  notes are only visible to administrators.
                </p>

                <Textarea
                  className="min-h-[150px]"
                  placeholder="Add your notes here..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />

                <Button onClick={saveNotes} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 pt-4">
          {request?.status === "pending" ? (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          ) : (
            <Button onClick={() => onClose()}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function renderStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200"
        >
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Rejected
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-700 border-gray-200"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
