import { EmailTemplate } from "@components/email/report-display-name";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const formDataObject: {
    [key: string]: FormDataEntryValue | FormDataEntryValue[];
  } = {};

  // Convert FormData to a plain object
  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value;
  }
  const reason = formDataObject.reason as string;
  const reportedDisplayName = formDataObject.reportedDisplayName as string;
  const reportedUserId = formDataObject.reportedUserId as string;
  const reporterDisplayName = formDataObject.reporterDisplayName as string;
  const reporterUserId = formDataObject.reporterUserId as string;

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: `Display Name Reported - ${reportedDisplayName}`,
      text: "Display name reported",
      react: EmailTemplate({
        reason,
        reportedDisplayName,
        reportedUserId,
        reporterDisplayName,
        reporterUserId,
      }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
