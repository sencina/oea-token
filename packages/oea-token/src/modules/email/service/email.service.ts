export interface EmailData {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export interface EmailService {
  sendEmail(emailData: EmailData): Promise<boolean>;
}
