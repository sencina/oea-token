import { ethers } from 'ethers';
import { EmailService } from '@modules/email/service/email.service';
import { WalletService } from '@modules/wallet/service/wallet.service.impl';
import { WalletMonitorService } from '@modules/wallet/service/wallet.monitoring.service';
import { ResendService } from '@modules/email/service/resend.service';

export class ServiceFactory {
  static createEmailService(apiKey: string, defaultFromEmail: string): EmailService {
    return new ResendService(apiKey, defaultFromEmail);
  }

  static createWalletService(provider: ethers.Provider): WalletService {
    return new WalletService(provider);
  }

  static createWalletMonitorService(
    config: {
      walletAddress: string;
      threshold: number;
      alertEmail: string;
      checkInterval?: string;
    },
    provider: ethers.Provider,
    resendApiKey: string,
    defaultFromEmail: string
  ): WalletMonitorService {
    const emailService = this.createEmailService(resendApiKey, defaultFromEmail);
    const walletService = this.createWalletService(provider);

    return new WalletMonitorService(config, walletService, emailService);
  }
}
