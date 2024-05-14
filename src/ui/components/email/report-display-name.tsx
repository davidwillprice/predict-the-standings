interface EmailTemplateProps {
  reason: string;
  reportedDisplayName: string;
  reportedUserId: string;
  reporterDisplayName: string;
  reporterUserId: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  reason,
  reportedDisplayName,
  reportedUserId,
  reporterDisplayName,
  reporterUserId,
}) => (
  <div>
    <h3>Reported User Details</h3>
    <p>Display Name: {reportedDisplayName}</p>
    <p>User Id: {reportedUserId}</p>
    <hr />
    <p>Reason:</p>
    <p>{reason}</p>
    <hr />
    <h3>User Details of Report Submitter (If avaiable)</h3>
    <p>Display Name: {reporterDisplayName}</p>
    <p>User Id: {reporterUserId}</p>
  </div>
);
