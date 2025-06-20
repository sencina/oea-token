import { ServiceFactory } from '@modules/wallet/factory/service.factory';
import { connectRedis } from '@config/redis';
import { WalletMonitorService } from '@modules/wallet/service/wallet.monitoring.service';
import { PROVIDER } from '@modules/nft/utils/provider';
import { WALLET_ADDRESS, BALANCE_TRESHOLD, ALERT_EMAIL, RESEND_API_KEY } from '@env';

export class AppInitializer {
  private static walletMonitor: WalletMonitorService | null = null;

  static async initializeServices(): Promise<void> {
    await this.initializeRedis();
    await this.initializeWalletMonitoring();
  }

  private static async initializeRedis(): Promise<void> {
    try {
      await connectRedis();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      throw error;
    }
  }

  private static async initializeWalletMonitoring(): Promise<void> {
    try {
      const requiredVars = [
        { name: 'WALLET_ADDRESS', value: WALLET_ADDRESS },
        { name: 'BALANCE_THRESHOLD', value: BALANCE_TRESHOLD },
        { name: 'ALERT_EMAIL', value: ALERT_EMAIL },
        { name: 'RESEND_API_KEY', value: RESEND_API_KEY },
      ];
      const missingVars = requiredVars.filter(({ value }) => !value).map(({ name }) => name);

      if (missingVars.length > 0) {
        console.warn(`⚠️ Wallet monitoring disabled - missing environment variables: ${missingVars.join(', ')}`);
        return;
      }

      const provider = PROVIDER;

      await provider.getNetwork();

      this.walletMonitor = ServiceFactory.createWalletMonitorService(
        {
          walletAddress: WALLET_ADDRESS!,
          threshold: parseFloat(BALANCE_TRESHOLD!),
          alertEmail: ALERT_EMAIL!,
          checkInterval: '*/10 * * * *',
        },
        provider,
        RESEND_API_KEY!,
        ALERT_EMAIL!
      );

      // Start monitoring
      this.walletMonitor.startMonitoring();

      console.log('✅ Wallet balance monitoring initialized');
    } catch (error) {
      console.error('❌ Failed to initialize wallet monitoring:', error);
    }
  }

  static async shutdown(): Promise<void> {
    console.log('🛑 Shutting down services...');

    if (this.walletMonitor) {
      this.walletMonitor.stopMonitoring();
      console.log('✅ Wallet monitoring stopped');
    }

    console.log('✅ Graceful shutdown completed');
  }

  static getWalletMonitor(): WalletMonitorService | null {
    return this.walletMonitor;
  }
}
