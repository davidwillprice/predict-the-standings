"use client";

const ReportForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /**I would have liked to have used <form action={}> and the formData directly, but resend was unresponsive */
    const formData = new FormData(event.currentTarget);
    formData.set("reportedDisplayName", "reportedDisplayName");
    formData.set("reportedUserId", "reportedUserId");
    formData.set("reporterDisplayName", "reporterDisplayName");
    formData.set("reporterUserId", "reporterUserId");

    try {
      const response = await fetch("/api/email/report", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="reason" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReportForm;
