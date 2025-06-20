import { Resend } from 'resend';
import { EmailData, EmailService } from './email.service';
import { BadRequestException } from '@utils/errors';

export class ResendService implements EmailService {
  private resend: Resend;
  private defaultFromEmail: string;

  constructor(apiKey: string, defaultFromEmail: string) {
    this.resend = new Resend(apiKey);
    this.defaultFromEmail = defaultFromEmail;
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    const { error } = await this.resend.emails.send({
      from: emailData.from || this.defaultFromEmail,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }
    return true;
  }

  //   async sendWalletBalanceAlert(
  //     to: string,
  //     walletAddress: string,
  //     currentBalance: number,
  //     threshold: number
  //   ): Promise<boolean> {
  //     const emailData: EmailData = {
  //       to: [to],
  //       subject: '⚠️ NFT Wallet Balance Alert - Low Funds',
  //       html: `
  //         <h2>Wallet Balance Alert</h2>
  //         <p><strong>Your NFT minting wallet is running low on funds!</strong></p>
  //         <p><strong>Wallet Address:</strong> ${walletAddress}</p>
  //         <p><strong>Current Balance:</strong> ${currentBalance.toFixed(4)} ETH</p>
  //         <p><strong>Threshold:</strong> ${threshold} ETH</p>
  //         <p>Please top up your wallet to continue minting NFTs.</p>
  //         <hr>
  //         <p><small>This alert will not be sent again for 24 hours.</small></p>
  //       `
  //     };

  //     return await this.sendEmail(emailData);
  //   }
}
