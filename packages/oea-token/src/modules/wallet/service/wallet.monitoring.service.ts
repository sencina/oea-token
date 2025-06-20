import cron, { ScheduledTask } from 'node-cron';
import { WalletService } from '../service/wallet.service.impl';
import { EmailService } from '@modules/email/service/email.service';
import { redisClient } from '@config/redis';

interface WalletMonitorConfig {
  walletAddress: string;
  threshold: number;
  alertEmail: string;
  checkInterval?: string; // cron format, default: every 10 minutes
}

export class WalletMonitorService {
  private config: WalletMonitorConfig;
  private walletService: WalletService;
  private emailService: EmailService;
  private readonly REDIS_KEY_PREFIX = 'wallet_notification:';
  private readonly COOLING_PERIOD_SECONDS = 24 * 60 * 60; // 24 hours
  private cronJob?: ScheduledTask;

  constructor(config: WalletMonitorConfig, walletService: WalletService, emailService: EmailService) {
    this.config = {
      ...config,
      checkInterval: config.checkInterval || '*/10 * * * *', // every 10 minutes
    };
    this.walletService = walletService;
    this.emailService = emailService;
  }

  async checkWalletBalance(): Promise<void> {
    try {
      console.log(`Checking wallet balance for ${this.config.walletAddress}...`);

      const walletBalance = await this.walletService.getWalletBalance(this.config.walletAddress);
      console.log(`✅ Wallet balance: ${walletBalance.balance} ETH`);

      if (this.walletService.isBalanceBelowThreshold(walletBalance.balance, this.config.threshold)) {
        const canSendNotification = await this.canSendNotification();

        if (canSendNotification) {
          const emailSent = await this.sendLowBalanceAlert(walletBalance.balance);

          if (emailSent) {
            await this.recordNotificationSent();
            console.log('✅ Low balance alert sent successfully');
          } else {
            console.error('❌ Failed to send low balance alert');
          }
        } else {
          console.log('⚠️ Low balance detected but notification already sent within cooling period');
        }
      } else {
        console.log(`✅ Wallet balance is sufficient (${walletBalance.balance} ETH > ${this.config.threshold} ETH)`);
      }
    } catch (error: any) {
      console.error('❌ Error in wallet balance check:', error.message);

      // Don't crash the monitoring service, just log and continue
      if (error.message.includes('Network sync issue')) {
        console.log('⏳ Will retry on next scheduled check...');
      }
    }
  }

  private async canSendNotification(): Promise<boolean> {
    try {
      const redisKey = `${this.REDIS_KEY_PREFIX}${this.config.walletAddress}`;
      const lastNotification = await redisClient.get(redisKey);
      return !lastNotification;
    } catch (error) {
      console.error('Error checking notification cooldown:', error);
      return false;
    }
  }

  private async recordNotificationSent(): Promise<void> {
    try {
      const redisKey = `${this.REDIS_KEY_PREFIX}${this.config.walletAddress}`;
      await redisClient.setEx(redisKey, this.COOLING_PERIOD_SECONDS, Date.now().toString());
    } catch (error) {
      console.error('Error recording notification:', error);
    }
  }

  private async sendLowBalanceAlert(currentBalance: number): Promise<boolean> {
    return await this.emailService.sendEmail({
      to: [this.config.alertEmail],
      subject: '⚠️ NFT Wallet Balance Alert - Low Funds',
      html: `
        <h2>⚠️ NFT Wallet Balance Alert - Low Funds</h2>
        <p><strong>Your NFT minting wallet is running low on funds!</strong></p>
        <p><strong>Wallet Address:</strong> ${this.config.walletAddress}</p>
        <p><strong>Current Balance:</strong> ${currentBalance.toFixed(4)} ETH</p>
        <p><strong>Threshold:</strong> ${this.config.threshold} ETH</p>
        <p>Please top up your wallet to continue minting NFTs.</p> 
        <hr>
        <p><small>This alert will not be sent again for 24 hours.</small></p>
        <p>Thank you for using our NFT minting service.</p>
        <p>Best regards,</p>
        <p>The NFT Minting Team</p>
        `,
    });
  }

  startMonitoring(): void {
    console.log(`Starting wallet balance monitoring (${this.config.checkInterval})...`);

    this.cronJob = cron.schedule(this.config.checkInterval!, async () => {
      await this.checkWalletBalance();
    });

    // Run once immediately
    this.checkWalletBalance();
  }

  stopMonitoring(): void {
    if (this.cronJob) {
      this.cronJob.destroy();
      this.cronJob = undefined;
    }
    console.log('Wallet monitoring stopped');
  }

  async getLastNotificationTime(): Promise<Date | null> {
    try {
      const redisKey = `${this.REDIS_KEY_PREFIX}${this.config.walletAddress}`;
      const timestamp = await redisClient.get(redisKey);
      return timestamp ? new Date(parseInt(timestamp)) : null;
    } catch (error) {
      console.error('Error getting last notification time:', error);
      return null;
    }
  }
}
